#!/usr/bin/env python3
"""
Backtest LAY (contre les favoris) via Betfair Exchange.
Stratégie: Lay du favori (1 / contre sa victoire).
Les cotes Lay sont derivees des cotes Back Betfair Exchange (BFH/D/A).
22 ligues europeennes, 2020-2026.
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT = 1000.0
MISE = 10.0
COMMISSION = 0.05  # 5% Betfair
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
    try:
        d,m,y=int(p[0]),int(p[1]),int(p[2])
        if y<100: y+=2000
        return datetime(y,m,d)
    except: return None

def load_matches():
    """Charge tous les matchs avec les cotes Betfair Exchange clôture (BFCH/D/A)."""
    matches=[]
    for code in MMZ_CODES:
        for s in SEASONS:
            rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
            if not rows or len(rows)<2: continue
            h=rows[0]; idx={c:i for i,c in enumerate(h)}
            # Verifier presence BFCH, BFCD, BFCA
            if "BFCH" not in idx or "BFCD" not in idx or "BFCA" not in idx: continue
            for r in rows[1:]:
                try:
                    dt=parse_mmz(r[idx["Date"]])
                    if dt is None: continue
                    hg,ag=int(r[idx["FTHG"]]),int(r[idx["FTAG"]])
                    # Cotes Betfair Exchange clôture
                    try:
                        bf_h=float(r[idx["BFCH"]]); bf_d=float(r[idx["BFCD"]]); bf_a=float(r[idx["BFCA"]])
                    except: continue
                    if bf_h<=0 or bf_d<=0 or bf_a<=0: continue
                    matches.append({
                        "date":dt,"home":r[idx["HomeTeam"]].strip(),
                        "away":r[idx["AwayTeam"]].strip(),"hg":hg,"ag":ag,
                        "bf_h":bf_h,"bf_d":bf_d,"bf_a":bf_a,
                        "league":MMZ_CODES[code],"code":code,
                    })
                except: pass
        sys.stdout.write("."); sys.stdout.flush()
    print(f"\n{len(matches)} matchs")
    return matches

def compute_lay_odds(back_h, back_d, back_a):
    """
    Calcule la cote Lay équitable pour chaque issue.
    A partir des cotes Back Betfair, on calcule les probabilités implicites
    sans marge, puis on derive la cote Lay.

    Lay = 1 / (1 - prob_back_sans_marge)

    Chiffres clés:
    - Cote Back 1.30 → prob_back 76.9% → prob_sans_marge ~74% → cote Lay ~3.85
    - Cote Back 1.50 → prob_back 66.7% → prob_sans_marge ~64% → cote Lay ~2.78
    """
    total_implied = 1/back_h + 1/back_d + 1/back_a
    # Probabilités sans marge
    prob_h = (1/back_h) / total_implied
    prob_d = (1/back_d) / total_implied
    prob_a = (1/back_a) / total_implied
    # Cotes Lay (on peut Lay 1 - prob(sélection) au prix fair)
    lay_h = 1 / (1 - prob_h) if prob_h < 1 else 0
    lay_d = 1 / (1 - prob_d) if prob_d < 1 else 0
    lay_a = 1 / (1 - prob_a) if prob_a < 1 else 0
    return lay_h, lay_d, lay_a, prob_h, prob_d, prob_a

def compute_winner(hg, ag):
    """Determine le gagnant du match."""
    if hg > ag: return "H"
    elif ag > hg: return "A"
    else: return "D"

def pnl_lay(won, lay_odds, mise=MISE):
    """
    PnL d'un pari Lay:
    - Si l'issue ne se réalise PAS (on gagne): +mise (moins commission)
    - Si l'issue se réalise (on perd): -mise * (lay_odds - 1)
    """
    if won:
        # Notre Lay a gagné: l'issue ne s'est pas produite
        return mise * (1 - COMMISSION)  # On empoche la mise moins la commission
    else:
        # Notre Lay a perdu: l'issue s'est produite
        return -mise * (lay_odds - 1)

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("="*70)
    print("  BACKTEST LAY — Contre les favoris sur Betfair Exchange")
    print("  22 ligues europeennes | Cotes BFCH/BFCD/BFCA")
    print("  Commission: 5%")
    print("="*70)

    matches=load_matches()

    # Calculer les probabilités et cotes Lay pour chaque match
    for m in matches:
        m["lay_h"],m["lay_d"],m["lay_a"],m["prob_h"],m["prob_d"],m["prob_a"] = \
            compute_lay_odds(m["bf_h"],m["bf_d"],m["bf_a"])
        m["winner"]=compute_winner(m["hg"],m["ag"])

    n=len(matches)
    print(f"\nTotal matchs avec BF cotes: {n}")

    # Stats globales du marché Betfair
    avg_prob_h=sum(m["prob_h"] for m in matches)/n
    avg_prob_d=sum(m["prob_d"] for m in matches)/n
    avg_prob_a=sum(m["prob_a"] for m in matches)/n
    real_h=sum(1 for m in matches if m["winner"]=="H")/n
    real_d=sum(1 for m in matches if m["winner"]=="D")/n
    real_a=sum(1 for m in matches if m["winner"]=="A")/n

    print(f"\n=== MARCHE BETFAIR vs REALITE (n={n}) ===")
    print(f"{'Issue':<12} {'Prob. marche':>12} {'Realite':>10} {'Ecart':>8}")
    print("-"*45)
    print(f"{'Domicile':<12} {avg_prob_h:>11.1f}% {real_h*100:>9.1f}% {(avg_prob_h-real_h*100):>+7.1f}%")
    print(f"{'Nul':<12} {avg_prob_d:>11.1f}% {real_d*100:>9.1f}% {(avg_prob_d-real_d*100):>+7.1f}%")
    print(f"{'Exterieur':<12} {avg_prob_a:>11.1f}% {real_a*100:>9.1f}% {(avg_prob_a-real_a*100):>+7.1f}%")
    print(f"{'Total':<12} {(avg_prob_h+avg_prob_d+avg_prob_a):>11.1f}% {(real_h+real_d+real_a)*100:>9.1f}%")

    # Favorite-longshot bias: les favoris sont-ils surcotes ?
    print(f"\n=== FAVORITE-LONGSHOT BIAS ===")
    # Grouper par tranche de probabilité domicile
    for lo_pct, hi_pct in [(0,20),(20,30),(30,40),(40,50),(50,60),(60,70),(70,80),(80,100)]:
        sub=[m for m in matches if lo_pct<=m["prob_h"]*100<hi_pct]
        if not sub: continue
        prob_avg=sum(m["prob_h"] for m in sub)/len(sub)*100
        real=sum(1 for m in sub if m["winner"]=="H")/len(sub)*100
        diff=prob_avg-real
        print(f"  Prob {lo_pct:3.0f}-{hi_pct:3.0f}%: {len(sub):>6} matchs, "
              f"marche={prob_avg:>5.1f}%, reel={real:>5.1f}%, ecart={diff:>+5.1f}% "
              f"{'(sous-cote)' if diff>0 else '(surcote)'}")

    # ── STRATEGIES LAY ────────────────────────────────────────────────────
    strategies=[]

    # 1. LAY DOMICILE favori (prob_h > 50%, lay quand le favori ne gagne PAS)
    for label, prob_min, prob_max, odds_max in [
        ("Lay Domicile (prob>70%)", 0.70, 1.00, 99),
        ("Lay Domicile (prob 60-70%)", 0.60, 0.70, 99),
        ("Lay Domicile (prob 50-60%)", 0.50, 0.60, 99),
        ("Lay Domicile (tous)", 0, 1.00, 99),
        ("Lay Domicile prob>70% cote<2", 0.70, 1.00, 2.0),
        ("Lay Domicile prob 60-70% cote<2.5", 0.60, 0.70, 2.5),
    ]:
        r={"label":label,"n":0,"w":0,"l":0,"pnl":0.0,"bankroll":BANKROLL_INIT,"peak":BANKROLL_INIT,
           "max_dd":0.0,"odds_w":[],"odds_l":[],"consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0}
        for m in matches:
            if not (prob_min <= m["prob_h"] <= prob_max): continue
            if m["lay_h"] >= odds_max or m["lay_h"] <= 1: continue

            r["n"]+=1
            # Lay domicile: on gagne si le domicile NE gagne PAS (nul ou exterieur)
            won=m["winner"]!="H"
            p=pnl_lay(won, m["lay_h"])
            r["pnl"]+=p
            r["bankroll"]+=p
            if won:
                r["w"]+=1; r["odds_w"].append(m["lay_h"]); r["consec_w"]+=1; r["consec_l"]=0
                if r["consec_w"]>r["max_ws"]: r["max_ws"]=r["consec_w"]
            else:
                r["l"]+=1; r["odds_l"].append(m["lay_h"]); r["consec_l"]+=1; r["consec_w"]=0
                if r["consec_l"]>r["max_ls"]: r["max_ls"]=r["consec_l"]
            if r["bankroll"]>r["peak"]: r["peak"]=r["bankroll"]
            dd=(r["peak"]-r["bankroll"])/r["peak"]*100
            if dd>r["max_dd"]: r["max_dd"]=dd
        strategies.append(r)

    # 2. LAY EXTERIEUR (lay quand l'exterieur est favori ou co-favori)
    for label, prob_min, prob_max, odds_max in [
        ("Lay Exterieur (prob>40%)", 0.40, 1.00, 99),
        ("Lay Exterieur (prob 30-40%)", 0.30, 0.40, 99),
        ("Lay Exterieur (tous)", 0, 1.00, 99),
    ]:
        r={"label":label,"n":0,"w":0,"l":0,"pnl":0.0,"bankroll":BANKROLL_INIT,"peak":BANKROLL_INIT,
           "max_dd":0.0,"odds_w":[],"odds_l":[],"consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0}
        for m in matches:
            if not (prob_min <= m["prob_a"] <= prob_max): continue
            if m["lay_a"] >= odds_max or m["lay_a"] <= 1: continue

            r["n"]+=1
            won=m["winner"]!="A"
            p=pnl_lay(won, m["lay_a"])
            r["pnl"]+=p; r["bankroll"]+=p
            if won:
                r["w"]+=1; r["odds_w"].append(m["lay_a"]); r["consec_w"]+=1; r["consec_l"]=0
                if r["consec_w"]>r["max_ws"]: r["max_ws"]=r["consec_w"]
            else:
                r["l"]+=1; r["odds_l"].append(m["lay_a"]); r["consec_l"]+=1; r["consec_w"]=0
                if r["consec_l"]>r["max_ls"]: r["max_ls"]=r["consec_l"]
            if r["bankroll"]>r["peak"]: r["peak"]=r["bankroll"]
            dd=(r["peak"]-r["bankroll"])/r["peak"]*100
            if dd>r["max_dd"]: r["max_dd"]=dd
        strategies.append(r)

    # 3. LAY FAVORI ABSOLU (l'issue avec la proba la plus haute)
    r={"label":"Lay Favori Absolu","n":0,"w":0,"l":0,"pnl":0.0,"bankroll":BANKROLL_INIT,
       "peak":BANKROLL_INIT,"max_dd":0.0,"odds_w":[],"odds_l":[],"consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0}
    for m in matches:
        # Favori = issue avec la proba la plus haute
        probs=[(m["prob_h"],"H",m["lay_h"]),(m["prob_d"],"D",m["lay_d"]),(m["prob_a"],"A",m["lay_a"])]
        fav=max(probs, key=lambda x:x[0])
        if fav[2]<=1: continue
        r["n"]+=1
        won=m["winner"]!=fav[1]
        p=pnl_lay(won, fav[2])
        r["pnl"]+=p; r["bankroll"]+=p
        if won: r["w"]+=1; r["odds_w"].append(fav[2])
        else: r["l"]+=1; r["odds_l"].append(fav[2])
        if r["bankroll"]>r["peak"]: r["peak"]=r["bankroll"]
        dd=(r["peak"]-r["bankroll"])/r["peak"]*100
        if dd>r["max_dd"]: r["max_dd"]=dd
    strategies.append(r)

    # 4. LAY Domicile en fonction du ratio prob_h / prob_a
    r={"label":"Lay Domicile (prob_h > 2x prob_a)","n":0,"w":0,"l":0,"pnl":0.0,"bankroll":BANKROLL_INIT,
       "peak":BANKROLL_INIT,"max_dd":0.0,"odds_w":[],"odds_l":[],"consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0}
    for m in matches:
        if m["prob_h"] <= 2*m["prob_a"]: continue
        if m["lay_h"]<=1: continue
        r["n"]+=1
        won=m["winner"]!="H"
        p=pnl_lay(won,m["lay_h"])
        r["pnl"]+=p; r["bankroll"]+=p
        if won: r["w"]+=1; r["odds_w"].append(m["lay_h"])
        else: r["l"]+=1; r["odds_l"].append(m["lay_h"])
        if r["bankroll"]>r["peak"]: r["peak"]=r["bankroll"]
        dd=(r["peak"]-r["bankroll"])/r["peak"]*100
        if dd>r["max_dd"]: r["max_dd"]=dd
    strategies.append(r)

    # ── AFFICHAGE ─────────────────────────────────────────────────────────
    print(f"\n\n{'='*70}")
    print(f"  RESULTATS STRATEGIES LAY")
    print(f"{'='*70}")
    print(f"{'Strategie':<45} {'Paris':>6} {'W/L':>10} {'WR':>6} {'PnL':>8} {'ROI':>7} {'DD':>6}")
    print("-"*85)

    for s in strategies:
        n=s["n"]; w=s["w"]; l=n-w
        wr=w/n*100 if n else 0
        roi=s["pnl"]/(n*MISE)*100 if n else 0
        aw=sum(s["odds_w"])/len(s["odds_w"]) if s["odds_w"] else 0
        print(f"{s['label']:<45} {n:>6} {w:>4}/{l:<4} {wr:>5.1f}% {s['pnl']:>+7.0f} "
              f"{roi:>+6.1f}% {s['max_dd']:>5.1f}%")

    # ── ANALYSE PAR SAISON (meilleure strategie) ─────────────────────────
    print(f"\n{'='*70}")
    print(f"  ANALYSE SAISONNIERE — Lay Domicile (prob>70%)")
    print(f"{'='*70}")
    by_season=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
    for m in matches:
        if m["prob_h"]<0.70: continue
        if m["lay_h"]<=1: continue
        season=f"{m['date'].year-1}-{m['date'].year}" if m["date"].month<7 else f"{m['date'].year}-{m['date'].year+1}"
        S=by_season[season]
        S["n"]+=1
        won=m["winner"]!="H"
        p=pnl_lay(won,m["lay_h"])
        S["pnl"]+=p
        if won: S["w"]+=1
        else: S["l"]+=1

    print(f"{'Saison':<12} {'N':>5} {'W':>4} {'L':>4} {'WR':>6} {'ROI':>7} {'PnL':>7}")
    print("-"*50)
    for s in sorted(by_season.keys()):
        S=by_season[s]
        wr=S["w"]/S["n"]*100
        roi=S["pnl"]/(S["n"]*MISE)*100
        print(f"{s:<12} {S['n']:>5} {S['w']:>4} {S['l']:>4} {wr:>5.1f}% {roi:>+6.1f}% {S['pnl']:>+6.0f}")

    # ── PAR LIGUE ─────────────────────────────────────────────────────────
    print(f"\n{'='*70}")
    print(f"  ANALYSE PAR LIGUE — Lay Domicile (prob>70%)")
    print(f"{'='*70}")
    by_league=defaultdict(lambda:{"n":0,"w":0,"l":0,"pnl":0.0})
    for m in matches:
        if m["prob_h"]<0.70: continue
        if m["lay_h"]<=1: continue
        L=by_league[m["league"]]
        L["n"]+=1
        won=m["winner"]!="H"
        p=pnl_lay(won,m["lay_h"])
        L["pnl"]+=p
        if won: L["w"]+=1
        else: L["l"]+=1

    print(f"{'Ligue':<22} {'N':>5} {'W':>4} {'L':>4} {'WR':>6} {'ROI':>7} {'PnL':>7}")
    print("-"*55)
    for league in sorted(by_league.keys(), key=lambda x:-by_league[x]["n"]):
        L=by_league[league]
        wr=L["w"]/L["n"]*100
        roi=L["pnl"]/(L["n"]*MISE)*100
        print(f"{league:<22} {L['n']:>5} {L['w']:>4} {L['l']:>4} {wr:>5.1f}% {roi:>+6.1f}% {L['pnl']:>+6.0f}")

    # ── FAVORITE-LONGSHOT BIAS ANALYSIS ──────────────────────────────────
    print(f"\n{'='*70}")
    print(f"  FAVORITE-LONGSHOT BIAS — Lay vs Back")
    print(f"  (ROI theorique Back si on 'Backait' le favori a la place)")
    print(f"{'='*70}")
    print(f"{'Prob H':>8} {'N':>6} {'Back WR':>8} {'Back ROI':>9} {'Lay WR':>8} {'Lay ROI':>9}")
    print("-"*55)
    for lo,hi in [(0,20),(20,30),(30,40),(40,50),(50,55),(55,60),(60,65),(65,70),(70,75),(75,80),(80,85),(85,100)]:
        sub=[m for m in matches if lo<=m["prob_h"]*100<hi]
        if not sub: continue
        n=len(sub)
        back_wr=sum(1 for m in sub if m["winner"]=="H")/n*100
        back_profit=sum(MISE*(m["bf_h"]-1) if m["winner"]=="H" else -MISE for m in sub)
        back_roi=back_profit/(n*MISE)*100
        lay_w=sum(1 for m in sub if m["winner"]!="H")
        lay_pnl=sum(pnl_lay(m["winner"]!="H",m["lay_h"]) for m in sub)
        lay_roi=lay_pnl/(n*MISE)*100
        print(f"{lo:3d}-{hi:3d}%: {n:>6} {back_wr:>7.1f}% {back_roi:>+8.1f}% "
              f"{lay_w/n*100:>7.1f}% {lay_roi:>+8.1f}%")

    print(f"\n{'='*70}")
    print(f"  SYNTHESE")
    print(f"{'='*70}")
    best=sorted(strategies, key=lambda x:-x["pnl"]/(x["n"]*MISE)*100 if x["n"] else 0)
    if best:
        b=best[0]
        n=b["n"]; w=b["w"]; l=n-w
        roi=b["pnl"]/(n*MISE)*100 if n else 0
        print(f"  Meilleure: {b['label']}")
        print(f"  Paris: {n} (W:{w} L:{l})")
        print(f"  ROI: {roi:+.2f}%")
        print(f"  PnL: {b['pnl']:+.0f}EUR sur {n*MISE:.0f}EUR misés")
        print(f"  Drawdown max: {b['max_dd']:.1f}%")
        print(f"  Commission: {COMMISSION*100:.0f}%")

if __name__=="__main__":
    main()
