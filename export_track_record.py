#!/usr/bin/env python3
"""Export backtest_final_results.json -> public/data/track-record.json pour le site.

Les signaux du mois en cours (non soldes) sont definis dans SIGNALS.
Le script va chercher les prix de sortie sur yfinance si le mois est complet."""

import json, os, sys
from datetime import datetime
import yfinance as yf

SRC = "backtest_final_results.json"
DST = "public/data/track-record.json"

# ---------------------------------------------------------------------------
# Signaux du mois en cours -- TES tickers et prix d'entree
# Mets a jour ce dict chaque mois !
# ---------------------------------------------------------------------------
# Format: "YYYY-MM": [{"t": "TICKER", "pe": PRIX_ENTREE}, ...]
# Les trades du mois sont ajoutes au track record.
# Si le mois est termine, le script calcule les resultats reels via yfinance.
CURRENT_SIGNALS = {
    "2026-06": [
        {"t": "GOOGL", "pe": 368.03},
        {"t": "AVGO",  "pe": 411.35},
        {"t": "NVDA",  "pe": 210.69},
        {"t": "UNH",   "pe": 400.96},
        {"t": "AMZN",  "pe": 244.39},
    ],
}

if not os.path.exists(SRC):
    print(f"ERREUR: {SRC} introuvable - lance d'abord python backtest_final.py")
    sys.exit(1)

with open(SRC, "r", encoding="utf-8") as f:
    bt = json.load(f)

summary = bt["summary"]
monthly = bt["monthly"]
trades = []

# ---------------------------------------------------------------------------
# 1. Tous les trades completes du backtest (janv 2021 - mai 2026)
# ---------------------------------------------------------------------------
for m in monthly:
    if m.get("type") != "TRADE":
        continue
    month = m["month"]
    year = int(month[:4])
    capital_start = m.get("capital_start", 3000.0)
    picks = m.get("pick", [])

    for p in picks:
        pp = p["return_pct"]
        pnl = p["pnl"]
        trades.append({
            "t": p["ticker"],
            "d": f"{month}-01",
            "ex": f"{month}-28",
            "ra": "DMD",
            "pe": round(p["price_entry"], 2),
            "ps": round(p["price_exit"], 2),
            "pp": round(pp, 2),
            "me": round(p["alloc"], 2),
            "peur": round(pnl, 2),
            "ca": round(capital_start, 2),
            "s": "win" if pnl > 0 else "loss",
            "y": year,
        })

# ---------------------------------------------------------------------------
# 2. Signaux du mois en cours (TES tickers, avec tes prix d'entree)
# ---------------------------------------------------------------------------
current_month = datetime.now().strftime("%Y-%m")
last_completed = [m for m in monthly if m.get("type") == "TRADE"]
last_capital = last_completed[-1]["capital"] if last_completed else summary["final_capital"]

for signal_month, signal_entries in sorted(CURRENT_SIGNALS.items()):
    nb = len(signal_entries)
    alloc = round(last_capital / nb, 2) if nb > 0 else 0
    year = int(signal_month[:4])

    for entry in signal_entries:
        ticker = entry["t"]
        pe = entry["pe"]  # TON prix d'entree exact
        ps = pe
        pp = 0.0
        pnl_val = 0.0
        status = "signal"

        # Juin 2026 est termine -> on calcule les vrais resultats
        if signal_month < current_month:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(start=f"{signal_month}-01", end="2026-08-01", interval="1mo")
                if len(hist) > 0:
                    jun_close = float(hist["Close"].iloc[-1])
                    ps = round(jun_close, 2)
                    if pe > 0:
                        pp = round(((jun_close / pe) - 1) * 100, 2)
                        pnl_val = round(alloc * pp / 100, 2)
                        status = "win" if pnl_val > 0 else "loss"
            except Exception as e:
                print(f"  [!] {ticker}: {e}")

        trades.append({
            "t": ticker,
            "d": f"{signal_month}-01",
            "ex": f"{signal_month}-28",
            "ra": "DMD",
            "pe": pe,
            "ps": ps,
            "pp": pp,
            "me": round(alloc, 2),
            "peur": pnl_val,
            "ca": round(last_capital, 2),
            "s": status,
            "y": year,
        })

# ---------------------------------------------------------------------------
# 3. Stats globales
# ---------------------------------------------------------------------------
total_trades = len(trades)
completed = [t for t in trades if t["s"] != "signal"]
signal_trades_list = [t for t in trades if t["s"] == "signal"]

wins = sum(1 for t in completed if t["s"] == "win")
losses = len(completed) - wins
win_rate = round((wins / len(completed)) * 100, 1) if completed else 0

# Periode = du premier mois du backtest au dernier trade (inclus signaux completes)
ps = summary["period"].split("->")[0].strip() if "->" in summary["period"] else "2021-01"
last_trade_month = max(t["d"] for t in trades) if trades else ""
pe = last_trade_month[:7] if last_trade_month else summary["period"].split("->")[-1].strip()
display_period = f"{ps} -> {pe}"

output = {
    "meta": {
        "period": display_period,
        "years": summary["years"],
        "initial_capital": summary["initial_capital"],
        "final_capital": summary["final_capital"],
        "total_return_pct": summary["total_return_pct"],
        "cagr": summary["cagr"],
        "max_drawdown": summary["max_drawdown"],
        "trades": len(completed),
        "signals": len(signal_trades_list),
        "win_rate": win_rate,
        "win_months": summary.get("win_months", 0),
        "total_months": summary.get("total_months", 0),
        "generated_at": current_month,
    },
    "trades": trades,
}

os.makedirs(os.path.dirname(DST), exist_ok=True)
with open(DST, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"OK - {total_trades} entrees ({len(completed)} trades + {len(signal_trades_list)} signaux)")
print(f"   Periode : {display_period}")
print(f"   Capital : {summary['initial_capital']} -> {summary['final_capital']:,.2f} EUR")
print(f"   CAGR    : {summary['cagr']}% | WR: {win_rate}% | DD: {summary['max_drawdown']}%")

# Afficher les resultats des signaux du mois precedent completes
completed_sig = [t for t in completed if t["d"].startswith(tuple(CURRENT_SIGNALS.keys()))]
if completed_sig:
    print(f"   Resultats signaux :")
    for t in completed_sig:
        s = "WIN" if t["pp"] > 0 else "LOSS"
        print(f"     {t['t']:6s}  {t['pe']:>7.2f} -> {t['ps']:>7.2f}  ({t['pp']:+.2f}%)  {t['peur']:+.2f}EUR  {s}")
