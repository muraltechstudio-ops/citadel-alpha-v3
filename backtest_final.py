import yfinance as yf
import json
from datetime import datetime

# Tickers S&P 500 (top 100 + tous ceux du CSV)
TICKERS = [
    "AAPL","MSFT","GOOGL","AMZN","NVDA","META","TSLA","GOOG",
    "UNH","XOM","LLY","JPM","JNJ","V","PG","MA","CVX","HD",
    "MRK","ABBV","BAC","KO","PEP","AVGO","COST","WMT","DIS",
    "ADBE","NFLX","CRM","AMD","TXN","QCOM","AMGN","IBM","HON",
    "CAT","GE","GS","BA","MMM","AXP","MS","C","WFC","BLK",
    "LRCX","MU","KLAC","WDC","STX","FTI","NRG",
    "PHM","THC","URI","NEM","DVN","EOG","COP","RCL",
    "M","RIG","EQT","FCX","FOSL","SIG","TPR","SE",
    "PBI","BBBY","CPRI","OKE","CSX","BBY","AMAT","NTAP",
    "VLO","GWW","HCA","TRIP","CMG","LLY","AES","AZO",
    "QCOM","VRSN","MKC","CHD","CINF","SBUX","HSY","AMT",
    "REGN","HUM","ADT","PYPL","RRC","MUR","APA","CF",
    "FSLR","GE","OI","CCL","SLG","URI","JEF","FOX",
    "LB","UAL","TE","NEM","GME",
]

print("Récupération des données yfinance...")
data = {}
total = len(TICKERS)

for i, ticker in enumerate(TICKERS):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(start="2020-01-01", end="2026-07-01", interval="1mo")
        if len(hist) < 12:
            continue
        col = "Close"
        monthly = {}
        for d, v in zip(hist.index, hist[col]):
            monthly[str(d.date())[:7]] = round(float(v), 4)
        data[ticker] = monthly
    except:
        pass
    if (i + 1) % 25 == 0:
        print(f"  {i+1}/{total}")

print(f"\nTickers récupérés: {len(data)}")

# =========== BACKTEST ===========
print("\nExécution du backtest...")

capital = 3000.0
peak = capital
max_dd = 0.0
trades_executed = 0
wins = 0
losses = 0
total_fees = 0.0

# Tous les mois disponibles
months = sorted(set(m for t in data for m in data[t]))
print(f"Mois disponibles: {months[0]} à {months[-1]} ({len(months)} mois)")

monthly_details = []
pause_mode = False

for idx in range(12, len(months) - 1):
    month = months[idx]
    prev_12m = months[idx - 12]
    next_month = months[idx + 1]

    if pause_mode:
        if month != months[idx - 1]:  # already handled
            pause_mode = False
        monthly_details.append({
            "month": month,
            "capital": round(capital, 2),
            "type": "CASH",
            "return": 0,
            "pick": [],
            "reason": "pause"
        })
        continue

    capital_start = capital

    # Étape 1: Calculer momentum 12 mois pour chaque ticker
    candidates = []
    for ticker, prices in data.items():
        if month in prices and prev_12m in prices and prices[prev_12m] > 0:
            m12 = ((prices[month] - prices[prev_12m]) / prices[prev_12m]) * 100
            if -500 < m12 < 500 and m12 > 0:
                candidates.append((ticker, round(m12, 2)))

    # Trier par momentum descendant
    candidates.sort(key=lambda x: x[1], reverse=True)
    top5 = candidates[:5]

    if not top5:
        monthly_details.append({
            "month": month,
            "capital": round(capital, 2),
            "type": "CASH",
            "return": 0,
            "pick": [],
            "reason": "no positive momentum"
        })
        continue

    # Étape 2: Calculer le rendement mensuel réel des top5 le mois suivant
    picks = []
    monthly_return = 0.0

    for ticker, m12 in top5:
        prices = data[ticker]
        if next_month not in prices:
            continue
        p_start = prices[month]
        p_end = prices[next_month]
        if p_start <= 0:
            continue

        monthly_pct = ((p_end - p_start) / p_start) * 100

        # Stop-loss -20%
        original_pct = monthly_pct
        if monthly_pct < -20:
            monthly_pct = -20

        picks.append({
            "ticker": ticker,
            "momentum_12m": m12,
            "price_entry": round(p_start, 2),
            "price_exit": round(p_end, 2),
            "return_pct": round(monthly_pct, 2),
            "return_pct_brut": round(original_pct, 2),
        })

    if not picks:
        monthly_details.append({
            "month": month,
            "capital": round(capital, 2),
            "type": "CASH",
            "return": 0,
            "pick": [],
            "reason": "no data next month"
        })
        continue

    # Allocation égale (20% chacun)
    alloc = capital / len(picks)
    for p in picks:
        trade_return = alloc * (p["return_pct"] / 100)
        p["alloc"] = round(alloc, 2)
        p["pnl"] = round(trade_return, 2)
        monthly_return += trade_return
        trades_executed += 1
        if trade_return > 0:
            wins += 1
        else:
            losses += 1
        # Frais: 0.1% par trade
        total_fees += alloc * 0.001

    # Appliquer les frais (entrée + sortie)
    monthly_return -= total_fees * (len(picks) / trades_executed) if trades_executed > 0 else 0

    capital += monthly_return

    # Drawdown
    if capital > peak:
        peak = capital
    dd = ((peak - capital) / peak) * 100
    if dd > max_dd:
        max_dd = dd

    # Pause à -35% drawdown
    if dd > 35:
        pause_mode = True

    monthly_details.append({
        "month": month,
        "capital_start": round(capital_start, 2),
        "capital": round(capital, 2),
        "type": "TRADE",
        "return": round(monthly_return, 2),
        "return_pct": round((monthly_return / capital_start) * 100, 2) if capital_start > 0 else 0,
        "peak": round(peak, 2),
        "drawdown": round(dd, 2),
        "nb_picks": len(picks),
        "top_momentum": candidates[:10],
        "pick": picks,
    })

