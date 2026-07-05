#!/usr/bin/env python3
"""Export backtest_final_results.json -> public/data/track-record.json pour le site.

PRINCIPE DU DUAL MOMENTUM (Meb Faber):
- On entre en FIN de mois M (sur le close du dernier jour ouvrable)
- On sort en FIN de mois M+1 (sur le close du dernier jour ouvrable)
- Le PnL est donc REALISE en mois M+1

Exemple concret :
  Entree mai 2026  ->  Sortie juin 2026  ->  PnL = +9 812 EUR (gain REALISE en juin)
  Entree juin 2026 ->  Sortie juillet 2026 -> PnL = -1 347 EUR (perte REALISEE en juillet)

Ainsi, le capital suit cette logique :
  Debut mai   = 30 495 EUR -> trades entres
  Debut juin  = 40 307 EUR -> les trades de mai ONT SORTI avec +9 812 EUR
  Debut juil  = 38 960 EUR -> les trades de juin ONT SORTI avec -1 347 EUR

Les signaux du mois en cours sont definis dans CURRENT_SIGNALS.
Le script calcule les rendements reels via yfinance pour les mois passes."""

import json
import os
import sys
from collections import defaultdict
from datetime import datetime

import yfinance as yf

SRC = "backtest_final_results.json"
DST = "public/data/track-record.json"

# ---------------------------------------------------------------------------
# Signaux du mois en cours -- TES tickers et prix d'entree exacts
# Met a jour ce dict chaque mois !
# ---------------------------------------------------------------------------
# Format: "YYYY-MM": [{"t": "TICKER", "pe": PRIX_ENTREE}, ...]
# Le mois = mois d'entree (les trades sortiront le mois suivant)
CURRENT_SIGNALS = {
    "2026-06": [
        {"t": "GOOGL", "pe": 368.03},
        {"t": "AVGO", "pe": 411.35},
        {"t": "NVDA", "pe": 210.69},
        {"t": "UNH", "pe": 400.96},
        {"t": "AMZN", "pe": 244.39},
    ],
    "2026-07": [
        {"t": "LRCX", "pe": 433.33},
        {"t": "AMD", "pe": 580.91},
        {"t": "AMAT", "pe": 723.00},
        {"t": "KLAC", "pe": 301.71},
        {"t": "FOSL", "pe": 4.14},
    ],
}


def month_after(month_str):
    """Retourne le mois suivant au format YYYY-MM."""
    y, m = int(month_str[:4]), int(month_str[5:7])
    if m == 12:
        return f"{y+1}-01"
    return f"{y}-{m+1:02d}"


def get_last_close_of_month(ticker, year, month):
    """Recupere le dernier close disponible du mois via yfinance daily data."""
    try:
        stock = yf.Ticker(ticker)
        if month == 12:
            end = f"{year+1}-01-15"
        else:
            end = f"{year}-{month+1:02d}-15"
        hist = stock.history(start=f"{year}-{month:02d}-01", end=end, interval="1d")
        if len(hist) > 0:
            mask = (hist.index.year == year) & (hist.index.month == month)
            rows = hist[mask]
            if len(rows) > 0:
                return float(rows["Close"].iloc[-1])
    except Exception as e:
        print(f"  [!] yfinance {ticker} {year}-{month:02d}: {e}")
    return None


if not os.path.exists(SRC):
    print(f"ERREUR: {SRC} introuvable - lance d'abord python backtest_final.py")
    sys.exit(1)

with open(SRC, "r", encoding="utf-8") as f:
    bt = json.load(f)

summary = bt["summary"]
monthly = bt["monthly"]
trades = []

# ---------------------------------------------------------------------------
# 1. Tous les trades du backtest (janv 2021 - mai 2026)
# Le backtest entre en mois M et sort en mois M+1.
# Le PnL est realise lors de la sortie en M+1.
# Le ca (capital) affiche = capital avant l'entree (debut de M).
# ---------------------------------------------------------------------------
last_real_capital = float(summary["initial_capital"])
last_real_month = ""

