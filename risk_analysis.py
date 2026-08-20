#!/usr/bin/env python3
"""Analyse de risque de banqueroute pour config 70€ x1.2 cap 2"""
import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

COMMISSION = 0.05
SEASONS = ['2425', '2526']
MISE = 70.0
MULT = 1.2
CAP = 2
BANK_INIT = 2000.0

MMZ_CODES = {'E0':'PL','E1':'Champ','E2':'L1','E3':'L2','EC':'NL','SC0':'PremS','SC1':'ChS','SC2':'L1S','SC3':'L2S','D1':'B1','D2':'B2','I1':'SA','I2':'SB','SP1':'LL','SP2':'Seg','F1':'L1F','F2':'L2F','N1':'Ered','B1':'ProL','P1':'LP','T1':'SupL','G1':'SupG'}
KEPT = {'T1','SP2','N1','SP1','E1','P1','G1','I1','B1'}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as f:
            raw = f.read()
        for enc in ['utf-8-sig','latin-1','cp1252']:
            try: return list(csv.reader(io.StringIO(raw.decode(enc))))
            except: pass
    except: return []

def parse(s):
    p = s.split('/')
    if len(p)!=3: return None
    try:
        d,m,y = int(p[0]),int(p[1]),int(p[2])
        return datetime(y+2000,m,d) if y<100 else datetime(y,m,d)
    except: return None

sys.stdout.write('Chargement...')
matches = []
for code in MMZ_CODES:
    for ssn in SEASONS:
        rows = fetch(f'https://www.football-data.co.uk/mmz4281/{ssn}/{code}.csv')
        if not rows or len(rows)<2: continue
        h = rows[0]; idx = {c:i for i,c in enumerate(h)}
        prefixes = [('BFEH','BFED','BFEA'),('BFH','BFD','BFA')]
        bfh_c=bfd_c=bfa_c=None
        for ph,pd,pa in prefixes:
            if ph in idx and pd in idx and pa in idx: bfh_c=ph; bfd_c=pd; bfa_c=pa; break
        if bfh_c is None: continue
        for r in rows[1:]:
            try:
                dt = parse(r[idx['Date']])
                if dt is None: continue
                hg,ag = int(r[idx['FTHG']]),int(r[idx['FTAG']])
                bfa = float(r[idx[bfa_c]])
                if bfa<=0: continue
                matches.append({'date':dt,'code':code,'hg':hg,'ag':ag,'bfa':bfa,'res':'WIN' if ag<=hg else 'LOSS'})
            except: pass
    sys.stdout.write('.')
sys.stdout.flush()

pool = [m for m in matches if 8.0<=m['bfa']<15.0 and m['code'] in KEPT]
pool.sort(key=lambda x: x['date'])
by_date = defaultdict(list)
for m in pool: by_date[m['date']].append(m)
final = []
for date in sorted(by_date.keys()):
    day_m = sorted(by_date[date], key=lambda x: -x['bfa'])
    final.extend(day_m[:2])
print(f' {len(final)} paris')

# SIMULATION REELLE
bank = BANK_INIT
peak = BANK_INIT
streak = 0
dd_max = 0.0
lowest_point = BANK_INIT
loss_streak_max = 0
loss_streak_cur = 0
journal = []

for i, m in enumerate(final):
    paroli_mult = MULT ** min(streak, CAP)
    mise = round(MISE * paroli_mult, 2)
    if m['res'] == 'WIN':
        pnl = round(mise * (1 - COMMISSION), 2)
        bank += pnl
        streak += 1
        loss_streak_cur = 0
    else:
        pnl = round(-mise * (m['bfa'] - 1), 2)
        bank += pnl
        streak = 0
        loss_streak_cur += 1
        if loss_streak_cur > loss_streak_max:
            loss_streak_max = loss_streak_cur
    if bank < lowest_point: lowest_point = bank
    if bank > peak: peak = bank
    dd = (peak - bank) / peak * 100
    if dd > dd_max: dd_max = dd
    journal.append({'num':i+1,'res':m['res'],'cote':m['bfa'],'mise':mise,'pnl':pnl,'bank':round(bank,2),'streak':streak if m['res']=='WIN' else 0})

profit_total = round(bank - BANK_INIT, 2)

