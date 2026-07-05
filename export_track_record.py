#!/usr/bin/env python3
"""Export backtest_final_results.json -> public/data/track-record.json pour le site.

Les signaux du mois en cours (non soldes) sont definis dans CURRENT_SIGNALS.
Le script calcule les rendements reels via yfinance pour les mois passes,
et ajuste le capital final et les stats globales."""

import json, os, sys
from datetime import datetime
import yfinance as yf

SRC = "backtest_final_results.json"
DST = "public/data/track-record.json"

# ---------------------------------------------------------------------------
# Signaux du mois en cours -- TES tickers et prix d'entree exacts
# Met a jour ce dict chaque mois !
# ---------------------------------------------------------------------------
# Format: "YYYY-MM": [{"t": "TICKER", "pe": PRIX_ENTREE}, ...]
# Les trades du mois sont ajoutes au track record.
# Le mois doit etre dans le passe (ou on est en juillet, juin est fini).
CURRENT_SIGNALS = {
    "2026-06": [
        {"t": "GOOGL", "pe": 368.03},
        {"t": "AVGO",  "pe": 411.35},
        {"t": "NVDA",  "pe": 210.69},
        {"t": "UNH",   "pe": 400.96},
        {"t": "AMZN",  "pe": 244.39},
    ],
    "2026-07": [
        {"t": "LRCX", "pe": 433.33},
        {"t": "AMD",  "pe": 580.91},
        {"t": "AMAT", "pe": 723.00},
        {"t": "KLAC", "pe": 301.71},
        {"t": "FOSL", "pe": 4.14},
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
last_real_capital = summary["initial_capital"]
last_real_month = ""

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

    last_real_capital = m["capital"]
    last_real_month = month

# ---------------------------------------------------------------------------
# 2. Signaux du mois en cours (TES tickers, prix d'entree)
#    On calcule les prix de sortie via yfinance, puis le capital ajuste.
# ---------------------------------------------------------------------------
current_month = datetime.now().strftime("%Y-%m")

for signal_month, signal_entries in sorted(CURRENT_SIGNALS.items()):
    # Le capital de depart pour ce mois = le capital a la fin du dernier mois
    month_start_capital = last_real_capital
    nb = len(signal_entries)
    alloc = round(month_start_capital / nb, 2) if nb > 0 else 0
    year = int(signal_month[:4])
    total_pnl_month = 0.0

    for entry in signal_entries:
        ticker = entry["t"]
        pe = entry["pe"]
        ps = pe
        pp = 0.0
        pnl_val = 0.0
        status = "signal"

        # Mois passe -> on calcule les vrais resultats via yfinance
        if signal_month < current_month:
            try:
                stock = yf.Ticker(ticker)
                # Interval mensuel = on recupere le close du dernier jour du mois
                hist = stock.history(start=f"{signal_month}-01", end="2026-08-01", interval="1mo")
                if len(hist) > 0:
                    month_close = float(hist["Close"].iloc[-1])
                    ps = round(month_close, 2)
                    if pe > 0:
                        pp = round(((month_close / pe) - 1) * 100, 2)
                        pnl_val = round(alloc * pp / 100, 2)
                        status = "win" if pnl_val > 0 else "loss"
            except Exception as e:
                print(f"  [!] {ticker}: {e}")

        total_pnl_month += pnl_val

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
            "ca": round(month_start_capital, 2),
            "s": status,
            "y": year,
        })

    # Ajuster le capital apres ce mois
    last_real_capital = round(month_start_capital + total_pnl_month, 2)
    last_real_month = signal_month

# ---------------------------------------------------------------------------
# 3. Stats globales -- AVEC le capital ajuste des signaux
# ---------------------------------------------------------------------------
total_trades = len(trades)
completed = [t for t in trades if t["s"] != "signal"]
signal_trades_list = [t for t in trades if t["s"] == "signal"]

wins = sum(1 for t in completed if t["s"] == "win")
losses = len(completed) - wins
win_rate = round((wins / len(completed)) * 100, 1) if completed else 0

# Recalculer le CAGR avec le vrai capital final
initial_cap = float(summary["initial_capital"])
years = float(summary["years"])
total_return = ((last_real_capital / initial_cap) - 1) * 100
adjusted_cagr = round(((pow(last_real_capital / initial_cap, 1 / years) - 1) * 100), 2) if years > 0 else 0.0

# Periode
ps = "2021-01"
pe = last_real_month[:7] if last_real_month else summary["period"].split("->")[-1].strip()
display_period = f"{ps} -> {pe}"

output = {
    "meta": {
        "period": display_period,
        "years": years,
        "initial_capital": initial_cap,
        "final_capital": last_real_capital,
        "total_return_pct": round(total_return, 2),
        "cagr": adjusted_cagr,
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
print(f"   Capital : {initial_cap} -> {last_real_capital:,.2f} EUR")
print(f"   CAGR    : {adjusted_cagr}% | WR: {win_rate}% | DD: {summary['max_drawdown']}%")

# Bilan detaille par mois de signal
for signal_month, signal_entries in sorted(CURRENT_SIGNALS.items()):
    sig_trades = [t for t in completed if t["d"].startswith(signal_month)]
    if not sig_trades:
        continue
    total_pnl = sum(t["peur"] for t in sig_trades)
    wins_s = sum(1 for t in sig_trades if t["s"] == "win")
    loss_s = sum(1 for t in sig_trades if t["s"] == "loss")
    cap_used = sig_trades[0]["ca"] if sig_trades else 0
    print(f"\n   === {signal_month} ({wins_s}W/{loss_s}L) PnL={total_pnl:+.2f}EUR ===")
    for t in sig_trades:
        icon = "WIN" if t["pp"] > 0 else "LOSS"
        print(f"     {t['t']:6s}  {t['pe']:>7.2f} -> {t['ps']:>7.2f}  ({t['pp']:+.2f}%)  {t['peur']:>+8.2f}EUR  {icon}")
    print(f"     ---> Capital debut={cap_used:,.2f} -> fin={cap_used+total_pnl:,.2f}")