for m in monthly:
    if m.get("type") != "TRADE":
        continue

    entry_month = m["month"]
    exit_month = month_after(entry_month)
    year = int(entry_month[:4])
    capital_start = m.get("capital_start", 3000.0)
    picks = m.get("pick", [])

    for p in picks:
        pp = p["return_pct"]
        pnl = p["pnl"]
        trades.append({
            "t": p["ticker"],
            "d": f"{entry_month}-01",
            "ex": f"{exit_month}-01",
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
    last_real_month = entry_month

# ---------------------------------------------------------------------------
# 2. Signaux du mois en cours
#    Meme principe : entre en signal_month, sort le mois suivant.
#    Si signal_month est passe, on calcule le vrai PnL via yfinance.
# ---------------------------------------------------------------------------
current_now = datetime.now().strftime("%Y-%m")

for signal_month, signal_entries in sorted(CURRENT_SIGNALS.items()):
    month_start_capital = round(last_real_capital, 2)
    nb = len(signal_entries)
    alloc = round(month_start_capital / nb, 2) if nb > 0 else 0
    year = int(signal_month[:4])
    exit_month = month_after(signal_month)
    total_pnl_month = 0.0

    for entry in signal_entries:
        ticker = entry["t"]
        pe = entry["pe"]
        ps = pe
        pp = 0.0
        pnl_val = 0.0
        status = "signal"

        # Si le mois d'entree est fini, on peut calculer le vrai PnL
        if signal_month < current_now:
            y_sig, m_sig = int(signal_month[:4]), int(signal_month[5:7])
            close_val = get_last_close_of_month(ticker, y_sig, m_sig)
            if close_val is not None:
                ps = round(close_val, 2)
                if pe > 0:
                    pp = round(((close_val / pe) - 1) * 100, 2)
                    pnl_val = round(alloc * pp / 100, 2)
                    status = "win" if pnl_val > 0 else "loss"

        total_pnl_month += pnl_val

        # La date de sortie = TOUJOURS le mois suivant l'entree
        trades.append({
            "t": ticker,
            "d": f"{signal_month}-01",
            "ex": f"{exit_month}-01",
            "ra": "DMD",
            "pe": pe,
            "ps": ps,
            "pp": pp,
            "me": round(alloc, 2),
            "peur": pnl_val,
            "ca": month_start_capital,
            "s": status,
            "y": year,
        })

    last_real_capital = round(month_start_capital + total_pnl_month, 2)
    last_real_month = signal_month

# ---------------------------------------------------------------------------
# 3. Stats globales
# ---------------------------------------------------------------------------
total_entries = len(trades)
completed = [t for t in trades if t["s"] != "signal"]
signal_trades_list = [t for t in trades if t["s"] == "signal"]

wins = sum(1 for t in completed if t["s"] == "win")
losses = len(completed) - wins
win_rate = round((wins / len(completed)) * 100, 1) if completed else 0

initial_cap = float(summary["initial_capital"])
years = float(summary["years"])
total_return = ((last_real_capital / initial_cap) - 1) * 100
adjusted_cagr = round(((pow(last_real_capital / initial_cap, 1 / years) - 1) * 100), 2)

# Periode = du premier au dernier mois de sortie des trades completes
# (les signaux en cours sont mentionnes mais la periode n'est pas etendue)
last_completed_trade = None
for t in reversed(trades):
    if t["s"] != "signal":
        last_completed_trade = t
        break

if last_completed_trade:
    pe_date = last_completed_trade["ex"][:7]
else:
    pe_date = last_real_month[:7]

display_period = f"2021-01 -> {pe_date}"

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
        "generated_at": current_now,
    },
    "trades": trades,
}

os.makedirs(os.path.dirname(DST), exist_ok=True)
with open(DST, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

# ---------------------------------------------------------------------------
# Affichage recapitulatif
# ---------------------------------------------------------------------------
print(f"OK - {total_entries} entrees ({len(completed)} trades + {len(signal_trades_list)} signaux)")
print(f"   Periode : {display_period}")
print(f"   Capital : {initial_cap} -> {last_real_capital:,.2f} EUR")
print(f"   CAGR    : {adjusted_cagr}% | WR: {win_rate}% | DD: {summary['max_drawdown']}%")
print()

# Grouper les trades par mois d'entree
by_month = defaultdict(list)
for t in trades:
    by_month[t["d"][:7]].append(t)

for entry_m in sorted(by_month.keys(), reverse=True)[:4]:
    month_trades = by_month[entry_m]
    completed_m = [t for t in month_trades if t["s"] != "signal"]
    signals_m = [t for t in month_trades if t["s"] == "signal"]
    if not completed_m and not signals_m:
        continue
    total_pnl = sum(t["peur"] for t in month_trades if t["s"] != "signal")
    exit_m = month_trades[0]["ex"][:7] if month_trades else "?"
    ca_debut = month_trades[0]["ca"] if month_trades else 0
    ca_fin = ca_debut + total_pnl
    wins_m = sum(1 for t in completed_m if t["s"] == "win")
    loss_m = sum(1 for t in completed_m if t["s"] == "loss")
    label = "SIGNAUX" if signals_m else "TRADES"

    print(f"  --- {label} {entry_m} (sortie {exit_m}) : {wins_m}W/{loss_m}L PnL={total_pnl:+.0f}EUR ---")
    for t in month_trades:
        if t["s"] == "signal":
            print(f"     {t['t']:6s}  entree={t['pe']:>7.2f}  ->  sortie={t['ps']:>7.2f}  [SIGNAL EN COURS]")
        else:
            icon = "+" if t["pp"] > 0 else ""
            print(f"     {t['t']:6s}  {t['pe']:>7.2f} -> {t['ps']:>7.2f}  ({icon}{t['pp']:+.2f}%)  {t['peur']:>+8.2f}EUR  {'WIN' if t['pp']>0 else 'LOSS'}")
    if completed_m:
        print(f"     -> Capital debut={ca_debut:,.2f} -> fin={ca_fin:,.2f}")
    print()