# =========== RÉSULTATS ===========
first_month = monthly_details[0]["month"]
last_month = monthly_details[-1]["month"]
capital_final = monthly_details[-1]["capital"]
total_return = ((capital_final / 3000) - 1) * 100

days = (datetime.strptime(last_month + "-01", "%Y-%m-%d") - datetime.strptime(first_month + "-01", "%Y-%m-%d")).days
years = days / 365.25
cagr = (pow(capital_final / 3000, 1 / years) - 1) * 100

# Win rate (trades)
win_rate = (wins / trades_executed * 100) if trades_executed > 0 else 0

# Années
yearly = {}
for m in monthly_details:
    y = m["month"][:4]
    if y not in yearly:
        yearly[y] = {"months": 0, "returns": 0, "capital_start": 0, "capital_end": 0}
    yearly[y]["months"] += 1
    yearly[y]["returns"] += m.get("return", 0)
    if yearly[y]["capital_start"] == 0:
        yearly[y]["capital_start"] = m["capital_start"] if "capital_start" in m else m["capital"]
    yearly[y]["capital_end"] = m["capital"]

# Mois gagnants/perdants
win_months = sum(1 for m in monthly_details if m.get("return", 0) > 0)
total_months = sum(1 for m in monthly_details if m.get("type") == "TRADE")

# Signaux les plus fréquents
ticker_freq = {}
for m in monthly_details:
    for p in m.get("pick", []):
        t = p["ticker"]
        ticker_freq[t] = ticker_freq.get(t, 0) + 1

top_tickers = sorted(ticker_freq.items(), key=lambda x: x[1], reverse=True)[:20]

print()
print("=" * 70)
print("  BACKTEST DUAL MOMENTUM - RESULTATS COMPLETS")
print("  Source: yfinance (prix Close ajustes)")
print("=" * 70)
print(f"  Periode         : {first_month} > {last_month}")
print(f"  Duree           : {years:.1f} ans")
print(f"  Tickers         : {len(data)}")
print(f"  Capital initial : 3 000,00 EUR")
print(f"  Capital final   : {capital_final:,.2f} EUR")
print(f"  Benefice total  : {capital_final - 3000:,.2f} EUR")
print(f"  Rendement       : +{total_return:,.2f} %")
print(f"  CAGR            : {cagr:.2f} %")
print(f"  Drawdown max    : {max_dd:.2f} %")
print(f"  Trades executes  : {trades_executed}")
print(f"  Taux de reussite: {win_rate:.1f}%")
print(f"  Mois gagnants   : {win_months}/{total_months} ({win_months/total_months*100:.1f}%)")
print(f"  Frais estimes   : {total_fees:.2f} EUR")
print(f"  Stop-loss -20%  : Actif")
print(f"  Pause a -35% DD : Active")

print(f"\n  --- DETAIL PAR ANNEE ---")
for y in sorted(yearly):
    yr = yearly[y]
    print(f"  {y}: Capital debut={yr['capital_start']:,.0f}EUR | Fin={yr['capital_end']:,.0f}EUR | PnL={yr['returns']:+,.0f}EUR | {yr['months']} mois")

print(f"\n  --- TOP SIGNAUX LES PLUS FREQUENTS ---")
for i, (t, freq) in enumerate(top_tickers[:10]):
    print(f"  {i+1}. {t}: selectionne {freq} fois")

print(f"\n  --- DERNIERS MOIS ---")
for m in monthly_details[-5:]:
    if m["type"] == "TRADE":
        tickers_str = ", ".join([p["ticker"] for p in m["pick"]])
        print(f"  {m['month']}: +{m['return']:+.0f}EUR ({m['return_pct']:+.1f}%) > Capital={m['capital']:,.0f}EUR | picks: {tickers_str}")

print(f"\n  --- TOP 10 MEILLEURS MOIS ---")
sorted_months = sorted([m for m in monthly_details if m["type"] == "TRADE"], key=lambda x: x["return"], reverse=True)[:10]
for m in sorted_months:
    tickers_str = ", ".join([p["ticker"] for p in m["pick"][:3]])
    print(f"  {m['month']}: +{m['return']:+.0f}EUR ({m['return_pct']:+.1f}%) > Capital={m['capital']:,.0f}EUR | {tickers_str}")

print(f"\n  --- PIRE MOIS ---")
worst_months = sorted([m for m in monthly_details if m["type"] == "TRADE"], key=lambda x: x["return"])[:5]
for m in worst_months:
    tickers_str = ", ".join([p["ticker"] for p in m["pick"][:3]])
    print(f"  {m['month']}: {m['return']:+.0f}EUR ({m['return_pct']:+.1f}%) > Capital={m['capital']:,.0f}EUR | {tickers_str}")

# =========== SAVE ===========
with open("backtest_final_results.json", "w") as f:
    json.dump({
        "summary": {
            "period": f"{first_month} → {last_month}",
            "years": round(years, 1),
            "initial_capital": 3000,
            "final_capital": round(capital_final, 2),
            "profit": round(capital_final - 3000, 2),
            "total_return_pct": round(total_return, 2),
            "cagr": round(cagr, 2),
            "max_drawdown": round(max_dd, 2),
            "trades": trades_executed,
            "win_rate": round(win_rate, 1),
            "win_months": win_months,
            "total_months": total_months,
            "num_tickers": len(data),
        },
        "yearly": yearly,
        "monthly": monthly_details
    }, f, indent=2, default=str)

print(f"\nOK - Resultats complets sauvegardes dans backtest_final_results.json")
