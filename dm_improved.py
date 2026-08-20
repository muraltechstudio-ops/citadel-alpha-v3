import yfinance as yf
import pandas as pd
from datetime import datetime
import json
import os
import numpy as np

TICKERS_RAW = [
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

TICKERS = sorted(list(set(TICKERS_RAW)))
ALL_TICKERS = TICKERS + ["SPY"]

def fetch_data(start, end):
    all_data = {}
    print("Téléchargement des données (Prix et Volumes)...")
    for i, tk in enumerate(ALL_TICKERS):
        try:
            stock = yf.Ticker(tk)
            hist = stock.history(start=start, end=end, interval="1mo")
            col = 'Adj Close' if 'Adj Close' in hist.columns else 'Close'
            p_dict, v_dict = {}, {}
            for d, p, v in zip(hist.index, hist[col], hist['Volume']):
                key = str(d.date())[:7]
                p_dict[key] = round(float(p), 2)
                v_dict[key] = float(v)
            all_data[tk] = {'price': p_dict, 'volume': v_dict}
        except Exception:
            pass
    return all_data

def fetch_metadata():
    cache_file = "metadata_cache.json"
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r") as f:
                return json.load(f)
        except Exception:
            pass

    meta = {}
    print("Téléchargement des métadonnées (Secteurs et Market Cap)...")
    for i, tk in enumerate(TICKERS):
        try:
            info = yf.Ticker(tk).info
            meta[tk] = {
                "sector": info.get("sector", "Unknown"),
                "marketCap": info.get("marketCap", 0)
            }
        except:
            meta[tk] = {"sector": "Unknown", "marketCap": 0}

    with open(cache_file, "w") as f:
        json.dump(meta, f)
    return meta

def run_backtest(data, meta, n_positions=5):
    results = []
    real_capital = 10000.0
    peak = real_capital

    months_set = set()
    for tk, d in data.items():
        months_set.update(d.get('price', {}).keys())
    months = sorted(list(months_set))

    spy_data = data.get("SPY", {})
    spy_px = spy_data.get('price', {})

    for i in range(12, len(months) - 1):
        month = months[i]
        next_month = months[i + 1]
        prev_12 = months[i - 12]
        prev_6 = months[i - 6]
        prev_3 = months[i - 3]

        # 1. Filtre Absolu SPY
        spy_cash = False
        if month in spy_px and prev_12 in spy_px and spy_px[prev_12] > 0:
            spy_mom = (spy_px[month] - spy_px[prev_12]) / spy_px[prev_12]
            if spy_mom < 0:
                spy_cash = True
        else:
            spy_cash = True

        # 2. Volatility Scaling
        weight_per_pos = 1.0 / n_positions
        m0, m1, m2, m3 = month, months[i-1], months[i-2], months[i-3]
        if m0 in spy_px and m1 in spy_px and m2 in spy_px and m3 in spy_px:
            r1 = (spy_px[m0] - spy_px[m1]) / spy_px[m1]
            r2 = (spy_px[m1] - spy_px[m2]) / spy_px[m2]
            r3 = (spy_px[m2] - spy_px[m3]) / spy_px[m3]
            vol_ann = np.std([r1, r2, r3], ddof=1) * np.sqrt(12)

            target_vol = 0.15
            base_weight = 1.0 / n_positions

            if vol_ann > 0:
                raw_weight = (target_vol / vol_ann) * base_weight
            else:
                raw_weight = base_weight

            min_w = min(0.20, base_weight)
            weight_per_pos = float(np.clip(raw_weight, min_w, base_weight))

        # --- SELECTION STRATEGIE DE BASE ---
        candidates = []
        for tk in TICKERS:
            p_dict = data.get(tk, {}).get('price', {})
            v_dict = data.get(tk, {}).get('volume', {})

            if all(m in p_dict for m in [month, prev_12, prev_6, prev_3]) and p_dict[prev_12] > 0 and p_dict[prev_6] > 0 and p_dict[prev_3] > 0:
                px_now = p_dict[month]
                vol_now = v_dict.get(month, 0)
                mcap = meta.get(tk, {}).get("marketCap", 0)

                # FILTRE QUALITE
                if px_now < 10:
                    continue
                if vol_now < 1_000_000:
                    continue
                if mcap < 2_000_000_000:
                    continue

                mom12 = (p_dict[month] - p_dict[prev_12]) / p_dict[prev_12]
                mom6 = (p_dict[month] - p_dict[prev_6]) / p_dict[prev_6]
                mom3 = (p_dict[month] - p_dict[prev_3]) / p_dict[prev_3]

                if abs(mom12) > 5 or abs(mom6) > 5 or abs(mom3) > 5:
                    continue

                # LOOKBACK MIXTE
                score = (mom12 * 0.5) + (mom6 * 0.3) + (mom3 * 0.2)
                if score > 0:
                    candidates.append((tk, score, px_now))

        candidates.sort(key=lambda x: x[1], reverse=True)

        selected = []
        seen_sectors = set()
        for tk, score, price in candidates:
            sec = meta.get(tk, {}).get("sector", "Unknown")
            if sec not in seen_sectors or sec == "Unknown":
                selected.append((tk, score, price))
                if sec != "Unknown":
                    seen_sectors.add(sec)
            if len(selected) == n_positions:
                break

        # --- ALLOCATION REELLE ---
        real_signals = []
        real_monthly_return = 0

        if spy_cash or not selected:
            real_signals = "CASH"
            real_monthly_return = 0
        else:
            alloc_per_pos = real_capital * weight_per_pos
            for tk, score, price_now in selected:
                p_dict = data.get(tk, {}).get('price', {})
                if next_month in p_dict:
                    ret = (p_dict[next_month] - price_now) / price_now
                    if abs(ret) > 1: ret = 0
                    pnl = alloc_per_pos * ret
                    real_monthly_return += pnl
                    real_signals.append({
                        "ticker": tk,
                        "score": round(score, 3),
                        "return_pct": round(ret * 100, 2),
                        "sector": meta.get(tk, {}).get("sector", "Unknown"),
                        "alloc_weight": round(weight_per_pos * 100, 2)
                    })

        capital_prev = real_capital
        real_capital += real_monthly_return
        if real_capital > peak:
            peak = real_capital

        dd = (peak - real_capital) / peak if peak > 0 else 0

        results.append({
            "month": month,
            "capital": round(real_capital, 2),
            "peak": round(peak, 2),
            "signal": real_signals,
            "return": round(real_monthly_return, 2),
            "return_pct": round((real_monthly_return / capital_prev) * 100, 2) if capital_prev > 0 else 0,
            "drawdown": round(dd * 100, 2)
        })

    return results

def calculate_metrics(results):
    initial = 10000.0
    if not results:
        return 0, 0, 0, 0, initial
    final = results[-1]["capital"]

    yrs = len(results) / 12.0
    cagr = (pow(final / initial, 1 / yrs) - 1) * 100 if yrs > 0 else 0
    max_dd = max(r.get("drawdown", 0) for r in results)

    trades = [r for r in results if r["signal"] != "CASH"]
    wins = sum(1 for r in trades if r["return"] > 0)
    wr = (wins / len(trades) * 100) if trades else 0

    returns = [r.get("return_pct", 0) / 100.0 for r in results]
    mean_ret = np.mean(returns)
    std_ret = np.std(returns, ddof=1) if len(returns) > 1 else 0
    sharpe = (mean_ret / std_ret) * np.sqrt(12) if std_ret > 0 else 0

    return cagr, max_dd, wr, sharpe, final

if __name__ == "__main__":
    meta = fetch_metadata()

    print("Telechargement des donnees (2016-2026)...")
    start = datetime(2016, 1, 1)
    end = datetime(2026, 9, 1)
    data = fetch_data(start, end)

    print("\n" + "="*70)
    print("  STRATEGIE OFFICIELLE CITADEL ALPHA (N=5)")
    print("  Filtres: Qualite + SPY Absolu + Secteur + Lookback Mixte + Vol Scaling")
    print("="*70)

    res = run_backtest(data, meta, n_positions=5)
    cagr, max_dd, wr, sharpe, final = calculate_metrics(res)

    print(f"\nCAGR: {cagr:.1f}% | Drawdown Max: {max_dd:.1f}% | Win Rate: {wr:.1f}% | Sharpe: {sharpe:.2f}")
    print(f"Capital final: {final:,.2f} EUR")

    with open("dm_final_v2_results.json", "w") as f:
        json.dump(res, f, indent=2)
    print("\nResultats officiels sauvegardes dans dm_final_v2_results.json")