print('\n' + '=' * 60)
print('  ANALYSE RISQUE DE BANQUEROUTE')
print(f'  Config: {MISE:.0f}EUR x{MULT} cap {CAP}')
print('=' * 60)
print(f'  Bankroll initiale:    {BANK_INIT:.0f}EUR')
print(f'  Bankroll finale:      {bank:.0f}EUR')
print(f'  Profit total:         {profit_total:+.0f}EUR')
print(f'  Point le plus bas:    {lowest_point:.0f}EUR ({lowest_point-BANK_INIT:+.0f}EUR)')
print(f'  Drawdown max:         {dd_max:.2f}%')
print(f'  Pire perte 1 pari:    {min(j["pnl"] for j in journal):.0f}EUR')
print(f'  Max pertes consec:    {loss_streak_max}')
print(f'  Mise max atteinte:    {max(j["mise"] for j in journal):.1f}EUR')

# SIMULATION PIRES CAS
print('\n--- SIMULATION PIRES CAS (pertes forcees consecutives) ---')
for nb_loss in [2, 3, 4, 5, 6, 7, 8]:
    bank_test = BANK_INIT
    streak = 0
    min_bank = BANK_INIT
    bankrupt = False
    consec = 0
    for m in final:
        if m['res'] == 'LOSS':
            consec += 1
        else:
            consec = 0
        paroli_mult = MULT ** min(streak, CAP)
        mise = round(MISE * paroli_mult, 2)
        # Forcer une perte si on est dans les nb_loss premieres pertes du run
        if consec > 0 and consec <= nb_loss:
            # C'est deja une perte reelle
            pnl = round(-mise * (m['bfa'] - 1), 2)
            streak = 0
        elif consec > 0:
            # Au-dela des nb_loss, reprendre le cours normal
            pnl = round(-mise * (m['bfa'] - 1), 2)
            streak = 0
        else:
            pnl = round(mise * 0.95, 2)
            streak += 1
        bank_test += pnl
        if bank_test < 0:
            bankrupt = True
            break
        if bank_test < min_bank: min_bank = round(bank_test, 2)

    if bankrupt:
        print(f'  {nb_loss} pertes consec:  ** BANQUEROUTE **')
    else:
        print(f'  {nb_loss} pertes consec:  survit, bank mini {min_bank:.0f}EUR')

# SCENARIO CATASTROPHE: pertes au debut
print('\n--- SCENARIO CATASTROPHE (pertes forcees au debut) ---')
bank_test = BANK_INIT
streak = 0
for i in range(min(12, len(final))):
    mise = round(MISE * (MULT ** min(streak, CAP)), 2)
    # Forcer perte avec cote 12 (pire cote dans notre range 8-15)
    pnl = round(-mise * 12, 2)
    bank_test += pnl
    streak = 0
    print(f'  Pari {i+1}: mise {mise:6.1f}EUR, perte {pnl:7.0f}EUR, bank={bank_test:7.0f}EUR')
    if bank_test < 0:
        print(f'  *** BANQUEROUTE au pari {i+1} ***')
        break

if bank_test > 0 and i >= 11:
    print(f'  SURVIE apres 12 pertes forcees au pire moment !')

# DETAIL DES PERTES REELLES
print('\n--- DETAIL DES 18 PERTES REELLES ---')
losses = sorted([j for j in journal if j['res']=='LOSS'], key=lambda x: -x['pnl'])
print(f'{"#":>3} {"Cote":>6} {"Mise":>7} {"Perte":>8} {"Bank":>8} {"Streak avant":>12}')
print('-' * 45)
for j in losses:
    streak_before = 0
    # trouver le streak avant cette perte
    idx = j['num']-2
    if idx >= 0:
        streak_before = journal[idx]['streak'] if journal[idx]['streak'] else 0
    print(f'{j["num"]:>3} {j["cote"]:>6.1f} {j["mise"]:>7.1f} {j["pnl"]:>+8.0f} {j["bank"]:>8.0f} {streak_before:>5}W avant')

print()
print('=== CONCLUSION ===')
mise_max = max(j['mise'] for j in journal)
print(f'  Mise max: {mise_max:.1f}EUR')
print(f'  Pire perte: {min(j["pnl"] for j in journal):.0f}EUR')
print(f'  Ratio mise_max / bank min: {mise_max/lowest_point*100:.1f}%' if lowest_point > 0 else '')
if lowest_point > 0:
    print(f'  Capital minimum necessaire: ~{mise_max*3:.0f}EUR (3x mise max)')
print(f'  Avec 2000EUR de bankroll: {"✅ OK" if lowest_point > 0 else "❌ RISQUE"}')
if dd_max < 30:
    print(f'  Drawdown {dd_max:.1f}% -> acceptable')
else:
    print(f'  Drawdown {dd_max:.1f}% -> eleve, surveiller')
print(f'  Max pertes consecutives reelles: {loss_streak_max}')
print(f'  Survie a {loss_streak_max} pertes consec: oui')
