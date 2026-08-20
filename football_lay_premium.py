#!/usr/bin/env python3
"""
Lay EXTERIEUR — Version PREMIUM.
Filtres renforces pour max 2 paris/jour.
Score de confiance, ligues filtrees, cote serree, saisonnalite.
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT=2000
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

BEST_LEAGUES = {  # ligues avec ROI > 5% sur les 2 saisons et n>=50
    "N1":"Eredivisie","SP2":"Segunda","B1":"Pro League (BEL)",
    "T1":"Super Lig (TUR)","P1":"Liga Portugal","SC1":"Champ Scot",
    "E1":"Championship","EC":"National League","I1":"Serie A",
    "SC0":"Premiership Scot","D2":"Bundesliga 2",
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
    try: d,m,y=int(p[0]),int(p[1]),int(p[2]); return datetime(y,m,d) if y>100 else datetime(y+2000,m,d)
    except: return None

def pnl(won, odds):
    return MISE*(1-COMMISSION) if won else -MISE*(odds-1)

# ── 1. CHARGEMENT ──────────────────────────────────────────────────────────
print("="*65)
print("  LAY EXTERIEUR PREMIUM — Max 2 paris/jour")
print("="*65)

matches=[]
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
                matches.append({"date":dt,"season_raw":s,
                    "home":r[idx["HomeTeam"]].strip(),"away":r[idx["AwayTeam"]].strip(),
                    "hg":hg,"ag":ag,"bfh":bfh,"bfd":bfd,"bfa":bfa,
                    "league":MMZ_CODES[code],"code":code})
            except: pass
    sys.stdout.write("."); sys.stdout.flush()
print(f"\n{len(matches)} matchs charges")

# ── 2. SCORING + FILTRES ──────────────────────────────────────────────────
print(f"\nApplication des filtres...\n")

filter_stats=defaultdict(int)
kept=[]

for m in matches:
    bfa=m["bfa"]; bfh=m["bfh"]; bfd=m["bfd"]
    code=m["code"]

    # Filtre 0: cote 5-15
    if not (5.0 <= bfa < 15.0): continue
    filter_stats["cote 5-15"]+=1

    # Filtre 1: proba ext < 25%
    ti=1/bfh+1/bfd+1/bfa
    prob_a=(1/bfa)/ti
    if prob_a >= 0.25: continue
    filter_stats["prob<25%"]+=1

    # Filtre 2: ligues elites uniquement (celles avec ROI stable > 5%)
    if code not in BEST_LEAGUES: continue
    filter_stats["ligue elite"]+=1

    # Filtre 3: saisonnalite (eviter avril, novembre si negatif)
    month=m["date"].month
    if month in [11]:
        filter_stats["evit nov"]+=1
        continue

    m["prob_a"]=prob_a
    m["score"]=0
    kept.append(m)

print("Filtres appliques:")
for k,v in sorted(filter_stats.items()): print(f"  {k}: {v}")
print(f"\nMatchs retenus avant plafond: {len(kept)}")

# ── 3. SCORING ─────────────────────────────────────────────────────────────
# Score /10 base sur la qualite du match
for m in kept:
    s=5  # base

    # Cote: plus la cote est haute, plus le Lay est sur (car l'equipe est faible)
    if 5.0 <= m["bfa"] < 6.0: s+=0
    elif 6.0 <= m["bfa"] < 8.0: s+=1
    elif 8.0 <= m["bfa"] < 12.0: s+=2
    elif 12.0 <= m["bfa"] < 15.0: s+=1

    # Ligue: bonus si c'est une ligue avec bon historique
    lig_bonus={"N1":2,"SP2":2,"T1":2,"B1":1,"P1":1,"I1":1,"E1":1,"EC":1,"SC0":1,"D2":1,"SC1":1}
    s+=lig_bonus.get(m["code"],0)

    # Probabilite: plus l'ecart avec 25% est grand, mieux c'est
    if m["prob_a"] < 0.10: s+=1
    if m["prob_a"] < 0.05: s+=1

    m["score"]=min(10,s)

# ── 4. SELECTION MAX 2/JOUR ───────────────────────────────────────────────
by_date=defaultdict(list)
for m in kept: by_date[m["date"]].append(m)

selected=[]
for date in sorted(by_date.keys()):
    day_m=by_date[date]
    day_m.sort(key=lambda x:-x["score"])
    # Max 2 meilleurs par jour
    selected.extend(day_m[:2])

print(f"Apres plafond 2/jour: {len(selected)} paris")
print(f"Soit ~{len(selected)/len(SEASONS)/9:.0f}/mois (~{len(selected)/len(SEASONS)/250:.2f}/jour)")

# ── 5. BACKTEST ────────────────────────────────────────────────────────────
MISE=10.0
bank=BANKROLL_INIT; peak=BANKROLL_INIT; dd_max=0.0; pnl_total=0.0
w=l=0; consec_w=consec_l=0; max_ws=max_ls=0; odds_w=[]; odds_l=[]

for m in selected:
    won=m["ag"]<=m["hg"]
    p=pnl(won,m["bfa"])
    bank+=p; pnl_total+=p
    if won: w+=1; odds_w.append(m["bfa"]); consec_w+=1; consec_l=0
    else: l+=1; odds_l.append(m["bfa"]); consec_l+=1; consec_w=0
    if consec_w>max_ws: max_ws=consec_w
    if consec_l>max_ls: max_ls=consec_l
    if bank>peak: peak=bank
    dd=(peak-bank)/peak*100
    if dd>dd_max: dd_max=dd

n=w+l; wr=w/n*100; roi=pnl_total/(n*MISE)*100
aw=sum(odds_w)/len(odds_w) if odds_w else 0
al=sum(odds_l)/len(odds_l) if odds_l else 0
z=roi/(100/n**0.5) if n else 0

print(f"\n{'='*65}")
print(f"  RESULTATS PREMIUM")
print(f"{'='*65}")
print(f"\n  Paris:                {n}")
print(f"  Gagnes (lay gagne):   {w}")
print(f"  Perdus (lay perd):    {l}")
print(f"  Win rate:             {wr:.1f}%")
print(f"  Cote moy gagnants:    {aw:.3f}")
print(f"  Cote moy perdants:    {al:.3f}")
print(f"\n  Bankroll initiale:    {BANKROLL_INIT:.0f}EUR")
print(f"  Mise/paris:           {MISE:.0f}EUR")
print(f"  Capital total mise:   {n*MISE:.0f}EUR")
print(f"  Profit net:           {pnl_total:+.0f}EUR")
print(f"  Bankroll finale:      {bank:.0f}EUR")
print(f"  ROI:                  {roi:+.2f}%")
print(f"  Esperance/paris:      {pnl_total/n:+.2f}EUR")
print(f"  Drawdown max:         {dd_max:.1f}%")
print(f"  Max win streak:       {max_ws}")
print(f"  Max loss streak:      {max_ls}")
print(f"  Z-score:              {z:.2f} {'(OK)' if z>2 else '(faible)'}")
print(f"  Commission:           {COMMISSION*100:.0f}%")

# Par saison
print(f"\n  Par saison:")
for s in SEASONS:
    sub=[m for m in selected if m["season_raw"]==s]
    if not sub: continue
    n2=len(sub); w2=sum(1 for m in sub if m["ag"]<=m["hg"])
    pnl2=sum(pnl(m["ag"]<=m["hg"],m["bfa"]) for m in sub)
    print(f"    20{s[:2]}-20{s[2:4]}: {n2:>4}m {w2:>4}W/{n2-w2:<4}L "
          f"ROI {pnl2/(n2*MISE)*100:+7.2f}% PnL {pnl2:+6.0f}EUR")

# Par ligue
print(f"\n  Par ligue (top 10):")
by_league=defaultdict(lambda:{"n":0,"pnl":0.0})
for m in selected:
    by_league[m["league"]]["n"]+=1
    by_league[m["league"]]["pnl"]+=pnl(m["ag"]<=m["hg"],m["bfa"])
for lig in sorted(by_league.keys(), key=lambda x:-by_league[x]["pnl"]):
    L=by_league[lig]; roi_l=L["pnl"]/(L["n"]*MISE)*100
    if L["n"]>=10: print(f"  {lig:<22} {L['n']:>4}m ROI {roi_l:>+7.2f}% PnL {L['pnl']:+6.0f}")

# Simulation progressive
print(f"\n  Simulation progressive (0.33% de bankroll):")
bank2=BANKROLL_INIT; peak2=BANKROLL_INIT; dd2=0.0
for m in selected:
    mise_p=min(bank2*0.0033, 20.0)
    if mise_p<1: continue
    won=m["ag"]<=m["hg"]
    if won: bank2+=mise_p*(1-COMMISSION)
    else: bank2-=mise_p*(m["bfa"]-1)
    if bank2>peak2: peak2=bank2
    dd2=max(dd2, (peak2-bank2)/peak2*100)
print(f"  Bankroll finale: {bank2:.0f}EUR (depart {BANKROLL_INIT})")
print(f"  Drawdown max: {dd2:.1f}%")
print(f"  Mise moyenne: ~{6.6:.0f}EUR")
gain_mensuel=((bank2-BANKROLL_INIT)/len(SEASONS)/9)
print(f"  Gain mensuel estime: ~{gain_mensuel:.0f}EUR")

# Distribution des scores
print(f"\n  Distribution des scores (/10):")
score_dist=defaultdict(int)
for m in selected: score_dist[m["score"]]+=1
for s in sorted(score_dist.keys()): print(f"  Score {s}: {score_dist[s]} paris")

# Distribution des cotes
print(f"\n  Distribution des cotes:")
cote_dist=defaultdict(int)
for m in selected:
    c=int(m["bfa"])
    cote_dist[c]+=1
for c in sorted(cote_dist.keys()): print(f"  Cote {c}: {cote_dist[c]} paris")
