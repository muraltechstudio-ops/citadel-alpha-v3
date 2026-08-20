#!/usr/bin/env python3
"""
Variantes du backtest combine foot
Variant 1: combine 2 matchs
Variant 5: score >= 9/10
Variant 6: mise Kelly (full Kelly)
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT = 1000.0
COTE_MIN = 1.25
COTE_MAX = 1.40
PERIODE_FORME = 5
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
NEW_CODES = {
    "ARG":"Argentina","AUT":"Autriche","BRA":"Bresil","CHN":"Chine",
    "DNK":"Danemark","FIN":"Finlande","IRL":"Irlande","JPN":"Japon",
    "MEX":"Mexique","NOR":"Norvege","POL":"Pologne","ROU":"Roumanie",
    "RUS":"Russie","SWE":"Suede","SWZ":"Suisse","USA":"USA",
}
NEW_LEAGUE_NAMES = {
    "ARG":"Liga Profesional","AUT":"Bundesliga","BRA":"Serie A","CHN":"Super League",
    "DNK":"Superliga","FIN":"Veikkausliiga","IRL":"Premier Division","JPN":"J1 League",
    "MEX":"Liga MX","NOR":"Eliteserien","POL":"Ekstraklasa","ROU":"Superliga",
    "RUS":"Premier League","SWE":"Allsvenskan","SWZ":"Super League","USA":"MLS",
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

def parse_new(s):
    if not s: return None
    try:
        if "-" in s:
            parts=s.split("-")
            return datetime(int(parts[0]),int(parts[1]),int(parts[2]))
        p=s.split("/")
        return datetime(int(p[2]),int(p[1]),int(p[0]))
    except: return None

def load_all():
    matches=[]
    sys.stdout.write("Chargement...\n")
    for code in MMZ_CODES:
        for s in SEASONS:
            rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
            if not rows or len(rows)<2: continue
            h=rows[0]; idx={c:i for i,c in enumerate(h)}
            for r in rows[1:]:
                try:
                    dt=parse_mmz(r[idx["Date"]])
                    if dt is None: continue
                    for col in ["AvgH","PSH","B365H"]:
                        if col in idx:
                            try:
                                o=float(r[idx[col]])
                                if o>0:
                                    matches.append({"date":dt,"home":r[idx["HomeTeam"]].strip(),
                                        "away":r[idx["AwayTeam"]].strip(),"hg":int(r[idx["FTHG"]]),
                                        "ag":int(r[idx["FTAG"]]),"odds":o})
                                    break
                            except: pass
                except: pass
        sys.stdout.write(f".")
        sys.stdout.flush()

    for code in NEW_CODES:
        rows=fetch_csv(f"https://www.football-data.co.uk/new/{code}.csv")
        if not rows or len(rows)<2:
            sys.stdout.write("x"); sys.stdout.flush()
            continue
        h=rows[0]; idx={c:i for i,c in enumerate(h)}
        target=NEW_LEAGUE_NAMES[code]
        has_league="League" in idx
        for r in rows[1:]:
            try:
                if has_league and r[idx["League"]].strip()!=target: continue
                seas=r[idx["Season"]].strip()
                try:
                    if int(seas[:4])<2020: continue
                except: pass
                dt=parse_new(r[idx["Date"]].strip())
                if dt is None: continue
                for col in ["AvgCH","B365CH","PSCH"]:
                    if col in idx:
                        try:
                            o=float(r[idx[col]])
                            if o>0:
                                matches.append({"date":dt,"home":r[idx["Home"]].strip(),
                                    "away":r[idx["Away"]].strip(),"hg":int(r[idx["HG"]]),
                                    "ag":int(r[idx["AG"]]),"odds":o})
                                break
                        except: pass
            except: pass
        sys.stdout.write(".")
        sys.stdout.flush()

    print(f"\n{len(matches)} matchs charges")
    return matches

def build_stats(matches,date_limit):
    stats=defaultdict(lambda:{"pts":0,"wins":[],"played":0})
    for m in matches:
        if m["date"]>=date_limit: continue
        h,a=m["home"],m["away"]
        stats[h]["played"]+=1; stats[a]["played"]+=1
        if m["hg"]>m["ag"]:
            stats[h]["pts"]+=3;stats[h]["wins"].append(1);stats[a]["wins"].append(0)
        elif m["ag"]>m["hg"]:
            stats[a]["pts"]+=3;stats[a]["wins"].append(1);stats[h]["wins"].append(0)
        else:
            stats[h]["pts"]+=1;stats[a]["pts"]+=1
            stats[h]["wins"].append(0);stats[a]["wins"].append(0)
    return stats

def get_rank(stats,team):
    for r,(t,_) in enumerate(sorted(stats.items(),key=lambda x:-x[1]["pts"]),1):
        if t==team: return r
    return len(stats)

def score_match(m,stats):
    """Score complet /10 avec tous les critères de la stratégie."""
    s=2  # 1. Domicile +2

    total=len(stats)
    home_team=m["home"]
    away_team=m["away"]

    # 2. Top 3 du championnat (+2)
    r_home=get_rank(stats,home_team)
    if total>0 and r_home<=3: s+=2

    # 3. Adversaire dans la moitié basse (+2 si bottom 50%, +1 si 35-50%)
    if total>0:
        r_away=get_rank(stats,away_team)
        if r_away>total*0.5: s+=2
        elif r_away>total*0.35: s+=1

    # 4. Forme récente 80%+ (+2) ou 60%+ (+1)
    hf=stats[home_team]["wins"][-PERIODE_FORME:]
    if hf:
        wp=sum(hf)/len(hf)*100
        if wp>=80: s+=2
        elif wp>=60: s+=1

    # 5. Écart de points > 10 entre les deux équipes (+1)
    home_pts=stats[home_team]["pts"]
    away_pts=stats[away_team]["pts"]
    # Normaliser par le nombre de matchs joués pour être juste
    home_gp=max(1,stats[home_team]["played"])
    away_gp=max(1,stats[away_team]["played"])
    home_ppg=home_pts/home_gp
    away_ppg=away_pts/away_gp
    if home_ppg-away_ppg>0.5: s+=1  # ~0.5 pt/match d'écart = >10 pts sur 20 matchs

    # 6. Forme adverse - pénalité (-1 si l'adversaire a du momentum)
    af=stats[away_team]["wins"][-PERIODE_FORME:]
    if af and sum(af)/len(af)*100>=60: s-=1

    # 7. Cote dans la fourchette (+1)
    if COTE_MIN<=m["odds"]<=COTE_MAX: s+=1

    return s

def eligible(m,stats,min_score=0):
    if m["odds"]<COTE_MIN or m["odds"]>COTE_MAX: return False,0
    if stats[m["home"]]["played"]<PERIODE_FORME: return False,0
    if stats[m["away"]]["played"]<PERIODE_FORME: return False,0
    sc=score_match(m,stats)
    if sc<min_score: return False,sc
    return True,sc

def run_variant(all_matches, name, taille_combi=3, min_score=0, use_kelly=False):
    all_matches.sort(key=lambda x:x["date"])
    by_date=defaultdict(list)
    for m in all_matches: by_date[m["date"]].append(m)

    engine={"combos":0,"wins":0,"losses":0,"profit":0.0,
            "peak":BANKROLL_INIT,"max_dd":0.0,
            "odds_won":[],"odds_lost":[],
            "consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0,
            "bankroll":BANKROLL_INIT,"log":[]}

    sorted_dates=sorted(by_date.keys())
    for date in sorted_dates:
        day_m=by_date[date]
        stats=build_stats(all_matches,date)

        cand=[]
        for m in day_m:
            ok,sc=eligible(m,stats,min_score)
            if ok: cand.append((m,sc))

        if len(cand)<taille_combi: continue
        cand.sort(key=lambda x:-x[1])
        best=cand[:taille_combi]

        combi_odds=1.0
        for m,_ in best: combi_odds*=m["odds"]

        won=all(m["hg"]>m["ag"] for m,_ in best)
        wc=sum(1 for m,_ in best if m["hg"]>m["ag"])

        # Kelly mise
        if use_kelly and engine["bankroll"]>0:
            p_implied=1.0/combi_odds
            # Estimer la probabilite reelle = 63% (moyenne observee des favoris ~1.3)
            p_real=0.63**taille_combi
            b=combi_odds-1
            kelly_pct=p_real - (1-p_real)/b if b>0 else 0
            # Kelly fractionne (25%) pour eviter le sur-pari
            kelly_pct=max(0,min(kelly_pct*0.25, 0.05))
            mise=engine["bankroll"]*kelly_pct
            if mise<1: mise=0  # Skip bets < 1 unit
        else:
            mise=10.0

        if mise<=0: continue

        if won:
            profit=mise*(combi_odds-1)
            engine["bankroll"]+=profit
            engine["profit"]+=profit
            engine["wins"]+=1
            engine["odds_won"].append(combi_odds)
            engine["consec_w"]+=1; engine["consec_l"]=0
            if engine["consec_w"]>engine["max_ws"]: engine["max_ws"]=engine["consec_w"]
        else:
            profit=-mise
            engine["bankroll"]+=profit
            engine["profit"]+=profit
            engine["losses"]+=1
            engine["odds_lost"].append(combi_odds)
            engine["consec_l"]+=1; engine["consec_w"]=0
            if engine["consec_l"]>engine["max_ls"]: engine["max_ls"]=engine["consec_l"]

        engine["combos"]+=1
        if engine["bankroll"]>engine["peak"]: engine["peak"]=engine["bankroll"]
        dd=(engine["peak"]-engine["bankroll"])/engine["peak"]*100
        if dd>engine["max_dd"]: engine["max_dd"]=dd

        engine["log"].append({
            "date":date.strftime("%Y-%m-%d"),"status":"W" if won else "L",
            "odds":round(combi_odds,3),"profit":round(profit,0),
            "bank":round(engine["bankroll"],0),"mise":round(mise,0),
            "w":wc,"l":taille_combi-wc,
        })

    n=engine["combos"]
    w=engine["wins"]
    l=n-w
    wr=w/n*100 if n else 0
    mt=n*10 if not use_kelly else sum(abs(e["mise"]) for e in engine["log"])
    roi=engine["profit"]/mt*100 if mt else 0
    aw=sum(engine["odds_won"])/len(engine["odds_won"]) if engine["odds_won"] else 0
    al=sum(engine["odds_lost"])/len(engine["odds_lost"]) if engine["odds_lost"] else 0

    # Esperance reellement calculee
    if wr>0 and aw>0:
        esperance = (wr/100)*(aw-1) - ((1-wr/100))*1
    else:
        esperance = 0

    return {"name":name,"n":n,"w":w,"l":l,"wr":wr,"profit":engine["profit"],
            "roi":roi,"dd":engine["max_dd"],"aw":aw,"al":al,
            "max_ws":engine["max_ws"],"max_ls":engine["max_ls"],
            "bank_finale":round(engine["bankroll"],0),
            "esperance":esperance,"log":engine["log"],
            "config":f"{'combi2' if taille_combi==2 else 'combi3'}, "
                     f"{'score'+str(min_score) if min_score>0 else 'all'}, "
                     f"{'kelly' if use_kelly else 'fixe10'}"}

def print_variant(r):
    pnl=r["profit"]
    print(f"\n--- {r['name']} ---")
    print(f"  {pnl:+.0f} | {r['n']} combos ({r['w']}W/{r['l']}L) | "
          f"WR {r['wr']:.1f}% | ROI {r['roi']:+.1f}%")
    print(f"  Bank: 1000 -> {r['bank_finale']} | DD max {r['dd']:.1f}%")
    print(f"  Cote moy W/L: {r['aw']:.3f}/{r['al']:.3f} | "
          f"Serie max: {r['max_ws']}W/{r['max_ls']}L")
    print(f"  Esperance: {r['esperance']:+.4f} "
          f"{'(gagnant)' if r['esperance']>0 else '(perdant)'}")

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("="*60)
    print("BACKTEST VARIANTS: combi2, score9, kelly")
    print("="*60)

    all_matches=load_all()
    if not all_matches:
        print("Aucune donnee chargee.")
        return

    print(f"\nExecution des 3 variantes...\n")

    # Variant 1: combine 2 matchs
    print(">> V1: Combiné 2 matchs (score >= 7/10)")
    v1=run_variant(all_matches, "Combi 2 matchs", taille_combi=2, min_score=7)
    print_variant(v1)

    # Variant 5: score >= 9/10
    print("\n>> V5: Combiné 3 matchs, score >= 9/10")
    v5=run_variant(all_matches, "Score >= 9/10", taille_combi=3, min_score=9)
    print_variant(v5)

    # Variant 6: mise Kelly
    print("\n>> V6: Combiné 3 matchs, mise Kelly 25%")
    v6=run_variant(all_matches, "Kelly mise", taille_combi=3, min_score=7, use_kelly=True)
    print_variant(v6)

    # TABLEAU COMPARATIF
    print("\n"+"="*60)
    print("TABLEAU COMPARATIF")
    print("="*60)
    hdr=f"{'Variant':<25} {'Combos':>8} {'WR':>7} {'Profit':>8} {'ROI':>7} {'DD':>7} {'Bank':>7}"
    print(hdr)
    print("-"*60)

    variants=[v1,v5,v6]
    for v in sorted(variants, key=lambda x:-x["profit"]):
        print(f"{v['name']:<25} {v['n']:>8} {v['wr']:>6.1f}% {v['profit']:>+7.0f} "
              f"{v['roi']:>+6.1f}% {v['dd']:>6.1f}% {v['bank_finale']:>7}")

    print("\n"+"="*60)
    print("RECOMMENDATION")
    print("="*60)
    best=sorted(variants, key=lambda x:-x["esperance"])
    for i,v in enumerate(best):
        print(f"  #{i+1}: {v['name']} (esperance {v['esperance']:+.4f}, "
              f"profit {v['profit']:+.0f}, {v['n']} combos)")

if __name__=="__main__":
    main()
