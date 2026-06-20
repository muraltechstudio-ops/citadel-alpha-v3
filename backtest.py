import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json

# S&P 500 tickers (top 100 by market cap + tickers from CSV)
TICKERS = [
    "AAPL","MSFT","GOOGL","AMZN","NVDA","META","TSLA","GOOG",
    "UNH","XOM","LLY","JPM","JNJ","V","PG","MA","CVX","HD",
    "MRK","ABBV","BAC","KO","PEP","AVGO","COST","WMT","DIS",
    "ADBE","NFLX","CRM","AMD","TXN","QCOM","AMGN","IBM","HON",
    "CAT","GE","GS","BA","MMM","AXP","MS","C","WFC","BLK",
    "LRCX","MU","KLAC","WDC","STX","FTI","NRG","GME",
    "PHM","THC","URI","NEM","DVN","EOG","COP","RCL",
    "M","RIG","EQT","FCX","FOSL","SIG","TPR","SE",
    "PBI","HAR","BBBY","CPRI","OKE","CSX","BBY","AMAT",
    "NTAP","VLO","GWW","NFLX","HCA","TRIP","CMG","LLY",
    "AES","AZO","QCOM","VRSN","MKC","CHD","CINF","SBUX",
    "HSY","AMT","KLAC","LRCX","REGN","HUM","NEM","BBBY",
    "ADT","GME","PYPL","EQT","RRC","DVN","MUR","APA",
    "CF","HAR","RRC","DVN","FSLR","FTI","GE","OI",
    "AVGO","ADBE","CCL","LLY","NRG","SLG","URI","MU",
    "JEF","MMM","FOX","TPR","RCL","AVGO","NRG","PBI",
    "SE","LB","FOSL","TPR","UAL","WDC","STX","TE","NEM",
]

def fetch_data():
    """Fetch 5 years of monthly data for all tickers"""
    start = datetime(2020, 1, 1)
    end = datetime(2026, 7, 1)

    all_data = {}
    failed = []

    for i, ticker in enumerate(TICKERS):
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(start=start, end=end, interval="1mo")
            if len(hist) < 12:
                failed.append((ticker, "less than 12 months"))
                continue
            # Store adjusted close prices
            col = 'Adj Close' if 'Adj Close' in hist.columns else 'Close'
            data_dict = {}
            for d, v in zip(hist.index, hist[col]):
                key = str(d.date())[:7]  # YYYY-MM
                data_dict[key] = round(float(v), 2)
            all_data[ticker] = data_dict
        except Exception as e:
            failed.append((ticker, str(e)[:50]))

        if (i + 1) % 20 == 0:
            print(f"Progress: {i+1}/{len(TICKERS)} tickers")

    print(f"\nTickers récupérés: {len(all_data)}/{len(TICKERS)}")
    print(f"Échecs: {len(failed)}")
    for t, r in failed[:10]:
        print(f"  {t}: {r}")

    return all_data

def run_backtest(data):
    """Run Dual Momentum strategy on the data"""
    results = []
    capital = 10000  # Start with 10k
    peak = capital

    # Get all months across all tickers
    all_months = set()
    for ticker, prices in data.items():
        for date in prices.keys():
            all_months.add(date[:7])  # YYYY-MM

    months = sorted(all_months)

    for month_idx, month in enumerate(months):
        if month_idx < 12:  # Need 12 months of data
            continue

        # Find next month (to calculate actual 1-month return)
        if month_idx + 1 >= len(months):
            break
        next_month = months[month_idx + 1]

        # Month 12 months ago (for momentum calculation)
        prev_month = months[month_idx - 12]

        # Calculate 12-month momentum for each ticker (for SELECTION)
        candidates = []

        for ticker, prices in data.items():
            if month not in prices or prev_month not in prices:
                continue
            if prices[prev_month] <= 0:
                continue

            momentum_12m = ((prices[month] - prices[prev_month]) / prices[prev_month]) * 100

            # Skip if momentum is absurd (stock split not adjusted properly)
            if abs(momentum_12m) > 500:
                continue

            if momentum_12m > 0:  # Absolute momentum filter
                candidates.append((ticker, momentum_12m))

        # Select top 5 (by 12-month momentum)
        candidates.sort(key=lambda x: x[1], reverse=True)
        top5 = candidates[:5]

        if not top5:
            results.append({"month": month, "capital": capital, "signal": "CASH", "return": 0})
            continue

        # Calculate ACTUAL monthly return (1-month performance of selected tickers)
        alloc = capital / len(top5)
        monthly_return = 0
        signals = []

        for ticker, momentum_12m in top5:
            if next_month not in data.get(ticker, {}):
                continue
            price_now = prices.get(month, 0)
            price_next = data[ticker][next_month]
            if price_now <= 0:
                continue

            # Actual 1-month return
            monthly_pct = ((price_next - price_now) / price_now) * 100

            # Cap extreme returns (>100% in a month = likely split issue)
            if abs(monthly_pct) > 100:
                monthly_pct = 0

            signals.append({
                "ticker": ticker,
                "momentum_12m": round(momentum_12m, 1),
                "return_1m": round(monthly_pct, 1),
                "price": round(price_now, 2)
            })
            monthly_return += alloc * (monthly_pct / 100)

        if not signals:
            results.append({"month": month, "capital": capital, "signal": "CASH", "return": 0})
            continue

        capital += monthly_return
        if capital > peak:
            peak = capital

        results.append({
            "month": month,
            "capital": round(capital, 2),
            "peak": round(peak, 2),
            "signal": signals,
            "return": round(monthly_return, 2)
        })

    return results

