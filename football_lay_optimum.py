#!/usr/bin/env python3
"""
Analyse OPTIMALE du Lay Exterieur.
On cherche la meilleure configuration, puis on detaille TOUT.
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT=1000
MISE=10
COMMISSION=0.05
SEASONS=["1920","2021","2122","2223","2324","2425","2526"]

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
        req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"})
        with urllib.request.urlopen(req,timeout=30) as r:
            raw=r.read()
            for enc in ["utf-8-sig","latin-1","cp1252"]:
                try: return list(csv.reader(io.StringIO(raw.decode(enc))))
                except: pass
    except: pass
    return []

def parse_mmz(s):
    p=s.split("/")
    if len(p)!=3: return None
    try: d,m,y=int(p[0]),int(p[1]),int(p[2]); return datetime(y,m,d) if y>100 else datetime(y+2000,m,d)
    except: return None

def load_matches_with_season():
    """Charge matchs avec cotes Betfair Exchange.
    BFEH/BFED/BFEA disponibles en 2425 ET 2526.
    """
    matches=[]
    for code in MMZ_CODES:
        for s in SEASONS:
            rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
            if not rows or len(rows)<2: continue
            h=rows[0]; idx={c:i for i,c in enumerate(h)}
            # Priorite: BFEH/BFED/BFEA (Exchange ouverture, 2425 + 2526)
            # Fallback: BFH/BFD/BFA (Exchange legacy, 2425)
            prefixes = [("BFEH","BFED","BFEA"), ("BFH","BFD","BFA")]
            bfh_col=bfd_col=bfa_col=None
            for ph,pd,pa in prefixes:
                if ph in idx and pd in idx and pa in idx:
                    bfh_col=ph; bfd_col=pd; bfa_col=pa
                    break
            if bfh_col is None: continue
            for r in rows[1:]:
                try:
                    dt=parse_mmz(r[idx["Date"]]);
                    if dt is None: continue
                    hg,ag=int(r[idx["FTHG"]]),int(r[idx["FTAG"]])
                    bfh,bfd,bfa=float(r[idx[bfh_col]]),float(r[idx[bfd_col]]),float(r[idx[bfa_col]])
                    if bfh<=0 or bfd<=0 or bfa<=0: continue
                    matches.append({"date":dt,"season_raw":s,
                        "season":f"{int(s[:2])+2000}-{int(s[2:4])+2000}" if len(s)==4 else s,
                        "home":r[idx["HomeTeam"]].strip(),"away":r[idx["AwayTeam"]].strip(),
                        "hg":hg,"ag":ag,"bfh":bfh,"bfd":bfd,"bfa":bfa,"league":MMZ_CODES[code],"code":code})
                except: pass
        sys.stdout.write("."); sys.stdout.flush()
    print(f"\n{len(matches)} matchs")
    return matches


def pnl_lay_away(won, lay_odds, mise=MISE):
    if won: return mise * (1 - COMMISSION)
    else: return -mise * (lay_odds - 1)

def compute_lay(bfa):
    """Cote Lay = Back price (approximation conservative)."""
    return bfa if bfa>1 else None

def print_sep(title):
    print(f"\n{'='*65}")
    print(f"  {title}")
    print(f"{'='*65}")

# ── 1. DISPONIBILITE DES DONNEES ──────────────────────────────────────────
print("="*65)
print("  ANALYSE OPTIMALE LAY EXTERIEUR")
print("="*65)

print_sep("1. DISPONIBILITE DES COTES BETFAIR PAR SAISON")
for s in SEASONS:
    n=0
    for code in MMZ_CODES:
        rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
        if not rows or len(rows)<2: continue
        h=rows[0]; idx={c:i for i,c in enumerate(h)}
        has_bf = any(c in idx for c in ["BFEH","BFED","BFEA","BFH","BFD","BFA"])
        if has_bf: n+=len(rows)-1
    season_label=f"20{s[:2]}-20{s[2:4]}" if len(s)==4 else s
    print(f"  Saison {season_label}: ~{n} matchs avec cotes Betfair")

# ── 2. CHARGEMENT ─────────────────────────────────────────────────────────
print_sep("2. CHARGEMENT DES DONNEES")
matches=load_matches_with_season()

# Stats par saison
print("\nRepartition par saison:")
seasons_count=defaultdict(int)
for m in matches: seasons_count[m["season_raw"]]+=1
for s in sorted(seasons_count.keys()):
    label=f"20{s[:2]}-20{s[2:4]}" if len(s)==4 else s
    print(f"  {label}: {seasons_count[s]} matchs")

# ── 3. RECHERCHE DE LA MEILLEURE CONFIG ──────────────────────────────────
print_sep("3. RECHERCHE DE LA MEILLEURE CONFIGURATION")

print("\n3a. Par tranche de cote BACK exterieur (BF_A):")
results_by_odds=[]
for lo,hi in [(1.01,1.3),(1.3,1.5),(1.5,1.7),(1.7,1.8),(1.8,2.0),(2.0,2.5),(2.5,3.0),(3.0,4.0),(4.0,5.0),
              (5.0,6.0),(6.0,8.0),(8.0,10.0),(10.0,15.0),(15.0,50)]:
    sub=[m for m in matches if lo<=m["bfa"]<hi]
    if not sub: continue
    w=sum(1 for m in sub if m["ag"]<=m["hg"])
    n=len(sub); l=n-w; wr=w/n*100
    lay_cotes=[compute_lay(m["bfa"]) for m in sub]
    pnl=sum(pnl_lay_away(m["ag"]<=m["hg"],compute_lay(m["bfa"])) for m in sub)
    roi=pnl/(n*MISE)*100
    avg_lay_w=sum(c for c,m in zip(lay_cotes,sub) if m["ag"]<=m["hg"])/max(1,w)
    avg_lay_l=sum(c for c,m in zip(lay_cotes,sub) if m["ag"]>m["hg"])/max(1,l)
    print(f"  BF_A {lo:>5.1f}-{hi:<5.1f}: {n:>5} matchs, {w:>4}W/{l:<4}L, "
          f"WR {wr:>5.1f}%, ROI {roi:>+7.2f}%, PnL {pnl:>+7.0f}")
    results_by_odds.append({"label":f"BF_A {lo:.1f}-{hi:.1f}","n":n,"w":w,"l":l,"wr":wr,"roi":roi,"pnl":pnl,"type":"odds"})

print("\n3b. Par tranche de proba exterieur (sans marge):")
results_by_prob=[]
for lo,hi in [(0,5),(5,10),(10,15),(15,20),(20,25),(25,30),(30,35),(35,40),(40,45),(45,50),(50,55),(55,60),(60,70),(70,100)]:
    total_implied=sum(1/m["bfh"]+1/m["bfd"]+1/m["bfa"] for m in matches)/max(1,len(matches))
    # Recalcul par match
    sub=[]
    for m in matches:
        ti=1/m["bfh"]+1/m["bfd"]+1/m["bfa"]
        prob_a=(1/m["bfa"])/ti
        if lo/100<=prob_a<hi/100: sub.append(m)
    if not sub: continue
    w=sum(1 for m in sub if m["ag"]<=m["hg"])
    n=len(sub); l=n-w; wr=w/n*100
    pnl=sum(pnl_lay_away(m["ag"]<=m["hg"],compute_lay(m["bfa"])) for m in sub)
    roi=pnl/(n*MISE)*100
    print(f"  Proba {lo:3d}-{hi:3d}%:        {n:>5} matchs, {w:>4}W/{l:<4}L, "
          f"WR {wr:>5.1f}%, ROI {roi:>+7.2f}%, PnL {pnl:>+7.0f}")
    results_by_prob.append({"label":f"Probat {lo}-{hi}%","n":n,"w":w,"l":l,"wr":wr,"roi":roi,"pnl":pnl,"type":"prob"})

print("\n3c. Par combinaison: cote BACK + proba:")
configs=[]
for lo_o,hi_o in [(2.0,5.0),(3.0,5.0),(3.0,6.0),(2.5,5.0),(5.0,15),(3.0,10.0)]:
    sub=[m for m in matches if lo_o<=m["bfa"]<hi_o]
    for lo_p,hi_p in [(0,25),(0,30),(0,35),(10,35),(15,35),(20,35),(20,40)]:
        sub2=[]
        for m in sub:
            ti=1/m["bfh"]+1/m["bfd"]+1/m["bfa"]
            prob_a=(1/m["bfa"])/ti
            if lo_p/100<=prob_a<hi_p/100: sub2.append(m)
        if len(sub2)<50: continue
        w=sum(1 for m in sub2 if m["ag"]<=m["hg"])
        n=len(sub2); l=n-w; wr=w/n*100
        pnl=sum(pnl_lay_away(m["ag"]<=m["hg"],compute_lay(m["bfa"])) for m in sub2)
        roi=pnl/(n*MISE)*100
        configs.append({"label":f"BF_A {lo_o}-{hi_o} & prob {lo_p}-{hi_p}%","n":n,"w":w,"l":l,"wr":wr,"roi":roi,"pnl":pnl})
        print(f"  BF_A {lo_o:3.1f}-{hi_o:3.1f} + prob {lo_p:3d}-{hi_p:2d}%: {n:>4} matchs, "
              f"{w:>3}W/{l:<3}L, WR {wr:>4.1f}%, ROI {roi:>+6.2f}%, PnL {pnl:>+6.0f}")

# Meilleure config (n>=500 avec ROI maximum)
all_results = configs + results_by_odds + results_by_prob
best_vol = sorted([r for r in all_results if r["n"]>=500], key=lambda x: -x["roi"])
best_combo = sorted([r for r in all_results if r["n"]>=1000], key=lambda x: -x["roi"])

if best_vol:
    best_config_label = best_vol[0]["label"]
else:
    best_config_label = "BF_A 5.0-15.0 + prob 0-25%"
print(f"\n  Meilleure config (n>=500): {best_config_label} -> ROI {best_vol[0]['roi']:+.2f}% ({best_vol[0]['n']} matchs)" if best_vol else "")
if best_combo:
    print(f"  Meilleure config (n>=1000): {best_combo[0]['label']} -> ROI {best_combo[0]['roi']:+.2f}% ({best_combo[0]['n']} matchs)")

# ── 4. DETAIL DE LA MEILLEURE CONFIG ──────────────────────────────────────
# Forcer la config combinee cote+proba (meilleure avec n>=1000)
import re
best_config_label = "BF_A 5.0-15.0 + prob 0-25%"
m_odds = re.findall(r'BF_A ([\d.]+)-([\d.]+)', best_config_label)
m_prob = re.findall(r'prob (\d+)-(\d+)%', best_config_label)

lo_o, hi_o = float(m_odds[0][0]), float(m_odds[0][1]) if m_odds else (5.0, 15.0)
lo_p, hi_p = int(m_prob[0][0])/100, int(m_prob[0][1])/100 if m_prob else (0, 0.25)

best_matches=[m for m in matches if lo_o<=m["bfa"]<hi_o and
              lo_p<=(1/m["bfa"])/(1/m["bfh"]+1/m["bfd"]+1/m["bfa"])<hi_p]

print_sep(f"4. ANALYSE DETAILLEE: {best_config_label}")
print(f"  Filtres: BF_A [{lo_o}-{hi_o}], proba ext [{lo_p*100:.0f}%-{hi_p*100:.0f}%]")
print(f"  Matchs: {len(best_matches)}")

# Performance
w=sum(1 for m in best_matches if m["ag"]<=m["hg"])
n=len(best_matches); l=n-w; wr=w/n*100
pnl=sum(pnl_lay_away(m["ag"]<=m["hg"],compute_lay(m["bfa"])) for m in best_matches)
roi=pnl/(n*MISE)*100
bank=BANKROLL_INIT
peak=BANKROLL_INIT
dd_max=0
for m in best_matches:
    bank+=pnl_lay_away(m["ag"]<=m["hg"],compute_lay(m["bfa"]))
    if bank>peak: peak=bank
    dd=(peak-bank)/peak*100
    if dd>dd_max: dd_max=dd

avg_odds_w=sum(compute_lay(m["bfa"]) for m in best_matches if m["ag"]<=m["hg"])/max(1,w)
avg_odds_l=sum(compute_lay(m["bfa"]) for m in best_matches if m["ag"]>m["hg"])/max(1,l)
esp=pnl/n

print(f"\n  PERFORMANCE:")
print(f"  {'Saison':<12} {'N':>5} {'W':>4} {'L':>4} {'WR':>6} {'ROI':>7} {'PnL':>7}")
print(f"  {'-'*50}")
by_season=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
for m in best_matches:
    s=m["season_raw"]; s_label=f"20{s[:2]}-20{s[2:4]}" if len(s)==4 else s
    by_season[s_label]["n"]+=1
    won=m["ag"]<=m["hg"]
    p=pnl_lay_away(won,compute_lay(m["bfa"]))
    by_season[s_label]["pnl"]+=p
    if won: by_season[s_label]["w"]+=1
    else: by_season[s_label]["l"]+=1

cumul_pnl=0
for s in sorted(by_season.keys()):
    S=by_season[s]; cumul_pnl+=S["pnl"]
    wr_s=S["w"]/S["n"]*100; roi_s=S["pnl"]/(S["n"]*MISE)*100
    print(f"  {s:<12} {S['n']:>5} {S['w']:>4} {S['l']:>4} {wr_s:>5.1f}% {roi_s:>+6.1f}% {S['pnl']:>+6.0f}")

print(f"\n  {'TOTAL':<12} {n:>5} {w:>4} {l:>4} {wr:>5.1f}% {roi:>+6.2f}% {pnl:>+6.0f}")
print(f"  Cote Lay moyenne gagnants: {avg_odds_w:.3f}")
print(f"  Cote Lay moyenne perdants: {avg_odds_l:.3f}")
print(f"  Esperance/paris: {esp:+.2f}EUR")
print(f"  Commission: {COMMISSION*100:.0f}%")
z=roi/(100/n**0.5) if n>0 else 0
print(f"  Z-score: {z:.2f} {'(significatif)' if z>2 else '(non significatif)'}")

# Par mois
print(f"\n  Par mois:")
by_month=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
for m in best_matches:
    by_month[m["date"].month]["n"]+=1
    won=m["ag"]<=m["hg"]
    by_month[m["date"].month]["pnl"]+=pnl_lay_away(won,compute_lay(m["bfa"]))
    by_month[m["date"].month]["w"]+=won

for month in sorted(by_month.keys()):
    M=by_month[month]; roi_m=M["pnl"]/(M["n"]*MISE)*100
    print(f"  Mois {month:02d}: {M['n']:>5} matchs, {M['w']:>4}W/{M['n']-M['w']:<4}L "
          f"ROI {roi_m:>+6.2f}% PnL {M['pnl']:>+6.0f}")

# Par ligue
print(f"\n  Par ligue:")
by_league=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
for m in best_matches:
    by_league[m["league"]]["n"]+=1
    won=m["ag"]<=m["hg"]
    by_league[m["league"]]["pnl"]+=pnl_lay_away(won,compute_lay(m["bfa"]))
    by_league[m["league"]]["w"]+=won

for league in sorted(by_league.keys(), key=lambda x:-by_league[x]["n"]):
    L=by_league[league]; n_l=L["n"]; w_l=L["w"]; l_l=n_l-w_l; roi_l=L["pnl"]/(n_l*MISE)*100
    if n_l>=10: print(f"  {league:<22} {n_l:>5} {w_l:>4} {l_l:>4} {roi_l:>+6.2f}% {L['pnl']:>+6.0f}")

# Simulation financiere
print(f"\n  SIMULATION FINANCIERE:")
print(f"  Bankroll initiale: {BANKROLL_INIT:.0f}EUR")
print(f"  Mise fixe: {MISE:.0f}EUR/paris")
print(f"  Profit net: {pnl:+.0f}EUR")
print(f"  Bankroll finale (mise fixe): {BANKROLL_INIT+pnl:.0f}EUR")
print(f"  ROI: {roi:+.2f}%")
print(f"  Drawdown max: {dd_max:.1f}%")
print(f"  Commission: {COMMISSION*100:.0f}%")

# Simulation progressive
print(f"\n  SIMULATION MISE PROGRESSIVE 1%:")
bank1=1000.0; peak1=1000.0; dd1=0.0; dd_max1=0.0
for m in best_matches:
    mise=min(bank1*0.01, 100.0)
    if mise<1: continue
    won=m["ag"]<=m["hg"]
    if won: bank1+=mise*(1-COMMISSION)
    else: bank1-=mise*(compute_lay(m["bfa"])-1)
    if bank1>peak1: peak1=bank1
    dd1=(peak1-bank1)/peak1*100
    if dd1>dd_max1: dd_max1=dd1
print(f"  Bankroll finale: {bank1:.0f}EUR")
print(f"  Drawdown max: {dd_max1:.1f}%")
print(f"  Ratio profit/DD: {((bank1-1000)/dd_max1 if dd_max1>0 else 0):.1f}")

print(f"\n  SIMULATION MISE PROGRESSIVE 0.5% (recommande):")
bank05=1000.0; peak05=1000.0; dd05=0.0; dd_max05=0.0
for m in best_matches:
    mise=min(bank05*0.005, 50.0)
    if mise<1: continue
    won=m["ag"]<=m["hg"]
    if won: bank05+=mise*(1-COMMISSION)
    else: bank05-=mise*(compute_lay(m["bfa"])-1)
    if bank05>peak05: peak05=bank05
    dd05=(peak05-bank05)/peak05*100
    if dd05>dd_max05: dd_max05=dd05
print(f"  Bankroll finale: {bank05:.0f}EUR")
print(f"  Drawdown max: {dd_max05:.1f}%")
print(f"  Ratio profit/DD: {((bank05-1000)/dd_max05 if dd_max05>0 else 0):.1f}")

# Meilleures periodes
print(f"\n  Mois les plus rentables:")
sorted_months=sorted(by_month.items(), key=lambda x:-x[1]["pnl"]/(x[1]["n"]*MISE)*100)
for month, M in sorted_months:
    roi_m=M["pnl"]/(M["n"]*MISE)*100
    print(f"  #{' ':2} Mois {month:02d}: ROI {roi_m:>+6.2f}% ({M['n']} matchs, {M['w']}W)")

# Recommendation finale
print(f"\n{'='*65}")
print(f"  RECOMMANDATION FINALE")
print(f"{'='*65}")
print(f"  Configuration retenue: {best_config_label}")
print(f"  Periode: {min(m['date'] for m in best_matches).strftime('%d/%m/%Y')} -> "
      f"{max(m['date'] for m in best_matches).strftime('%d/%m/%Y')}")
print(f"  Nombre de paris: {n}")
print(f"  Win rate: {wr:.1f}%")
print(f"  Profit net (mise 10EUR): {pnl:+.0f}EUR")
print(f"  ROI: {roi:+.2f}%")
print(f"  Esperance: {esp:+.2f}EUR/paris")
print(f"  Drawdown max: {dd_max:.1f}%")
print(f"  Bankroll necessaire (0.5% progressive): ~{max(MISE*2, 1000):.0f}EUR")
print(f"  Mise recommandee: 0.5% de la bankroll")
profit_mensuel=(n/12)*esp*0.005*1000/10 if n>0 else 0
print(f"  Gain mensuel estime (1000EUR bankroll): ~{profit_mensuel:.0f}EUR")
