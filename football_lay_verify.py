#!/usr/bin/env python3
"""
LAY PREMIUM — VERIFICATION SANS BIAIS.
Les regles sont determinees sur la saison 2425 (entrainement),
puis testees sur la saison 2526 (test).
Pas de data leakage.
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

COMMISSION=0.05
SEASONS=["2425","2526"]

MMZ_CODES={
    "E0":"Premier League","E1":"Championship","E2":"League 1","E3":"League 2","EC":"National League",
    "SC0":"Premiership Scot","SC1":"Champ Scot","SC2":"L1 Scot","SC3":"L2 Scot",
    "D1":"Bundesliga 1","D2":"Bundesliga 2",
    "I1":"Serie A","I2":"Serie B",
    "SP1":"La Liga","SP2":"Segunda",
    "F1":"Ligue 1","F2":"Ligue 2",
    "N1":"Eredivisie","B1":"Pro League (BEL)",
    "P1":"Liga Portugal","T1":"Super Lig (TUR)","G1":"Super League (GRE)",
}

def fetch_csv(url):
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req,timeout=30) as r:
            raw=r.read()
            for enc in ['utf-8-sig','latin-1','cp1252']:
                try: return list(csv.reader(io.StringIO(raw.decode(enc))))
                except: pass
    except: return []

def parse_mmz(s):
    p=s.split('/')
    if len(p)!=3: return None
    try: d,m,y=int(p[0]),int(p[1]),int(p[2]); return datetime(y+2000,m,d) if y<100 else datetime(y,m,d)
    except: return None

def pnl(won, odds, mise):
    return mise*(1-COMMISSION) if won else -mise*(odds-1)

# ── 1. CHARGEMENT ─────────────────────────────────────────────────────────
print("="*65)
print("  VERIFICATION SANS BIAIS — Entrainement 2425, Test 2526")
print("="*65)

all_matches={s:[] for s in SEASONS}
for code in MMZ_CODES:
    for s in SEASONS:
        rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
        if not rows or len(rows)<2: continue
        h=rows[0]; idx={c:i for i,c in enumerate(h)}
        prefixes=[('BFEH','BFED','BFEA'),('BFH','BFD','BFA')]
        bfh_col=bfd_col=bfa_col=None
        for ph,pd,pa in prefixes:
            if ph in idx and pd in idx and pa in idx: bfh_col=ph; bfd_col=pd; bfa_col=pa; break
        if bfh_col is None: continue
        for r in rows[1:]:
            try:
                dt=parse_mmz(r[idx['Date']])
                if dt is None: continue
                hg,ag=int(r[idx['FTHG']]),int(r[idx['FTAG']])
                bfh,bfd,bfa=float(r[idx[bfh_col]]),float(r[idx[bfd_col]]),float(r[idx[bfa_col]])
                if bfh<=0 or bfd<=0 or bfa<=0: continue
                ti=1/bfh+1/bfd+1/bfa
                prob_a=(1/bfa)/ti
                all_matches[s].append({"date":dt,"home":r[idx["HomeTeam"]].strip(),"away":r[idx["AwayTeam"]].strip(),
                    "hg":hg,"ag":ag,"bfa":bfa,"bfh":bfh,"bfd":bfd,"prob_a":prob_a,"code":code,"league":MMZ_CODES[code]})
            except: pass
    sys.stdout.write("."); sys.stdout.flush()

print(f"\n  2425: {len(all_matches['2425'])} matchs")
print(f"  2526: {len(all_matches['2526'])} matchs")

# ── 2. ANALYSE 2425 (ENTRAINEMENT) ─────────────────────────────────────────
train=all_matches["2425"]

# 2a. Filtre cote 5-15 + prob <25%
candidates=[m for m in train if 5.0<=m["bfa"]<15.0 and m["prob_a"]<0.25]
print(f"\n[ENTRAINEMENT 2425]")
print(f"  Candidats (cote 5-15 + prob<25%): {len(candidates)}")

# 2b. Analyser chaque ligue
league_perf=defaultdict(lambda:{"n":0,"w":0,"pnl":0.0})
for m in candidates:
    won=m["ag"]<=m["hg"]
    p=pnl(won,m["bfa"],10)
    league_perf[m["code"]]["n"]+=1
    league_perf[m["code"]]["pnl"]+=p
    if won: league_perf[m["code"]]["w"]+=1

print(f"\n  Performance par ligue (2425):")
print(f"  {'Ligue':<22} {'N':>4} {'ROI':>7} {'PnL':>7}")
print(f"  {'-'*42}")
elite_leagues={}
for code in sorted(league_perf.keys(), key=lambda x:-league_perf[x]["pnl"]):
    L=league_perf[code]
    roi=L["pnl"]/(L["n"]*10)*100
    print(f"  {MMZ_CODES[code]:<22} {L['n']:>4} {roi:>+6.1f}% {L['pnl']:>+6.0f}")
    if L["n"]>=20 and roi>0:
        elite_leagues[code]=MMZ_CODES[code]

print(f"\n  Ligues elues (n>=20, ROI>0): {', '.join(elite_leagues.values())}")

# 2c. Analyser chaque mois
month_perf=defaultdict(lambda:{"n":0,"pnl":0.0})
for m in candidates:
    if m["code"] not in elite_leagues: continue
    month_perf[m["date"].month]["n"]+=1
    month_perf[m["date"].month]["pnl"]+=pnl(m["ag"]<=m["hg"],m["bfa"],10)

print(f"\n  Performance par mois (2425, ligues elues):")
bad_months=[]
for month in sorted(month_perf.keys()):
    M=month_perf[month]
    roi=M["pnl"]/(M["n"]*10)*100 if M["n"] else 0
    print(f"    Mois {month:02d}: {M['n']:>4}m ROI {roi:>+7.2f}%")
    if M["n"]>=15 and roi<0:
        bad_months.append(month)
print(f"  Mois exclus (negatifs, n>=15): {bad_months}")

# ── 3. TEST SUR 2526 (OUT OF SAMPLE) ───────────────────────────────────────
test=all_matches["2526"]
print(f"\n[TEST 2526 — Out of sample]")
print(f"  Regles determinees sur 2425 uniquement:")
print(f"  - Ligues: {len(elite_leagues)} elues")
print(f"  - Mois exclus: {bad_months}")
print(f"  - Cote 5-15, prob<25%")
print(f"  - Max 2/jour")

# Filtrer
kept=[]
for m in test:
    if not (5.0<=m["bfa"]<15.0): continue
    if m["prob_a"]>=0.25: continue
    if m["code"] not in elite_leagues: continue
    if m["date"].month in bad_months: continue
    kept.append(m)

# Version sans tuning: max 2/jour par ordre de cote decroissante
by_date_test=defaultdict(list)
for m in kept: by_date_test[m["date"]].append(m)
selected2=[]
for date in sorted(by_date_test.keys()):
    day_m=sorted(by_date_test[date], key=lambda x:-x["bfa"])
    selected2.extend(day_m[:2])

print(f"\n  Matchs retenus: {len(kept)}")
print(f"  Apres max 2/jour: {len(selected2)}")

# Backtest
MISE=10.0
for label, paris in [("Sans tuning", selected2)]:
    bank=2000; peak=2000; dd_max=0.0; pnl_tot=0.0; w=l=0; ws=ls=0; mws=mls=0
    for m in paris:
        won=m["ag"]<=m["hg"]
        p=pnl(won,m["bfa"],MISE)
        bank+=p; pnl_tot+=p
        if won: w+=1; ws+=1; ls=0
        else: l+=1; ls+=1; ws=0
        mws=max(mws,ws); mls=max(mls,ls)
        if bank>peak: peak=bank
        dd_max=max(dd_max, (peak-bank)/peak*100)

    n=w+l; wr=w/n*100; roi=pnl_tot/(n*MISE)*100
    aw=sum(m["bfa"] for m in paris if m["ag"]<=m["hg"])/max(1,w)
    al=sum(m["bfa"] for m in paris if m["ag"]>m["hg"])/max(1,l)
    z=roi/(100/n**0.5) if n else 0

    print(f"\n  {label}:")
    print(f"    Paris: {n}")
    print(f"    W/L: {w}/{l}")
    print(f"    WR: {wr:.1f}%")
    print(f"    Cote moy W/L: {aw:.2f}/{al:.2f}")
    print(f"    PnL: {pnl_tot:+.0f}EUR")
    print(f"    ROI: {roi:+.2f}%")
    print(f"    DD max: {dd_max:.1f}%")
    print(f"    Streak max W/L: {mws}/{mls}")
    print(f"    Z-score: {z:.2f} {'(OK)' if z>2 else '(faible)'}")

    # Simulation progressive
    bank2=2000; peak2=2000; dd2=0.0
    for m in paris:
        mise_p=min(bank2*0.0033, 20.0)
        if mise_p<1: continue
        won=m["ag"]<=m["hg"]
        if won: bank2+=mise_p*(1-COMMISSION)
        else: bank2-=mise_p*(m["bfa"]-1)
        if bank2>peak2: peak2=bank2
        dd2=max(dd2, (peak2-bank2)/peak2*100)
    print(f"    Bankroll 0.33%: {bank2:.0f}EUR (DD {dd2:.1f}%)")

# ── 4. VERIFICATION PAR SAISON COMPLETE (2425 seulement, transparence) ──────
print(f"\n{'='*65}")
print(f"  CHECK: Et si on avait joue 2425 avec les MEMES regles?")
print(f"{'='*65}")
# Appliquer les memes regles sur 2425
kept25=[]
for m in train:
    if not (5.0<=m["bfa"]<15.0): continue
    if m["prob_a"]>=0.25: continue
    if m["code"] not in elite_leagues: continue
    if m["date"].month in bad_months: continue
    kept25.append(m)

by_date25=defaultdict(list)
for m in kept25: by_date25[m["date"]].append(m)
sel25=[]
for date in sorted(by_date25.keys()):
    day_m=sorted(by_date25[date], key=lambda x:-x["bfa"])
    sel25.extend(day_m[:2])

bank=2000; pnl_tot=0.0; w=l=0; dd_max=0.0; peak=2000
for m in sel25:
    won=m["ag"]<=m["hg"]
    p=pnl(won,m["bfa"],MISE)
    bank+=p; pnl_tot+=p
    if won: w+=1
    else: l+=1
    if bank>peak: peak=bank
    dd_max=max(dd_max, (peak-bank)/peak*100)

n=w+l
print(f"  2425 (in-sample, memes regles):")
print(f"  Paris: {n} | W/L: {w}/{l} | WR: {w/n*100:.1f}% | PnL: {pnl_tot:+.0f} | ROI: {pnl_tot/(n*MISE)*100:+.2f}%")