def print_results(results):
    """Print summary"""
    if not results:
        return

    initial = 10000
    final = results[-1]["capital"]
    total_return = ((final / initial) - 1) * 100

    # Calculate CAGR
    first_month = results[0]["month"]
    last_month = results[-1]["month"]
    years = (datetime.strptime(last_month + "-01", "%Y-%m-%d") - datetime.strptime(first_month + "-01", "%Y-%m-%d")).days / 365.25
    cagr = (pow(final / initial, 1 / years) - 1) * 100 if years > 0 else 0

    # Max drawdown
    max_dd = 0
    peak = initial
    for r in results:
        if r["capital"] > peak:
            peak = r["capital"]
        dd = ((peak - r["capital"]) / peak) * 100
        if dd > max_dd:
            max_dd = dd

    # Win rate
    wins = sum(1 for r in results if r.get("signal") != "CASH" and r.get("return", 0) > 0)
    total_trades = sum(1 for r in results if r.get("signal") != "CASH" and r.get("return") is not None)
    if total_trades == 0:
        total_trades = 1

    print("\n" + "="*60)
    print("  BACKTEST DUAL MOMENTUM — yfinance")
    print("="*60)
    print(f"\nPériode: {results[0]['month']} à {results[-1]['month']} ({years:.1f} ans)")
    print(f"Capital initial: {initial:,.0f}€")
    print(f"Capital final: {final:,.0f}€")
    print(f"Rendement total: +{total_return:,.0f}%")
    print(f"CAGR: {cagr:.1f}%")
    print(f"Max drawdown: {max_dd:.1f}%")
    print(f"Mois gagnants: {wins}/{total_trades} ({wins/total_trades*100:.1f}%)")

    print("\nDerniers signaux:")
    for r in results[-3:]:
        if r.get("signal") and r["signal"] != "CASH":
            tickers = " / ".join([s["ticker"] for s in r["signal"]])
            print(f"  {r['month']}: {tickers} | Capital: {r['capital']:,.0f}€")

    print("\nTop 10 meilleurs mois:")
    sorted_results = sorted([r for r in results if r.get("signal") != "CASH" and r.get("return") is not None], key=lambda x: x["return"], reverse=True)
    for r in sorted_results[:10]:
        print(f"  {r['month']}: +{r['return']:+.0f}€ (Capital: {r['capital']:,.0f}€)")

    print("\nPire mois:")
    worst = sorted([r for r in results if r.get("signal") != "CASH" and r.get("return") is not None], key=lambda x: x["return"])
    for r in worst[:5]:
        print(f"  {r['month']}: {r['return']:+.0f}€ (Capital: {r['capital']:,.0f}€)")

# Run
print("Téléchargement des données yfinance...")
data = fetch_data()

print("\nExécution du backtest...")
results = run_backtest(data)

print_results(results)

# Save
with open('C:/Users/Cyril/OneDrive/Dokumenty/citadel-alpha-v3/backtest_results.json', 'w') as f:
    json.dump(results, f, indent=2, default=str)
print("\nRésultats sauvegardés dans backtest_results.json")
