import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
import json
from collections import Counter

# Tickers majeurs Forex
TICKERS = ["EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X", "USDCHF=X", "NZDUSD=X", "EURGBP=X"]

# Parametres
INITIAL_CAPITAL = 1000.0
LEVERAGE = 2.0
MAX_POSITIONS = 2
LOOKBACK_MONTHS = 12
TRANSACTION_COST = 0.0002  # 0.02% (environ 2 pips pour la plupart des paires majeures)

def fetch_data():
    print("Telechargement des donnees Forex via yfinance...")
    start = "2020-01-01"
    end = "2026-09-01"
    all_data = {}

    for ticker in TICKERS:
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(start=start, end=end, interval="1mo")
            closes = {}
            for d, v in zip(hist.index, hist["Close"]):
                key = str(d.date())[:7]
                closes[key] = float(v)
            all_data[ticker] = closes
        except Exception as e:
            print(f"Erreur avec {ticker}: {e}")

    return all_data

def run_backtest(data):
    all_months = set()
    for px in data.values():
        all_months.update(px.keys())
    months = sorted(list(all_months))

    capital = INITIAL_CAPITAL
    peak = capital
    results = []
    selections = Counter()

    for i in range(LOOKBACK_MONTHS, len(months) - 1):
        month = months[i]
        prev_month = months[i - LOOKBACK_MONTHS]
        next_month = months[i + 1]

        candidates = []
        for tk, px in data.items():
            if month in px and prev_month in px:
                if px[prev_month] > 0:
                    mom = (px[month] - px[prev_month]) / px[prev_month]
                    if mom > 0:
                        candidates.append((tk, mom))

        # Top 2
        candidates.sort(key=lambda x: x[1], reverse=True)
        top = candidates[:MAX_POSITIONS]

        monthly_pnl = 0
        signals = []

        # 50% du capital courant par position
        alloc = capital * 0.5

        for tk, mom in top:
            selections[tk] += 1
            if next_month in data[tk] and data[tk][month] > 0:
                ret = (data[tk][next_month] - data[tk][month]) / data[tk][month]

                # Appliquer le cout de transaction
                ret -= TRANSACTION_COST

                # Levier x2, sans stop loss
                lev_ret = ret * LEVERAGE

                pnl = alloc * lev_ret
                monthly_pnl += pnl

                signals.append({
                    "ticker": tk,
                    "momentum_12m": round(mom * 100, 2),
                    "return_pct": round(lev_ret * 100, 2),
                    "pnl": round(pnl, 2)
                })

        capital_prev = capital
        capital += monthly_pnl
        if capital > peak:
            peak = capital

        dd = (peak - capital) / peak if peak > 0 else 0
        monthly_ret_pct = (monthly_pnl / capital_prev) * 100 if capital_prev > 0 else 0

        results.append({
            "month": month,
            "capital": round(capital, 2),
            "return_pct": round(monthly_ret_pct, 2),
            "pnl": round(monthly_pnl, 2),
            "signals": signals,
            "drawdown": round(dd * 100, 2)
        })

    return results, selections

def print_stats(results, selections):
    if not results:
        print("Aucun resultat.")
        return

    final_cap = results[-1]["capital"]
    total_ret = ((final_cap / INITIAL_CAPITAL) - 1) * 100

    first_month = results[0]["month"]
    last_month = results[-1]["month"]
    d1 = datetime.strptime(first_month, "%Y-%m")
    d2 = datetime.strptime(last_month, "%Y-%m")
    years = (d2 - d1).days / 365.25
    cagr = (pow(final_cap / INITIAL_CAPITAL, 1 / years) - 1) * 100 if years > 0 else 0

    max_dd = max(r["drawdown"] for r in results)

    returns = [r["return_pct"] / 100 for r in results]
    mean_ret = np.mean(returns)
    std_ret = np.std(returns)
    sharpe = (mean_ret / std_ret) * np.sqrt(12) if std_ret > 0 else 0

    wins = sum(1 for r in results if r["pnl"] > 0)
    total_active = sum(1 for r in results if len(r["signals"]) > 0)
    win_rate = (wins / total_active) * 100 if total_active > 0 else 0

    print("\n" + "="*60)
    print("  BACKTEST DUAL MOMENTUM FOREX (Levier x2, Pas de SL)")
    print("="*60)
    print(f"Periode: {first_month} a {last_month} ({years:.1f} ans)")
    print(f"Capital initial: {INITIAL_CAPITAL:.2f} EUR")
    print(f"Capital final: {final_cap:,.2f} EUR")
    print(f"Rendement total: {total_ret:+.2f}%")
    print(f"CAGR: {cagr:.2f}%")
    print(f"Max Drawdown: {max_dd:.2f}%")
    print(f"Win Rate: {wins}/{total_active} mois ({win_rate:.1f}%)")
    print(f"Sharpe Ratio: {sharpe:.2f}")

    print("\n--- Detail mois par mois ---")
    for r in results:
        pairs = ", ".join([s["ticker"] for s in r["signals"]])
        print(f"  {r['month']}: {r['return_pct']:>6.2f}% | Paires: {pairs if pairs else 'CASH'}")

    print("\n--- Paires les plus selectionnees ---")
    for tk, count in selections.most_common():
        print(f"  {tk}: {count} fois")

    sorted_months = sorted(results, key=lambda x: x["return_pct"], reverse=True)

    print("\n--- Top 10 Meilleurs Mois ---")
    for r in sorted_months[:10]:
        print(f"  {r['month']}: {r['return_pct']:+.2f}% ({r['pnl']:+.2f} EUR) - Cap: {r['capital']:,.2f} EUR")

    print("\n--- Top 10 Pires Mois ---")
    worst_months = sorted([r for r in results if r['return_pct'] < 0], key=lambda x: x["return_pct"])
    for r in worst_months[:10]:
        print(f"  {r['month']}: {r['return_pct']:+.2f}% ({r['pnl']:+.2f} EUR) - Cap: {r['capital']:,.2f} EUR")

if __name__ == "__main__":
    data = fetch_data()
    results, selections = run_backtest(data)
    print_stats(results, selections)

    with open('forex_backtest_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    print("\nResultats complets sauvegardes dans forex_backtest_results.json")
