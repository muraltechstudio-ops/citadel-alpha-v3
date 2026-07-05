#!/usr/bin/env python3
"""Export backtest_final_results.json → public/data/track-record.json pour le site."""

import json, os, sys

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

# Computed stats
total_trades = len(trades)
wins = sum(1 for t in trades if t["s"] == "win")
losses = total_trades - wins
win_rate = round((wins / total_trades) * 100, 1) if total_trades > 0 else 0
final_capital = summary["final_capital"]
initial_capital = summary["initial_capital"]
total_return_pct = summary["total_return_pct"]
cagr = summary["cagr"]
max_dd = summary["max_drawdown"]

output = {
    "meta": {
        "period": summary["period"],
        "years": summary["years"],
        "initial_capital": initial_capital,
        "final_capital": final_capital,
        "total_return_pct": total_return_pct,
        "cagr": cagr,
        "max_drawdown": max_dd,
        "trades": total_trades,
        "win_rate": win_rate,
        "win_months": summary.get("win_months", 0),
        "total_months": summary.get("total_months", 0),
        "generated_at": "2026-07-05",
    },
    "trades": trades,
}

os.makedirs(os.path.dirname(DST), exist_ok=True)
with open(DST, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"OK - {DST} genere — {total_trades} trades exportes")
period = summary['period'].replace("→", "->")
print(f"   Periode : {period}")
print(f"   Capital : {initial_capital} -> {final_capital:,.2f} EUR")
print(f"   CAGR    : {cagr}%")
print(f"   WR      : {win_rate}%")
print(f"   DD max  : {max_dd}%")
