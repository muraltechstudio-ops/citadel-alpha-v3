#!/usr/bin/env python3
"""Export backtest_final_results.json → public/data/track-record.json pour le site."""

import json, os, sys
from datetime import datetime

SRC = "backtest_final_results.json"
DST = "public/data/track-record.json"

if not os.path.exists(SRC):
    print(f"ERREUR: {SRC} introuvable - lance d'abord python backtest_final.py")
    sys.exit(1)

with open(SRC, "r", encoding="utf-8") as f:
    bt = json.load(f)

summary = bt["summary"]
monthly = bt["monthly"]

trades = []

# 1. Exporter tous les trades completes du backtest
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

# 2. Ajouter les signaux du mois en cours (non soldes)
# On prend les 5 premiers picks du top_momentum du dernier mois complet
current_month = datetime.now().strftime("%Y-%m")
last_completed = [m for m in monthly if m.get("type") == "TRADE"]
if last_completed:
    last = last_completed[-1]
    last_month = last["month"]
    last_capital = last["capital"]

    # Mois suivant (mois courant)
    y, m_int = int(last_month[:4]), int(last_month[5:7])
    if m_int == 12:
        next_m = f"{y+1}-01"
    else:
        next_m = f"{y}-{m_int+1:02d}"

    # Chercher les prix d'entree = close du dernier mois complet
    entry_prices = {}
    for p in last.get("pick", []):
        entry_prices[p["ticker"]] = p["price_entry"]

    top_signal_picks = last.get("top_momentum", [])[:5]
    nb_picks = len(top_signal_picks)
    if nb_picks > 0:
        alloc = round(last_capital / nb_picks, 2)

        for ticker, _ in top_signal_picks:
            pe = entry_prices.get(ticker, 0)
            trades.append({
                "t": ticker,
                "d": f"{next_m}-01",
                "ex": f"{next_m}-28",
                "ra": "DMD",
                "pe": pe,
                "ps": pe,   # pas encore de sortie
                "pp": 0.0,  # pas encore de perf
                "me": round(alloc, 2),
                "peur": 0.0,
                "ca": round(last_capital, 2),
                "s": "signal",
                "y": int(next_m[:4]),
            })

# 3. Computed stats
total_trades = len(trades)
completed = [t for t in trades if t["s"] != "signal"]
wins = sum(1 for t in completed if t["s"] == "win")
losses = len(completed) - wins
win_rate = round((wins / len(completed)) * 100, 1) if completed else 0
final_capital = summary["final_capital"]
initial_capital = summary["initial_capital"]
total_return_pct = summary["total_return_pct"]
cagr = summary["cagr"]
max_dd = summary["max_drawdown"]

display_period = summary["period"].replace("→", "->").strip()
# Si on a des signaux en cours, etendre la periode pour les inclure
signal_trades = [t for t in trades if t["s"] == "signal"]
if signal_trades:
    last_signal = max(t["d"] for t in signal_trades)
    if last_completed:
        last_m = last_completed[-1]["month"]
        display_period = f"{last_m} -> {last_signal[:7]}"
    else:
        display_period = f"{summary['period'][:7]} -> {last_signal[:7]}"

output = {
    "meta": {
        "period": display_period,
        "years": summary["years"],
        "initial_capital": initial_capital,
        "final_capital": final_capital,
        "total_return_pct": total_return_pct,
        "cagr": cagr,
        "max_drawdown": max_dd,
        "trades": len(completed),
        "signals": len(signal_trades),
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

print(f"OK - {DST} genere — {len(completed)} trades + {len(signal_trades)} signaux (= {total_trades} entrées)")
period_clean = display_period.replace("->", "->")
print(f"   Periode : {period_clean}")
print(f"   Capital : {initial_capital} -> {final_capital:,.2f} EUR")
print(f"   CAGR    : {cagr}%")
print(f"   WR      : {win_rate}%")
print(f"   DD max  : {max_dd}%")
print(f"   Signaux : {[t['t'] for t in signal_trades]}")
