#!/usr/bin/env python3
"""
Backtest Over/Under 2.5 buts sur les 22 ligues europeennes (mmz4281).
Teste: Over favori, Under favori, combos Over, combos Under.
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT = 1000.0
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

def load_all():
    matches=[]
    for code in MMZ_CODES:
        for s in SEASONS:
            rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
            if not rows or len(rows)<2: continue
            h=rows[0]; idx={c:i for i,c in enumerate(h)}
            # Verifier qu'on a O/U et resultats
            if "Avg>2.5" not in idx or "FTHG" not in idx or "FTAG" not in idx: continue
            for r in rows[1:]:
                try:
                    dt=parse_mmz(r[idx["Date"]])
                    if dt is None: continue
                    hg,ag=int(r[idx["FTHG"]]),int(r[idx["FTAG"]])
                    total_goals=hg+ag
                    over=total_goals>2.5
                    for col in ["Avg>2.5","P>2.5","B365>2.5"]:
                        if col in idx:
                            try:
                                o=float(r[idx[col]])
                                if o>0:
                                    ucol=col.replace(">2.5","<2.5")
                                    if ucol in idx:
                                        u=float(r[idx[ucol]])
                                    else:
                                        u=1.0/(1.0-1.0/o) if o>1 else 1
                                    matches.append({"date":dt,"home":r[idx["HomeTeam"]].strip(),
                                        "away":r[idx["AwayTeam"]].strip(),"hg":hg,"ag":ag,
                                        "total":total_goals,"over":over,"odds_over":o,"odds_under":u,
                                        "league":code})
                                    break
                            except: pass
                except: pass
        sys.stdout.write("."); sys.stdout.flush()
    print(f"\n{len(matches)} matchs charges")
    return matches

def backtest_simple(matches, pick="over", min_odds=1.0, max_odds=99.0, mise=10.0):
    """Backtest le plus simple: parier Over ou Under selon les filtres."""
    matches.sort(key=lambda x:x["date"])
    engine={"bets":0,"wins":0,"losses":0,"profit":0.0,"peak":BANKROLL_INIT,"max_dd":0.0,
            "odds_won":[],"odds_lost":[],"bankroll":BANKROLL_INIT,"log":[],
            "consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0}

    for m in matches:
        odds=m["odds_over"] if pick=="over" else m["odds_under"]
        if odds<min_odds or odds>max_odds: continue

        won=m["over"] if pick=="over" else not m["over"]
        profit=mise*(odds-1) if won else -mise
        engine["bankroll"]+=profit
        engine["profit"]+=profit
        engine["bets"]+=1
        if won:
            engine["wins"]+=1
            engine["odds_won"].append(odds)
            engine["consec_w"]+=1; engine["consec_l"]=0
            if engine["consec_w"]>engine["max_ws"]: engine["max_ws"]=engine["consec_w"]
        else:
            engine["losses"]+=1
            engine["odds_lost"].append(odds)
            engine["consec_l"]+=1; engine["consec_w"]=0
            if engine["consec_l"]>engine["max_ls"]: engine["max_ls"]=engine["consec_l"]
        if engine["bankroll"]>engine["peak"]: engine["peak"]=engine["bankroll"]
        dd=(engine["peak"]-engine["bankroll"])/engine["peak"]*100
        if dd>engine["max_dd"]: engine["max_dd"]=dd

    return engine

def run_variants(matches):
    variants = []

    for pick_name, pick, label in [("Over 2.5","over","O"),("Under 2.5","under","U")]:
        # Simple: toutes cotes
        r=backtest_simple(matches,pick=pick)
        variants.append((f"{label} - Toutes cotes",r,pick,None,None))

        # Cote favorite Over (1.4-1.8): la plus "sure"
        for lo,hi,pct in [(1.3,1.7,"1.3-1.7"),(1.5,2.0,"1.5-2.0"),(1.7,2.5,"1.7-2.5")]:
            r=backtest_simple(matches,pick=pick,min_odds=lo,max_odds=hi)
            variants.append((f"{label} cote {pct}",r,pick,lo,hi))

        # Combines 3 matchs
        by_date=defaultdict(list)
        for m in matches:
            odds=m["odds_over"] if pick=="over" else m["odds_under"]
            if odds<1.3 or odds>2.5: continue
            by_date[m["date"]].append(m)

        combi_data=[]
        for date in sorted(by_date.keys()):
            dm=by_date[date]
            eligible=[]
            for m in dm:
                odds=m["odds_over"] if pick=="over" else m["odds_under"]
                if 1.3<=odds<=1.8: eligible.append(m)
            if len(eligible)<3: continue
            eligible.sort(key=lambda x: x["odds_over"] if pick=="over" else x["odds_under"])
            for j in range(0,len(eligible),3):
                group=eligible[j:j+3]
                if len(group)<3: break
                cote_combi=1.0
                won=True
                for m in group:
                    cote_combi*=(m["odds_over"] if pick=="over" else m["odds_under"])
                    if pick=="over" and not m["over"]: won=False
                    if pick=="under" and m["over"]: won=False
                profit=10*(cote_combi-1) if won else -10
                combi_data.append({"won":won,"cote":cote_combi,"profit":profit})

        n=len(combi_data); w=sum(1 for c in combi_data if c["won"]); l=n-w
        profit=sum(c["profit"] for c in combi_data)
        variants.append((f"{label} Combi3 1.3-1.8",{"combos":n,"wins":w,"losses":l,"profit":profit},pick,None,None))

        # Combines 2 matchs
        combi2=[]
        for date in sorted(by_date.keys()):
            dm=by_date[date]
            eligible=[]
            for m in dm:
                odds=m["odds_over"] if pick=="over" else m["odds_under"]
                if 1.3<=odds<=2.0: eligible.append(m)
            if len(eligible)<2: continue
            eligible.sort(key=lambda x: x["odds_over"] if pick=="over" else x["odds_under"])
            for j in range(0,len(eligible),2):
                group=eligible[j:j+2]
                if len(group)<2: break
                cote_combi=1.0
                won=True
                for m in group:
                    cote_combi*=(m["odds_over"] if pick=="over" else m["odds_under"])
                    if pick=="over" and not m["over"]: won=False
                    if pick=="under" and m["over"]: won=False
                profit=10*(cote_combi-1) if won else -10
                combi2.append({"won":won,"cote":cote_combi,"profit":profit})

        n2=len(combi2); w2=sum(1 for c in combi2 if c["won"]); l2=n2-w2
        profit2=sum(c["profit"] for c in combi2)
        variants.append((f"{label} Combi2 1.3-2.0",{"combos":n2,"wins":w2,"losses":l2,"profit":profit2},pick,None,None))

    return variants

def print_variant(name, r):
    n=r.get("combos",r.get("bets",0))
    w=r.get("wins",0)
    l=r.get("losses",0)
    profit=r.get("profit",0)
    wr=w/n*100 if n else 0
    mt=n*10
    roi=profit/mt*100 if mt else 0
    dd=r.get("max_dd",0)
    aw=sum(r.get("odds_won",[]))/len(r.get("odds_won",[1])) if r.get("odds_won") else 0
    al=sum(r.get("odds_lost",[]))/len(r.get("odds_lost",[1])) if r.get("odds_lost") else 0
    print(f"  {name:<35} {n:>6} {w:>5}/{l:<5} {wr:>5.1f}% {profit:>+7.0f} "
          f"{roi:>+6.1f}% {dd:>5.1f}%")

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("="*70)
    print("  BACKTEST OVER/UNDER 2.5 — 22 ligues europeennes")
    print("="*70)

    matches=load_all()
    print(f"\nMatchs avec cotes O/U: {len(matches)}")

    # Stats globales O/U
    over_pct=sum(1 for m in matches if m["over"])/len(matches)*100
    print(f"\nStats brutes O/U sur {len(matches)} matchs:")
    print(f"  Over 2.5: {over_pct:.1f}% | Under 2.5: {100-over_pct:.1f}%")
    print(f"  Cote Over moyenne: {sum(m['odds_over'] for m in matches)/len(matches):.3f}")
    print(f"  Cote Under moyenne: {sum(m['odds_under'] for m in matches)/len(matches):.3f}")

    # Analyser par tranche de cotes
    print(f"\nAnalyse par tranche de cotes Over:")
    for lo,hi in [(1.0,1.3),(1.3,1.5),(1.5,1.7),(1.7,2.0),(2.0,2.5),(2.5,5.0),(5.0,99)]:
        sub=[m for m in matches if lo<=m["odds_over"]<hi]
        if not sub: continue
        wr=sum(1 for m in sub if m["over"])/len(sub)*100
        avg_o=sum(m["odds_over"] for m in sub)/len(sub)
        roi=wr/100*avg_o-1
        print(f"  Cote {lo:.1f}-{hi:.1f}: {len(sub):>6} matchs, WR {wr:.1f}%, "
              f"cote moy {avg_o:.3f}, ROI {roi:+.2%}")

    print(f"\nAnalyse par tranche de cotes Under:")
    for lo,hi in [(1.0,1.3),(1.3,1.5),(1.5,1.7),(1.7,2.0),(2.0,2.5),(2.5,5.0),(5.0,99)]:
        sub=[m for m in matches if lo<=m["odds_under"]<hi]
        if not sub: continue
        wr=sum(1 for m in sub if not m["over"])/len(sub)*100
        avg_u=sum(m["odds_under"] for m in sub)/len(sub)
        roi=wr/100*avg_u-1
        print(f"  Cote {lo:.1f}-{hi:.1f}: {len(sub):>6} matchs, WR {wr:.1f}%, "
              f"cote moy {avg_u:.3f}, ROI {roi:+.2%}")

    # Backtests
    print(f"\n{'='*70}")
    print(f"  BACKTEST VARIANTS")
    print(f"{'='*70}")
    print(f"{'Variant':<35} {'Paris':>6} {'W/L':>11} {'WR':>6} {'Profit':>8} {'ROI':>7} {'DD':>6}")
    print("-"*70)

    variants=run_variants(matches)
    for name,r,pick,lo,hi in variants:
        print_variant(name,r)

    # Best performers
    print(f"\n{'='*70}")
    print(f"  TOP RESULTATS")
    print(f"{'='*70}")
    top=sorted(variants, key=lambda x: -x[1].get("profit",0))
    for name,r,pick,lo,hi in top[:5]:
        print_variant(name,r)

if __name__=="__main__":
    main()
