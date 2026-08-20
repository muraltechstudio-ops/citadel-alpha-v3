import json
import os
import sys

SRC = "dm_final_v2_results.json"
DST = "public/data/track-record.json"

if not os.path.exists(SRC):
    print(f"ERREUR: {SRC} introuvable")
    sys.exit(1)

with open(SRC, "r", encoding="utf-8") as f:
    results = json.load(f)

trades = []
for m in results:
    if m["signal"] == "CASH":
        continue

    month_start_capital = m.get("capital", 10000) - m.get("return", 0)
    month = m["month"]
    y, mo = int(month[:4]), int(month[5:7])
    if mo == 12:
        exit_month = f"{y+1}-01"
    else:
        exit_month = f"{y}-{mo+1:02d}"

    for p in m["signal"]:
        trades.append({
            "t": p["ticker"],
            "d": f"{month}-01",
            "ex": f"{exit_month}-01",
            "ra": "DMD",
            "pe": 100.0,
            "ps": round(100.0 * (1 + p["return_pct"]/100.0), 2),
            "pp": p["return_pct"],
            "me": round(month_start_capital * (p.get("alloc_weight", 20.0)/100.0), 2),
            "peur": round(month_start_capital * (p.get("alloc_weight", 20.0)/100.0) * (p["return_pct"]/100.0), 2),
            "ca": round(month_start_capital, 2),
            "s": "win" if p["return_pct"] > 0 else "loss",
            "y": y,
        })

output = {
    "meta": {
        "period": "2016-01 -> 2026-08",
        "years": 10.5,
        "initial_capital": 10000.0,
        "final_capital": 163663.89,
        "total_return_pct": 1536.6,
        "cagr": 33.9,
        "max_drawdown": 24.3,
        "trades": len(trades),
        "signals": 0,
        "win_rate": 69.3,
        "win_months": sum(1 for m in results if m["return"] > 0),
        "total_months": len(results),
        "generated_at": "2026-08-19"
    },
    "trades": trades
}

os.makedirs(os.path.dirname(DST), exist_ok=True)
with open(DST, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print(f"Export OK - {len(trades)} trades dans {DST}")