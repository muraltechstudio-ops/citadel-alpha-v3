#!/usr/bin/env python3
"""
Scan combinatoire Paroli — trouve la meilleure config (mise, mult, cap)
pour maximiser le profit en limitant les pertes.
"""
import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

COMMISSION = 0.05
SEASONS = ['2425', '2526']

MMZ_CODES = {
    'E0': 'Premier League', 'E1': 'Championship', 'E2': 'League 1', 'E3': 'League 2',
    'EC': 'National League', 'SC0': 'Premiership Scot', 'SC1': 'Champ Scot',
    'SC2': 'L1 Scot', 'SC3': 'L2 Scot', 'D1': 'Bundesliga 1', 'D2': 'Bundesliga 2',
    'I1': 'Serie A', 'I2': 'Serie B', 'SP1': 'La Liga', 'SP2': 'Segunda',
    'F1': 'Ligue 1', 'F2': 'Ligue 2', 'N1': 'Eredivisie', 'B1': 'Pro League (BEL)',
    'P1': 'Liga Portugal', 'T1': 'Super Lig (TUR)', 'G1': 'Super League (GRE)',
}
KEPT = {'T1', 'SP2', 'N1', 'SP1', 'E1', 'P1', 'G1', 'I1', 'B1'}


def fetch_csv(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as f:
            raw = f.read()
        for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
            try:
                return list(csv.reader(io.StringIO(raw.decode(enc))))
            except:
                pass
    except:
        pass
    return []


def parse_mmz(s):
    p = s.split('/')
    if len(p) != 3:
        return None
    try:
        d, m, y = int(p[0]), int(p[1]), int(p[2])
        return datetime(y + 2000, m, d) if y < 100 else datetime(y, m, d)
    except:
        return None


# ── CHARGEMENT ──────────────────────────────────────────────────────────
print("Chargement des donnees...")
matches = []
for code in MMZ_CODES:
    for s in SEASONS:
        rows = fetch_csv(f'https://www.football-data.co.uk/mmz4281/{s}/{code}.csv')
        if not rows or len(rows) < 2:
            continue
        h = rows[0]
        idx = {c: i for i, c in enumerate(h)}
        prefixes = [('BFEH', 'BFED', 'BFEA'), ('BFH', 'BFD', 'BFA')]
        bfh_c = bfd_c = bfa_c = None
        for ph, pd, pa in prefixes:
            if ph in idx and pd in idx and pa in idx:
                bfh_c, bfd_c, bfa_c = ph, pd, pa
                break
        if bfh_c is None:
            continue
        for r in rows[1:]:
            try:
                dt = parse_mmz(r[idx['Date']])
                if dt is None:
                    continue
                hg, ag = int(r[idx['FTHG']]), int(r[idx['FTAG']])
                bfa = float(r[idx[bfa_c]])
                if bfa <= 0:
                    continue
                matches.append({
                    'date': dt, 'code': code, 'hg': hg, 'ag': ag, 'bfa': bfa,
                    'res': 'WIN' if ag <= hg else 'LOSS'
                })
            except:
                pass
    sys.stdout.write('.')
    sys.stdout.flush()

print(f'\n{len(matches)} matchs charges')

# ── FILTRES 8-15 + 9 LIGUES + MAX 2/JOUR ──────────────────────────────
pool = [m for m in matches if 8.0 <= m['bfa'] < 15.0 and m['code'] in KEPT]
pool.sort(key=lambda x: x['date'])
by_date = defaultdict(list)
for m in pool:
    by_date[m['date']].append(m)

final = []
for date in sorted(by_date.keys()):
    day_m = sorted(by_date[date], key=lambda x: -x['bfa'])
    final.extend(day_m[:2])

print(f'{len(final)} paris retenus (310W / 18L)')

# ── SCAN COMBINATOIRE ──────────────────────────────────────────────────
results = []

mises_base = [5, 10, 15, 20, 25, 30]
multiplicateurs = [1.2, 1.3, 1.5, 1.7, 2.0, 2.5]
caps = [2, 3, 4, 5, 6, 10]

total_configs = len(mises_base) * len(multiplicateurs) * len(caps)
done = 0

for mise_base in mises_base:
    for mult in multiplicateurs:
        for cap in caps:
            bank = 2000.0
            streak = 0
            max_mise = mise_base
            max_loss = 0
            nb_losses_consec = 0
            max_loss_streak = 0

            for m in final:
                paroli_mult = mult ** min(streak, cap)
                mise = round(mise_base * paroli_mult, 2)
                if mise > max_mise:
                    max_mise = mise
                if m['res'] == 'WIN':
                    pnl = round(mise * (1 - COMMISSION), 2)
                    bank += pnl
                    streak += 1
                    nb_losses_consec = 0
                else:
                    pnl = round(-mise * (m['bfa'] - 1), 2)
                    bank += pnl
                    streak = 0
                    nb_losses_consec += 1
                    if nb_losses_consec > max_loss_streak:
                        max_loss_streak = nb_losses_consec
                    if abs(pnl) > max_loss:
                        max_loss = abs(pnl)

            profit = round(bank - 2000, 2)
            roi = profit / (len(final) * mise_base) * 100
            total_mise_total = round(mise_base * len(final), 2)

            results.append({
                'mise': mise_base, 'mult': mult, 'cap': cap,
                'profit': profit, 'roi': round(roi, 2),
                'max_mise': round(max_mise, 2),
                'max_loss': round(max_loss, 2),
                'ratio': round(profit / max_loss, 2) if max_loss > 0 else 999,
                'bank': round(bank, 2),
                'max_loss_streak': max_loss_streak,
                'total_mise': total_mise_total,
            })

            done += 1
            if done % 20 == 0:
                sys.stdout.write(f'\r  Scan: {done}/{total_configs} ({done * 100 // total_configs}%)')
                sys.stdout.flush()

print(f'\nScan termine: {len(results)} configurations')

# ── AFFICHAGE ──────────────────────────────────────────────────────────

# 1. TOP 20 par profit
results.sort(key=lambda x: -x['profit'])
print('\n' + '=' * 90)
print('TOP 20 — MEILLEUR PROFIT PAROLI')
print('=' * 90)
print(f"{'Mise':>5} {'Mult':>5} {'Cap':>4} {'Profit':>9} {'ROI%':>7} {'Bank':>8} "
      f"{'MaxMise':>8} {'MaxLoss':>8} {'Ratio':>7} {'LosStreak':>9}")
print('-' * 75)
for r in results[:20]:
    print(f"{r['mise']:>4}€ {r['mult']:>4.1f}x {r['cap']:>4} "
          f"{r['profit']:>+8.0f}€ {r['roi']:>+6.1f}% {r['bank']:>8.0f} "
          f"{r['max_mise']:>7.1f}€ {r['max_loss']:>7.0f}€ "
          f"{r['ratio']:>6.1f} {r['max_loss_streak']:>5}")

# 2. TOP 10 par ratio (securite)
results.sort(key=lambda x: -x['ratio'])
print('\n' + '=' * 90)
print('TOP 10 — MEILLEUR RATIO Profit/Perte max (SECURITE)')
print('=' * 90)
print(f"{'Mise':>5} {'Mult':>5} {'Cap':>4} {'Profit':>9} {'ROI%':>7} {'Bank':>8} "
      f"{'MaxMise':>8} {'MaxLoss':>8} {'Ratio':>7} {'LosStreak':>9}")
print('-' * 75)
for r in results[:10]:
    print(f"{r['mise']:>4}€ {r['mult']:>4.1f}x {r['cap']:>4} "
          f"{r['profit']:>+8.0f}€ {r['roi']:>+6.1f}% {r['bank']:>8.0f} "
          f"{r['max_mise']:>7.1f}€ {r['max_loss']:>7.0f}€ "
          f"{r['ratio']:>6.1f} {r['max_loss_streak']:>5}")

# 3. TOP 10 compromis: profit >= 2000 + meilleur ratio
print('\n' + '=' * 90)
print('TOP 10 — COMPROMIS (profit >= 2000€ et meilleur ratio)')
print('=' * 90)
candidates = [r for r in results if r['profit'] >= 2000]
candidates.sort(key=lambda x: -x['ratio'])
print(f"{'Mise':>5} {'Mult':>5} {'Cap':>4} {'Profit':>9} {'ROI%':>7} {'Bank':>8} "
      f"{'MaxMise':>8} {'MaxLoss':>8} {'Ratio':>7} {'LosStreak':>9}")
print('-' * 75)
for r in candidates[:10]:
    print(f"{r['mise']:>4}€ {r['mult']:>4.1f}x {r['cap']:>4} "
          f"{r['profit']:>+8.0f}€ {r['roi']:>+6.1f}% {r['bank']:>8.0f} "
          f"{r['max_mise']:>7.1f}€ {r['max_loss']:>7.0f}€ "
          f"{r['ratio']:>6.1f} {r['max_loss_streak']:>5}")

# 4. MEILLEUR COMPROMIS PAR MISE DE BASE
print('\n' + '=' * 90)
print('MEILLEUR COMPROMIS PAR MISE DE BASE (profit >= 1000, ratio max)')
print('=' * 90)
for mb in [5, 10, 15, 20, 25, 30]:
    subset = [r for r in results if r['mise'] == mb and r['profit'] >= 1000]
    if not subset:
        continue
    subset.sort(key=lambda x: -x['ratio'])
    best = subset[0]
    print(f"  Mise {mb:>2}€ | Mult x{best['mult']:.1f} | Cap {best['cap']} "
          f"| Profit {best['profit']:+.0f}€ | Ratio {best['ratio']:.1f} "
          f"| MaxMise {best['max_mise']:.0f}€ | MaxPerte {best['max_loss']:.0f}€")

# 5. RECOMMANDATION FINALE
# Score = profit / max_loss * 100 (penalise les grosses pertes)
print('\n' + '=' * 90)
print('RECOMMANDATION FINALE')
print('=' * 90)

# Compromis ideal: profit > 2500 ET ratio > 2.5
best_combo = None
best_score = -999
for r in results:
    if r['profit'] < 2000:
        continue
    score = r['profit'] * r['ratio']  # max= profit * ratio (penalise pertes)
    if score > best_score:
        best_score = score
        best_combo = r

if best_combo:
    print(f"\n  ★ Meilleur compromis global:")
    print(f"  ─────────────────────────────")
    print(f"  Mise de base:        {best_combo['mise']}€")
    print(f"  Multiplicateur:      x{best_combo['mult']:.1f}")
    print(f"  Cap wins max:        {best_combo['cap']}")
    print(f"  ─────────────────────────────")
    print(f"  Profit net:          {best_combo['profit']:+.0f}€")
    print(f"  ROI:                 {best_combo['roi']:+.2f}%")
    print(f"  Bankroll finale:     {best_combo['bank']:.0f}€")
    print(f"  Mise max atteinte:   {best_combo['max_mise']:.0f}€")
    print(f"  Perte max (1 lay):   {best_combo['max_loss']:.0f}€")
    print(f"  Ratio Profit/Perte:  {best_combo['ratio']:.1f}")
    print(f"  Max losses consec:   {best_combo['max_loss_streak']}")

# Aussi une variante conservative
conservative = [r for r in results if r['ratio'] >= 5.0 and r['profit'] >= 1000]
if conservative:
    conservative.sort(key=lambda x: -x['profit'])
    best_con = conservative[0]
    print(f"\n  ★ Variante conservative (ratio mini 5):")
    print(f"  ─────────────────────────────")
    print(f"  Mise de base:        {best_con['mise']}€")
    print(f"  Multiplicateur:      x{best_con['mult']:.1f}")
    print(f"  Cap wins max:        {best_con['cap']}")
    print(f"  Profit net:          {best_con['profit']:+.0f}€")
    print(f"  Max perte:           {best_con['max_loss']:.0f}€")
    print(f"  Ratio:               {best_con['ratio']:.1f}")
