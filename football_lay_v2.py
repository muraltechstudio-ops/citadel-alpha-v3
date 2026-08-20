#!/usr/bin/env python3
"""
Backtest LAY v2 — 100% sans biais.
- Cotes d'OUVERTURE Betfair (BFH/BFD/BFA) au lieu de clôture
- Commission Betfair 5% appliquee
- Filtrage: Lay EXTERIEUR uniquement (seule strategie prometteuse)
- Analyse detaillee: par ligue, saison, mois, tranche de cotes
- Verification de stabilite dans le temps
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT = 1000.0
MISE = 10.0
COMMISSION = 0.05
SEASONS = ["1920","2021","2122","2223","2324","2425","2526"]

MMZ_CODES = {
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
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
            for enc in ["utf-8-sig","latin-1","cp1252"]:
                try: return list(csv.reader(io.StringIO(raw.decode(enc))))
                except: pass
    except: pass
    return []

def parse_mmz(s):
    p=s.split("/")
    if len(p)!=3: return None
    try: d,m,y=int(p[0]),int(p[1]),int(p[2]); return datetime(y,m,d) if y<100 else datetime(y+2000 if y<2000 else y,m,d)
    except: return None

def pnl_lay(won, lay_odds, mise=MISE):
    if won: return mise * (1 - COMMISSION)
    else: return -mise * (lay_odds - 1)

def compute_lay(back_h, back_d, back_a):
    """Calcule cotes Lay + proba sans marge."""
    total = 1/back_h + 1/back_d + 1/back_a
    if total <= 0: return 0,0,0,0,0,0
    prob_h = (1/back_h) / total
    prob_d = (1/back_d) / total
    prob_a = (1/back_a) / total
    lay_h = 1 / (1 - prob_h) if prob_h < 1 else 0
    lay_d = 1 / (1 - prob_d) if prob_d < 1 else 0
    lay_a = 1 / (1 - prob_a) if prob_a < 1 else 0
    return lay_h, lay_d, lay_a, prob_h, prob_d, prob_a

def load_matches(use_opening=True):
    """Charge les matchs avec cotes Betfair OUVRANTES (BFH/D/A) ou CLOTURE (BFCH/D/A)."""
    prefix = "BF" if use_opening else "BFC"
    matches=[]
    for code in MMZ_CODES:
        for s in SEASONS:
            rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
            if not rows or len(rows)<2: continue
            h=rows[0]; idx={c:i for i,c in enumerate(h)}
            cols_needed=[f"{prefix}H",f"{prefix}D",f"{prefix}A"]
            if not all(c in idx for c in cols_needed): continue
            for r in rows[1:]:
                try:
                    dt=parse_mmz(r[idx["Date"]])
                    if dt is None: continue
                    hg,ag=int(r[idx["FTHG"]]),int(r[idx["FTAG"]])
                    bfh=float(r[idx[f"{prefix}H"]]); bfd=float(r[idx[f"{prefix}D"]]); bfa=float(r[idx[f"{prefix}A"]])
                    if bfh<=0 or bfd<=0 or bfa<=0: continue
                    matches.append({
                        "date":dt,"home":r[idx["HomeTeam"]].strip(),"away":r[idx["AwayTeam"]].strip(),
                        "hg":hg,"ag":ag,"bf_h":bfh,"bf_d":bfd,"bf_a":bfa,"league":MMZ_CODES[code],"code":code,
                    })
                except: pass
        sys.stdout.write("."); sys.stdout.flush()
    print(f"\n{len(matches)} matchs")
    return matches

def compute_probas(matches):
    """Ajoute probas et cotes Lay a tous les matchs."""
    for m in matches:
        m["lay_h"],m["lay_d"],m["lay_a"],m["prob_h"],m["prob_d"],m["prob_a"] = compute_lay(m["bf_h"],m["bf_d"],m["bf_a"])
        m["winner"]="H" if m["hg"]>m["ag"] else ("A" if m["ag"]>m["hg"] else "D")

def print_detail(name, results):
    n=results["n"]; w=results["w"]; l=n-w
    wr=w/n*100 if n else 0
    roi=results["pnl"]/(n*MISE)*100 if n else 0
    aw=sum(results["odds_w"])/len(results["odds_w"]) if results["odds_w"] else 0
    al=sum(results["odds_l"])/len(results["odds_l"]) if results["odds_l"] else 0
    print(f"  {name:<35} {n:>6} {w:>5}/{l:<5} {wr:>6.2f}% {results['pnl']:>+8.0f} "
          f"{roi:>+7.2f}% {results['max_dd']:>7.1f}%")

def run_lay_away(matches, prob_min=0, prob_max=1, odds_max=99):
    """Strategie Lay exterieur: on parie contre l'exterieur (pari = 'l'exterieur ne gagne pas')."""
    r={"n":0,"w":0,"l":0,"pnl":0.0,"bankroll":BANKROLL_INIT,"peak":BANKROLL_INIT,
       "max_dd":0.0,"odds_w":[],"odds_l":[],"consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0}
    for m in matches:
        if not (prob_min <= m["prob_a"] <= prob_max): continue
        if m["lay_a"] >= odds_max or m["lay_a"] <= 1: continue
        r["n"]+=1
        won=m["winner"]!="A"
        p=pnl_lay(won,m["lay_a"])
        r["pnl"]+=p; r["bankroll"]+=p
        if won: r["w"]+=1; r["odds_w"].append(m["lay_a"]); r["consec_w"]+=1; r["consec_l"]=0
        else: r["l"]+=1; r["odds_l"].append(m["lay_a"]); r["consec_l"]+=1; r["consec_w"]=0
        if r["consec_w"]>r["max_ws"]: r["max_ws"]=r["consec_w"]
        if r["consec_l"]>r["max_ls"]: r["max_ls"]=r["consec_l"]
        if r["bankroll"]>r["peak"]: r["peak"]=r["bankroll"]
        dd=(r["peak"]-r["bankroll"])/r["peak"]*100
        if dd>r["max_dd"]: r["max_dd"]=dd
    return r

def table_analysis(matches, group_key, bin_defs, title, value_key="none"):
    """Analyse par groupe (ligue, saison, mois, cote)."""
    groups=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
    for m in matches:
        if m["lay_a"]<=1: continue
        if group_key=="month": g=str(m["date"].month)
        elif group_key=="season":
            y=m["date"].year; g=f"{y-1}-{y}" if m["date"].month<7 else f"{y}-{y+1}"
        else: g=m[group_key]
        for label, key, lo, hi in bin_defs:
            if group_key=="odds" and not (lo <= m["lay_a"] < hi): continue
            if group_key=="prob" and not (lo <= m["prob_a"] < hi): continue
            if group_key in ("league","month","season") and g!=label: continue
            L=groups[g if group_key in ("league","month","season") else label]
            L["n"]+=1
            won=m["winner"]!="A"
            p=pnl_lay(won,m["lay_a"])
            L["pnl"]+=p
            if won: L["w"]+=1; L["l"]+=0
            else: L["l"]+=1; L["w"]+=0
            break

    print(f"\n{title}")
    print(f"{'Groupe':<25} {'N':>6} {'W':>5} {'L':>5} {'WR':>7} {'ROI':>8} {'PnL':>8}")
    print("-"*65)

    sorted_groups=sorted(groups.items(), key=lambda x: -x[1]["n"])
    for g, L in sorted_groups:
        n=L["n"]; w=L["w"]; l=n-w; wr=w/n*100; roi=L["pnl"]/(n*MISE)*100
        if n<10: continue
        print(f"{g:<25} {n:>6} {w:>5} {l:>5} {wr:>6.2f}% {roi:>+7.2f}% {L['pnl']:>+7.0f}")

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("="*70)
    print("  LAY EXTERIEUR v2 — Backtest sans biais")
    print("  Cotes OUVRANTES Betfair (BFH/BFD/BFA)")
    print("  Commission 5%")
    print("="*70)

    # 1. CHARGEMENT AVEC COTES OUVRANTES
    print("\n[1/3] Chargement cotes ouvrantes Betfair...")
    matches=load_matches(use_opening=True)
    compute_probas(matches)
    print(f"  Total: {len(matches)} matchs")

    # Verif marge moyenne
    avg_margin=sum(1/m["bf_h"]+1/m["bf_d"]+1/m["bf_a"] for m in matches)/len(matches)
    print(f"  Marge Betfair Exchange moyenne: {(avg_margin-1)*100:.2f}%")

    # 2. STRATEGIE LAY EXTERIEUR — RECHERCHE DU SWEET SPOT
    print(f"\n[2/3] Recherche de la meilleure fenetre de probabilite...")
    print(f"\nBacktest global: Lay Exterieur (tous les matchs)")
    r_all=run_lay_away(matches)
    print_detail("Tous les matchs", r_all)

    print(f"\nAnalyse par tranche de proba exterieur:")
    print(f"{'Probabilite ext.':<20} {'N':>6} {'W':>5} {'L':>5} {'WR':>7} {'ROI':>8} {'PnL':>8}")
    print("-"*65)
    best={"roi":-999}
    for lo,hi in [(0,10),(10,15),(15,20),(20,25),(25,30),(30,35),(35,40),(40,45),(45,50),
                   (50,55),(55,60),(60,70),(70,100)]:
        r=run_lay_away(matches, prob_min=lo/100, prob_max=hi/100)
        if r["n"]<5: continue
        wr=r["w"]/r["n"]*100; roi=r["pnl"]/(r["n"]*MISE)*100
        print(f"  {lo:3d}-{hi:2d}% {'':8} {r['n']:>6} {r['w']:>5} {r['l']:>5} {wr:>6.2f}% {roi:>+7.2f}% {r['pnl']:>+7.0f}")
        if roi>best["roi"] and r["n"]>=50:
            best={"lo":lo,"hi":hi,"roi":roi,"n":r["n"],"pnl":r["pnl"]}

    # Analyser aussi par cote Lay
    print(f"\nAnalyse par cote Lay exterieur:")
    for lo,hi in [(1.01,1.3),(1.3,1.5),(1.5,2.0),(2.0,2.5),(2.5,3.0),(3.0,4.0),(4.0,6.0),(6.0,20)]:
        r=run_lay_away(matches, odds_max=hi)
        sub=[m for m in matches if lo<=m["lay_a"]<hi]
        if not sub: continue
        wr=r["w"]/r["n"]*100; roi=r["pnl"]/(r["n"]*MISE)*100
        # Mais r est calcule sans filtre prob, ce qui est faux
        # Corrigeons:
        r2={"n":0,"w":0,"l":0,"pnl":0.0,"bankroll":BANKROLL_INIT,"peak":BANKROLL_INIT,
            "max_dd":0.0,"odds_w":[],"odds_l":[],"consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0}
        for m in sub:
            if m["lay_a"]<=1: continue
            r2["n"]+=1; won=m["winner"]!="A"; p=pnl_lay(won,m["lay_a"])
            r2["pnl"]+=p; r2["w"]+=won; r2["l"]+=1-won
        if r2["n"]<5: continue
        wr=r2["w"]/r2["n"]*100; roi=r2["pnl"]/(r2["n"]*MISE)*100
        print(f"  Cote {lo:.1f}-{hi:.1f}: {r2['n']:>6} matchs, W:{r2['w']:>4} L:{r2['l']:>4} "
              f"WR {wr:>5.1f}% ROI {roi:>+7.2f}% PnL {r2['pnl']:>+7.0f}")
        if roi>best["roi"] and r2["n"]>=50:
            best={"type":"odds","lo":lo,"hi":hi,"roi":roi,"n":r2["n"],"pnl":r2["pnl"]}

    # 3. ANALYSE DETAILLEE de la meilleure fenetre
    print(f"\n[3/3] Analyse detaillee de la meilleure fenetre")
    if best["roi"]!=-999:
        if best.get("type")=="odds":
            lo,hi=best["lo"],best["hi"]
            sub=[m for m in matches if lo<=m["lay_a"]<hi]
            print(f"\nFenetre optimale: cote Lay {lo:.1f}-{hi:.1f} (ROI {best['roi']:+.2f}%, "
                  f"{best['n']} matchs)")
        else:
            lo, hi = best["lo"], best["hi"]
            sub=[m for m in matches if lo/100<=m["prob_a"]<hi/100]
            print(f"\nFenetre optimale: proba ext. {lo}%-{hi}% (ROI {best['roi']:+.2f}%, "
                  f"{best['n']} matchs)")

        # Analyser plus finement
        print(f"\nAnalyse par tranche de proba (fenetre elargie):")
        cut = [10,15,20,25,30,35,40,45,50]
        for lo_p, hi_p in zip(cut, cut[1:]):
            r=run_lay_away(sub, prob_min=lo_p/100, prob_max=hi_p/100)
            if r["n"]<5: continue
            wr=r["w"]/r["n"]*100; roi=r["pnl"]/(r["n"]*MISE)*100
            print(f"  Proba {lo_p:3d}-{hi_p:2d}%: {r['n']:>5} matchs, {r['w']:>4}W/{r['l']:<4}L "
                  f"WR {wr:>5.1f}% ROI {roi:>+7.2f}% PnL {r['pnl']:>+7.0f}")

        # ANALYSE PAR SAISON
        print(f"\nPar saison (fenetre optimale):")
        seasons=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
        for m in sub:
            y=m["date"].year; s=f"{y-1}-{y}" if m["date"].month<7 else f"{y}-{y+1}"
            if m["lay_a"]<=1: continue
            seasons[s]["n"]+=1; won=m["winner"]!="A"; p=pnl_lay(won,m["lay_a"])
            seasons[s]["pnl"]+=p; seasons[s]["w"]+=won
        print(f"{'Saison':<12} {'N':>5} {'W':>4} {'L':>4} {'WR':>7} {'ROI':>8} {'PnL':>8}")
        print("-"*55)
        for s in sorted(seasons.keys()):
            S=seasons[s]; n=S["n"]; w=S["w"]; l=n-w; wr=w/n*100; roi=S["pnl"]/(n*MISE)*100
            print(f"{s:<12} {n:>5} {w:>4} {l:>4} {wr:>6.2f}% {roi:>+7.2f}% {S['pnl']:>+7.0f}")

        # ANALYSE PAR LIGUE
        print(f"\nPar ligue (fenetre optimale):")
        leagues=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
        for m in sub:
            if m["lay_a"]<=1: continue
            leagues[m["league"]]["n"]+=1; won=m["winner"]!="A"; p=pnl_lay(won,m["lay_a"])
            leagues[m["league"]]["pnl"]+=p; leagues[m["league"]]["w"]+=won
        for league in sorted(leagues.keys(), key=lambda x:-leagues[x]["n"]):
            L=leagues[league]; n=L["n"]; w=L["w"]; l=n-w; wr=w/n*100; roi=L["pnl"]/(n*MISE)*100
            if n>=20:
                print(f"  {league:<22} {n:>5} {w:>4} {l:>4} {wr:>6.2f}% {roi:>+7.2f}% {L['pnl']:>+7.0f}")

        # ANALYSE PAR MOIS
        print(f"\nPar mois (fenetre optimale):")
        months=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
        for m in sub:
            if m["lay_a"]<=1: continue
            months[m["date"].month]["n"]+=1; won=m["winner"]!="A"; p=pnl_lay(won,m["lay_a"])
            months[m["date"].month]["pnl"]+=p; months[m["date"].month]["w"]+=won
        for m in sorted(months.keys()):
            M=months[m]; n=M["n"]; w=M["w"]; l=n-w; wr=w/n*100; roi=M["pnl"]/(n*MISE)*100
            if n>=10:
                print(f"  Mois {m:02d}: {n:>5} matchs, {w:>4}W/{l:<4}L {wr:>5.1f}% ROI {roi:>+7.2f}% PnL {M['pnl']:>+7.0f}")

        # ESPERANCE REELLE / SIGNAL STATISTIQUE
        n=best["n"]; pnl=best["pnl"]
        z_score=pnl/(n*MISE)*100/ (100/n**0.5) if n>0 else 0
        print(f"\n--- SIGNAL STATISTIQUE ---")
        print(f"  Matchs: {best['n']}")
        print(f"  ROI: {best['roi']:+.2f}%")
        print(f"  Z-score approx: {z_score:.2f} (significatif si >2)")
        if z_score>2: print(f"  ✅ Signal statistiquement significatif")
        else: print(f"  ⚠️  Signal NON significatif (bruit possible)")
        print(f"  Commission Betfair: {COMMISSION*100:.0f}%")

    # 4. COMPARAISON OUVRANTES vs CLOTURE (biais check)
    print(f"\n{'='*70}")
    print(f"  VERIFICATION: Ouverture vs Cloture")
    print(f"{'='*70}")
    print(f"  Chargement cotes clôture Betfair (BFCH/BFCD/BFCA)...")
    matches_c=load_matches(use_opening=False)
    compute_probas(matches_c)
    print(f"  Total: {len(matches_c)} matchs")

    print(f"\n  Comparaison (meme fenetre, toutes probas):")
    r_open=run_lay_away(matches)
    r_close=run_lay_away(matches_c)
    print(f"  {'Source':<12} {'N':>6} {'W':>5} {'L':>5} {'ROI':>8}")
    print(f"  {'Ouverture':<12} {r_open['n']:>6} {r_open['w']:>5} {r_open['l']:>5} "
          f"{r_open['pnl']/(r_open['n']*MISE)*100 if r_open['n'] else 0:>+7.2f}%")
    print(f"  {'Cloture':<12} {r_close['n']:>6} {r_close['w']:>5} {r_close['l']:>4} "
          f"{r_close['pnl']/(r_close['n']*MISE)*100 if r_close['n'] else 0:>+7.2f}%")

if __name__=="__main__":
    main()
