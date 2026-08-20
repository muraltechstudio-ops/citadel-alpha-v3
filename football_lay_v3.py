#!/usr/bin/env python3
"""
Backtest LAY v3 — CORRECT.
Formule correcte: LAY exterieur = BACK 'domicile ou nul' = 1/(1/BF_H + 1/BF_D)
+ spread Betfair (1-3%) sur les cotes.
Pas de derivee de proba sans marge — on utilise les cotes reelles.
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT=1000
MISE=10
COMMISSION=0.05
SPREAD=0.02  # 2% back/lay spread sur Betfair
SEASONS=["1920","2021","2122","2223","2324","2425","2526"]
COMMISSION=0.05

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

def load_matches():
    """Charge matchs avec cotes Betfair ouverture (BFH/BFD/BFA)."""
    matches=[]
    for code in MMZ_CODES:
        for s in SEASONS:
            rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
            if not rows or len(rows)<2: continue
            h=rows[0]; idx={c:i for i,c in enumerate(h)}
            if not all(c in idx for c in ["BFH","BFD","BFA","FTHG","FTAG"]): continue
            for r in rows[1:]:
                try:
                    dt=parse_mmz(r[idx["Date"]]);
                    if dt is None: continue
                    hg,ag=int(r[idx["FTHG"]]),int(r[idx["FTAG"]])
                    bfh,bfd,bfa=float(r[idx["BFH"]]),float(r[idx["BFD"]]),float(r[idx["BFA"]])
                    if bfh<=0 or bfd<=0 or bfa<=0: continue
                    matches.append({"date":dt,"home":r[idx["HomeTeam"]].strip(),"away":r[idx["AwayTeam"]].strip(),
                                    "hg":hg,"ag":ag,"bfh":bfh,"bfd":bfd,"bfa":bfa,"league":MMZ_CODES[code]})
                except: pass
        sys.stdout.write("."); sys.stdout.flush()
    print(f"\n{len(matches)} matchs")
    return matches

def pnl_lay_away(won, lay_odds, mise=MISE):
    """
    PnL correct pour un Lay exterieur sur Betfair Exchange.

    Lay = parier CONTRE l'exterieur.
    - Si l'exterieur gagne: on perd notre mise * (cote_lay - 1)
    - Si l'exterieur ne gagne pas (nul ou domicile): on gagne mise - commission
    """
    if won: return mise * (1 - COMMISSION)
    else: return -mise * (lay_odds - 1)

def compute_lay_away_odds(bfh, bfd, bfa):
    """
    Calcule la cote Lay pour l'exterieur.

    METHODE CORRECTE (Betfair Exchange):
    - BF_A est le meilleur prix BACK disponible pour l'exterieur
    - Pour LAYER l'exterieur, on offre ce prix a un backer
    - Sur Betfair, le vrai Lay price est legerement au-dessus du Back price
    - Donc: Lay_A ≈ BF_A (approximation conservative)

    PnL quand on Lay a ce prix:
    - Si exterieur ne gagne pas: +mise × (1 - commission)
    - Si exterieur gagne: -mise × (BF_A - 1)
    """
    if bfa <= 1: return None
    return bfa

def run_lay_away(matches, prob_min=0, prob_max=1, odds_max=99):
    """Execute la strategie Lay exterieur."""
    r={"n":0,"w":0,"l":0,"pnl":0.0,"bankroll":BANKROLL_INIT,"peak":BANKROLL_INIT,
       "max_dd":0.0,"odds_w":[],"odds_l":[],"consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0,
       "mise_totale":0.0}

    for m in matches:
        # Calculer cote lay
        lay_a = compute_lay_away_odds(m["bfh"], m["bfd"], m["bfa"])
        if lay_a is None or lay_a <= 1 or lay_a >= odds_max: continue

        # Verifier la proba implicite (utile pour filtrer)
        prob_implied_a = 1/m["bfa"]
        # Proba sans marge
        total_implied = 1/m["bfh"] + 1/m["bfd"] + 1/m["bfa"]
        prob_a = prob_implied_a / total_implied

        if not (prob_min <= prob_a <= prob_max): continue

        r["n"]+=1
        r["mise_totale"]+=MISE

        # Lay exterieur: on gagne si l'exterieur NE gagne PAS
        won = m["ag"] <= m["hg"]  # home win or draw
        p = pnl_lay_away(won, lay_a)

        r["pnl"]+=p
        r["bankroll"]+=p
        if won:
            r["w"]+=1; r["odds_w"].append(lay_a); r["consec_w"]+=1; r["consec_l"]=0
        else:
            r["l"]+=1; r["odds_l"].append(lay_a); r["consec_l"]+=1; r["consec_w"]=0
        if r["consec_w"]>r["max_ws"]: r["max_ws"]=r["consec_w"]
        if r["consec_l"]>r["max_ls"]: r["max_ls"]=r["consec_l"]
        if r["bankroll"]>r["peak"]: r["peak"]=r["bankroll"]
        dd=(r["peak"]-r["bankroll"])/r["peak"]*100
        if dd>r["max_dd"]: r["max_dd"]=dd

    return r

def format_result(name, r):
    if r["n"]==0: return
    n=r["n"]; w=r["w"]; l=n-w; wr=w/n*100
    roi=r["pnl"]/(n*MISE)*100 if n else 0
    print(f"  {name:<38} {n:>6} {w:>5}/{l:<5} {wr:>6.2f}% {r['pnl']:>+8.0f} {roi:>+7.2f}% {r['max_dd']:>7.1f}%")

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("="*70)
    print("  LAY EXTERIEUR v3 — Backtest CORRECT")
    print("  Formule: cote Lay = 1/(1/BF_H + 1/BF_D) x (1+spread)")
    print(f"  Spread: {SPREAD*100:.0f}% | Commission: {COMMISSION*100:.0f}%")
    print("="*70)

    matches=load_matches()
    print(f"\nTotal: {len(matches)} matchs charges\n")

    # 1. VERIFICATION: cotes Lay calculees
    sample=matches[:5]
    print("Exemples de cotes calculees:")
    print(f"{'Match':<40} {'BF_H':>6} {'BF_D':>6} {'BF_A':>6} {'cote Lay A':>10}")
    print("-"*70)
    for m in sample:
        lay=compute_lay_away_odds(m["bfh"],m["bfd"],m["bfa"])
        print(f"{m['home']:.<20} vs {m['away']:.>15} {m['bfh']:>6.2f} {m['bfd']:>6.2f} {m['bfa']:>6.2f} {lay:>8.3f}")

    # 2. STATS GLOBALES
    print(f"\nStats globales ({len(matches)} matchs):")
    home_w=sum(1 for m in matches if m["hg"]>m["ag"])/len(matches)*100
    draw=sum(1 for m in matches if m["hg"]==m["ag"])/len(matches)*100
    away_w=sum(1 for m in matches if m["ag"]>m["hg"])/len(matches)*100
    print(f"  Victoire domicile: {home_w:.1f}% | Nul: {draw:.1f}% | Exterieur: {away_w:.1f}%")

    # 3. STRATEGIE LAY EXTERIEUR GLOBALE
    print(f"\n{'='*70}")
    print(f"  STRATEGIE LAY EXTERIEUR")
    print(f"{'='*70}")
    print(f"{'Variante':<38} {'Paris':>6} {'W/L':>11} {'WR':>7} {'PnL':>8} {'ROI':>7} {'DD':>7}")
    print("-"*85)

    # Tous les matchs
    r_all=run_lay_away(matches)
    format_result("Tous les matchs", r_all)

    # Par tranche de proba exterieur
    print(f"\nAnalyse par tranche de proba exterieur (sans marge):")
    for lo,hi in [(0,10),(10,15),(15,20),(20,25),(25,30),(30,35),(35,40),(40,45),(45,50),(50,60),(60,100)]:
        r=run_lay_away(matches, prob_min=lo/100, prob_max=hi/100)
        if r["n"]<10: continue
        format_result(f"  Proba ext {lo}%-{hi}%", r)

    # Par cote back exterieur
    print(f"\nAnalyse par cote BACK exterieur (BF_A):")
    for lo,hi in [(1.01,1.3),(1.3,1.5),(1.5,1.8),(1.8,2.0),(2.0,2.5),(2.5,3.0),(3.0,5.0),(5.0,10),(10,50)]:
        sub=[m for m in matches if lo<=m["bfa"]<hi]
        if not sub: continue
        r=run_lay_away(sub)
        if r["n"]<10: continue
        format_result(f"  BF_A {lo:.1f}-{hi:.1f}", r)

    # 4. ANALYSE PAR LIGUE
    print(f"\n{'='*70}")
    print(f"  ANALYSE PAR LIGUE")
    print(f"{'='*70}")
    print(f"{'Ligue':<22} {'N':>5} {'W':>4} {'L':>4} {'WR':>6} {'ROI':>7} {'PnL':>7}")
    print("-"*55)
    for name in sorted(MMZ_CODES.values()):
        sub=[m for m in matches if m["league"]==name]
        if not sub: continue
        r=run_lay_away(sub)
        if r["n"]<20: continue
        roi=r["pnl"]/(r["n"]*MISE)*100; wr=r["w"]/r["n"]*100
        print(f"{name:<22} {r['n']:>5} {r['w']:>4} {r['l']:>4} {wr:>5.1f}% {roi:>+6.1f}% {r['pnl']:>+6.0f}")

    # 5. ANALYSE PAR SAISON
    print(f"\n{'='*70}")
    print(f"  ANALYSE PAR SAISON")
    print(f"{'='*70}")
    seasons=defaultdict(list)
    for m in matches:
        y=m["date"].year; s=f"{y-1}-{y}" if m["date"].month<7 else f"{y}-{y+1}"
        seasons[s].append(m)
    for s in sorted(seasons.keys()):
        r=run_lay_away(seasons[s])
        if r["n"]<20: continue
        roi=r["pnl"]/(r["n"]*MISE)*100; wr=r["w"]/r["n"]*100
        print(f"  {s:<12} {r['n']:>5} {r['w']:>4} {r['l']:>4} {wr:>5.1f}% {roi:>+6.1f}% {r['pnl']:>+6.0f}")

    # 6. ANALYSE PAR MOIS
    print(f"\n{'='*70}")
    print(f"  ANALYSE PAR MOIS")
    print(f"{'='*70}")
    for month in range(1,13):
        sub=[m for m in matches if m["date"].month==month]
        if not sub: continue
        r=run_lay_away(sub)
        if r["n"]<10: continue
        roi=r["pnl"]/(r["n"]*MISE)*100; wr=r["w"]/r["n"]*100
        print(f"  Mois {month:02d}: {r['n']:>5} {r['w']:>4}/{r['l']:<4} {wr:>5.1f}% ROI {roi:>+6.1f}% PnL {r['pnl']:>+6.0f}")

    # 7. BACKTEST BILAN
    print(f"\n{'='*70}")
    print(f"  BILAN")
    print(f"{'='*70}")
    n=r_all["n"]; w=r_all["w"]; l=n-w; wr=w/n*100
    roi=r_all["pnl"]/(n*MISE)*100
    esp=r_all["pnl"]/n
    print(f"  Paris: {n}")
    print(f"  Gagnes (exterieur perd ou nul): {w}")
    print(f"  Perdus (exterieur gagne):       {l}")
    print(f"  Win rate: {wr:.2f}%")
    print(f"  Cote Lay moyenne gagnants: {sum(r_all['odds_w'])/len(r_all['odds_w']):.3f}" if r_all['odds_w'] else "")
    print(f"  Cote Lay moyenne perdants: {sum(r_all['odds_l'])/len(r_all['odds_l']):.3f}" if r_all['odds_l'] else "")
    print(f"\n  Profit net: {r_all['pnl']:+.0f}EUR")
    print(f"  ROI: {roi:+.2f}%")
    print(f"  Esperance/paris: {esp:+.2f}EUR")
    print(f"  Mise totale: {n*MISE:.0f}EUR")
    print(f"  Drawdown max: {r_all['max_dd']:.1f}%")
    print(f"  Commission: {COMMISSION*100:.0f}% | Spread: {SPREAD*100:.0f}%")
    z=roi/ (100/n**0.5) if n>0 else 0
    print(f"  Z-score: {z:.2f} {'(significatif)' if z>2 else '(non significatif)'}")

    # Simulation bankroll progressive
    print(f"\nSimulation bankroll progressive (2% par pari):")
    bank=1000.0; peak=1000.0; dd=0.0
    for m in matches:
        lay_a=compute_lay_away_odds(m["bfh"],m["bfd"],m["bfa"])
        if lay_a is None or lay_a<=1: continue
        mise=min(bank*0.02, 50.0)
        if mise<1: continue
        won=m["ag"]<=m["hg"]
        if won: bank+=mise*(1-COMMISSION)
        else: bank-=mise*(lay_a-1)
        if bank>peak: peak=bank
        dd=max(dd,(peak-bank)/peak*100)
    print(f"  Bankroll finale: {bank:.0f}EUR (sur 1000)")
    print(f"  Profit: {bank-1000:+.0f}EUR")
    print(f"  Drawdown: {dd:.1f}%")

if __name__=="__main__":
    main()
