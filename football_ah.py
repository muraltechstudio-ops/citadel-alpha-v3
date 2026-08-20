#!/usr/bin/env python3
"""
Backtest Asian Handicap sur 22 ligues europeennes (mmz4281).
Teste les strategies: favori AH, outsider AH, par ligne de handicap.
"""

import csv, io, urllib.request, sys
from datetime import datetime
from collections import defaultdict

BANKROLL_INIT = 1000.0
MISE = 10.0
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

def compute_ah_result(home_goals, away_goals, ah_line):
    """
    Calcule le resultat d'un pari Asian Handicap.
    Un handicap quart (0.25, 0.75) divise la mise en 2 moities
    sur les deux demi-handicaps adjacents.

    Retourne: (home_result, away_result)
    Resultats: 1 = gagne, 0.5 = demi-gagne, 0 = rembourse,
              -0.5 = demi-perdu, -1 = perdu
    """
    try:
        line = float(ah_line)
    except:
        return None, None

    net = home_goals - away_goals
    adj = net + line

    # Handicap entier (ex: -1, 0, 1, -2)
    if line == int(line):
        if adj > 0: return (1, -1)
        elif adj < 0: return (-1, 1)
        else: return (0, 0)

    # Handicap demi (ex: -0.5, 1.5, -1.5)
    elif line % 1 == 0.5:
        if adj > 0: return (1, -1)
        else: return (-1, 1)

    # Handicap quart: la mise est divisee en 2
    else:
        base = int(line)
        frac = round(line - base, 2)
        adj_base = net + base

        if frac == 0.25:
            # Split: base (entier) et base+0.5 (demi)
            # Resultat = 50% de base + 50% de base+0.5
            # base: adj_base > 0 = W, adj_base == 0 = P, adj_base < 0 = L
            r1 = 1 if adj_base > 0 else (-1 if adj_base < 0 else 0)
            # base+0.5: adj_base+0.5 > 0 = W sinon L
            r2 = 1 if (adj_base + 0.5) > 0 else -1
            # Moyenne des 2
            result_h = (r1 + r2) / 2
            result_a = -result_h
            # Arrondir au quart le plus proche
            return (round(result_h * 4) / 4, round(result_a * 4) / 4)

        elif frac == -0.25:
            # Split: base (entier) et base-0.5 (demi)
            r1 = 1 if adj_base > 0 else (-1 if adj_base < 0 else 0)
            r2 = 1 if (adj_base - 0.5) > 0 else -1
            result_h = (r1 + r2) / 2
            result_a = -result_h
            return (round(result_h * 4) / 4, round(result_a * 4) / 4)

        elif frac == 0.75:
            # Split: base+0.5 (demi) et base+1.0 (entier)
            r1 = 1 if (adj_base + 0.5) > 0 else -1
            r2 = 1 if (adj_base + 1.0) > 0 else (-1 if (adj_base + 1.0) < 0 else 0)
            result_h = (r1 + r2) / 2
            result_a = -result_h
            return (round(result_h * 4) / 4, round(result_a * 4) / 4)

        elif frac == -0.75:
            # Split: base-0.5 (demi) et base-1.0 (entier)
            r1 = 1 if (adj_base - 0.5) > 0 else -1
            r2 = 1 if (adj_base - 1.0) > 0 else (-1 if (adj_base - 1.0) < 0 else 0)
            result_h = (r1 + r2) / 2
            result_a = -result_h
            return (round(result_h * 4) / 4, round(result_a * 4) / 4)

        else:
            return None, None

def compute_pnl(result, odds, mise=MISE):
    """
    Calcule le PnL pour un pari AH.
    result: 1=gagne, 0.5=demi-gagne, 0=rembourse, -0.5=demi-perdu, -1=perdu
    """
    if result == 1: return mise * (odds - 1)
    elif result == 0.5: return mise * (odds - 1) * 0.5
    elif result == 0: return 0
    elif result == -0.5: return -mise * 0.5
    elif result == -1: return -mise
    return -mise

def load_all():
    matches=[]
    for code in MMZ_CODES:
        for s in SEASONS:
            rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
            if not rows or len(rows)<2: continue
            h=rows[0]; idx={c:i for i,c in enumerate(h)}
            if "AHh" not in idx or "FTHG" not in idx: continue
            for r in rows[1:]:
                try:
                    dt=parse_mmz(r[idx["Date"]])
                    if dt is None: continue
                    ah_line=r[idx["AHh"]].strip()
                    if not ah_line: continue
                    hg,ag=int(r[idx["FTHG"]]),int(r[idx["FTAG"]])
                    # Prendre les cotes Pinnacle (Max) si dispo, sinon Bet365
                    if "MaxAHH" in idx:
                        try:
                            h_odds=float(r[idx["MaxAHH"]])
                            a_odds=float(r[idx["MaxAHA"]])
                        except:
                            continue
                    elif "B365AHH" in idx:
                        try:
                            h_odds=float(r[idx["B365AHH"]])
                            a_odds=float(r[idx["B365AHA"]])
                        except:
                            continue
                    else:
                        continue

                    h_res, a_res = compute_ah_result(hg, ag, ah_line)
                    if h_res is None: continue

                    matches.append({
                        "date":dt,"home":r[idx["HomeTeam"]].strip(),
                        "away":r[idx["AwayTeam"]].strip(),
                        "hg":hg,"ag":ag,
                        "ah_line":ah_line,"h_odds":h_odds,"a_odds":a_odds,
                        "h_res":h_res,"a_res":a_res,
                        "league":code,
                    })
                except: pass
        sys.stdout.write("."); sys.stdout.flush()
    print(f"\n{len(matches)} matchs charges")
    return matches

def print_stat(name, n, w, half_w, push, half_l, l, total_pnl):
    effective = w + half_w*0.5 + half_l*(-0.5) + l*(-1)
    wr = w/n*100 if n else 0
    roi = total_pnl/(n*MISE)*100 if n else 0
    print(f"  {name:<35} {n:>6} {w:>4}/{half_w:>4}/{push:>4}/{half_l:>4}/{l:<4} "
          f"WR {wr:>4.1f}% PnL {total_pnl:>+7.0f} ROI {roi:>+6.1f}%")

def analyze_by_ah_line(matches):
    """Analyse les resultats par ligne de handicap."""
    lines = defaultdict(lambda: {"n":0, "home_w":0, "home_hw":0, "home_p":0,
                                   "home_hl":0, "home_l":0, "home_pnl":0.0,
                                   "away_w":0, "away_hw":0, "away_p":0,
                                   "away_hl":0, "away_l":0, "away_pnl":0.0,
                                   "home_odds":[], "away_odds":[],
                                   "home_pct":0, "away_pct":0})

    for m in matches:
        # Arrondir la ligne AH pour le groupage
        try:
            rounded = round(float(m["ah_line"]) * 4) / 4  # quart le plus proche
            key = f"{rounded:+.2f}"
        except:
            key = m["ah_line"]

        L = lines[key]
        L["n"] += 1
        L["home_odds"].append(m["h_odds"])
        L["away_odds"].append(m["a_odds"])

        hr = m["h_res"]
        if hr == 1: L["home_w"]+=1
        elif hr == 0.5: L["home_hw"]+=1
        elif hr == 0: L["home_p"]+=1
        elif hr == -0.5: L["home_hl"]+=1
        elif hr == -1: L["home_l"]+=1
        L["home_pnl"] += compute_pnl(hr, m["h_odds"])

        ar = m["a_res"]
        if ar == 1: L["away_w"]+=1
        elif ar == 0.5: L["away_hw"]+=1
        elif ar == 0: L["away_p"]+=1
        elif ar == -0.5: L["away_hl"]+=1
        elif ar == -1: L["away_l"]+=1
        L["away_pnl"] += compute_pnl(ar, m["a_odds"])

        if m["h_res"] == 1: L["home_pct"]+=1

    print(f"\nAnalyse par ligne de handicap:")
    print(f"{'Ligne':>8} {'N':>6} {'Home ROI':>9} {'Away ROI':>9} {'Home WR':>8} {'Avg H Odds':>10}")
    print("-"*55)

    for key in sorted(lines.keys(), key=lambda x: float(x)):
        L = lines[key]
        home_roi = L["home_pnl"]/(L["n"]*MISE)*100 if L["n"] else 0
        away_roi = L["away_pnl"]/(L["n"]*MISE)*100 if L["n"] else 0
        home_wr = L["home_pct"]/L["n"]*100 if L["n"] else 0
        avg_h_odds = sum(L["home_odds"])/len(L["home_odds"]) if L["home_odds"] else 0
        print(f"{key:>8} {L['n']:>6} {home_roi:>+8.1f}% {away_roi:>+8.1f}% "
              f"{home_wr:>7.1f}% {avg_h_odds:>9.3f}")

def run_strategy(matches, name, pick="home", ah_range=None, odds_range=None):
    """
    pick: 'home' (parier sur le favori AH), 'away' (outsider),
          'home_heavy' (gros favori, ligne <= -1), 'away_light' (petit underdog, ligne > 0)
    """
    engine={"bets":0,"wins":0,"half_w":0,"push":0,"half_l":0,"losses":0,"pnl":0.0,
            "bankroll":BANKROLL_INIT,"peak":BANKROLL_INIT,"max_dd":0.0}

    for m in matches:
        try:
            line=float(m["ah_line"])
        except:
            continue

        if pick in ("home", "home_heavy", "general_home", "odds_home", "odds_home2", "DNB_home", "mod_home", "heavy_home", "home_18_20", "home_20_25"):
            bet_side="h"
            odds=m["h_odds"]
        elif pick in ("away", "away_light", "general_away", "odds_away", "DNB_away", "away_18_20"):
            bet_side="a"
            odds=m["a_odds"]
        if pick=="home_heavy" and line>-1: continue
        if pick=="away_light" and line<=0: continue
        if pick=="DNB_home" and (line<-0.1 or line>0.1): continue
        if pick=="DNB_away" and (line<-0.1 or line>0.1): continue
        if pick=="mod_home" and not (-1.0 < line < -0.1): continue
        if pick=="heavy_home" and (line>-1.5): continue

        # Filtre odds
        if odds_range:
            lo,hi=odds_range
            if odds<lo or odds>hi: continue

        # Filtre ligne AH
        if ah_range:
            lo,hi=ah_range
            if line<lo or line>hi: continue

        result=m[f"{bet_side}_res"]
        if result is None: continue
        pnl=compute_pnl(result, odds)

        engine["bets"]+=1
        engine["pnl"]+=pnl
        engine["bankroll"]+=pnl
        if result==1: engine["wins"]+=1
        elif result==0.5: engine["half_w"]+=1
        elif result==0: engine["push"]+=1
        elif result==-0.5: engine["half_l"]+=1
        elif result==-1: engine["losses"]+=1

        if engine["bankroll"]>engine["peak"]: engine["peak"]=engine["bankroll"]
        dd=(engine["peak"]-engine["bankroll"])/engine["peak"]*100
        if dd>engine["max_dd"]: engine["max_dd"]=dd

    return engine

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("="*70)
    print("  BACKTEST ASIAN HANDICAP — 22 ligues europeennes")
    print("  Avec calcul exact des resultats AH (quarts, demis, entiers)")
    print("="*70)

    matches=load_all()

    # Stats globales
    print(f"\nStats globales AH ({len(matches)} matchs):")
    total_w=sum(1 for m in matches if m["h_res"]==1)
    total_hw=sum(1 for m in matches if m["h_res"]==0.5 or m["h_res"]==-0.5)
    total_push=sum(1 for m in matches if m["h_res"]==0)
    total_home_pnl=sum(compute_pnl(m["h_res"],m["h_odds"]) for m in matches)
    total_away_pnl=sum(compute_pnl(m["a_res"],m["a_odds"]) for m in matches)

    print(f"  Domicile PnL: {total_home_pnl:+.0f} | Exterieur PnL: {total_away_pnl:+.0f}")
    print(f"  Cote AH domicile moyenne: {sum(m['h_odds'] for m in matches)/len(matches):.3f}")

    # Analyse par ligne de handicap
    analyze_by_ah_line(matches)

    # Strategies
    print(f"\n{'='*70}")
    print(f"  STRATEGIES AH")
    print(f"{'='*70}")
    print(f"{'Strategie':<40} {'Paris':>6} {'W/HW/P/HL/L':>18} {'ROI':>7} {'PnL':>8}")
    print("-"*70)

    strategies = [
        ("AH - Favori domicile", run_strategy(matches, "home_heavy", pick="home_heavy")),
        ("AH - Petit ext. (line>0)", run_strategy(matches, "away_light", pick="away_light")),
        ("AH - Favori general", run_strategy(matches, "general_home", pick="home")),
        ("AH - Outsider general", run_strategy(matches, "general_away", pick="away")),
        ("AH - Favori odds 1.5-2.5", run_strategy(matches, "odds_home", pick="home",
                                                    odds_range=(1.5, 2.5))),
        ("AH - Favori serre odds 1.7-2.2", run_strategy(matches, "odds_home2", pick="home",
                                                         odds_range=(1.7, 2.2))),
        ("AH - Outsider odds>3", run_strategy(matches, "odds_away", pick="away",
                                                odds_range=(3.0, 10.0))),
        ("AH - Ligne 0 (DNB)", run_strategy(matches, "DNB_home", pick="home",
                                              ah_range=(-0.1, 0.1))),
        ("AH - Ligne 0 away (DNB)", run_strategy(matches, "DNB_away", pick="away",
                                                   ah_range=(-0.1, 0.1))),
        ("AH - Favori modere -0.5/-1", run_strategy(matches, "mod_home", pick="home",
                                                      ah_range=(-1.0, -0.1))),
        ("AH - Favori lourd <= -1.5", run_strategy(matches, "heavy_home", pick="home",
                                                     ah_range=(-10.0, -1.5))),
        ("AH - Home odds 1.8-2.0 serre", run_strategy(matches, "home_18_20", pick="home",
                                                        odds_range=(1.8, 2.0))),
        ("AH - Home odds 2.0-2.5", run_strategy(matches, "home_20_25", pick="home",
                                                  odds_range=(2.0, 2.5))),
        ("AH - Away odds 1.8-2.0", run_strategy(matches, "away_18_20", pick="away",
                                                  odds_range=(1.8, 2.0))),
    ]

    for name, r in strategies:
        n=r["bets"]
        w=r["wins"]; hw=r["half_w"]; p=r["push"]; hl=r["half_l"]; l=r["losses"]
        pnl=r["pnl"]
        if n>0:
            print_stat(name, n, w, hw, p, hl, l, pnl)

    # Meilleures strategies
    print(f"\n{'='*70}")
    print(f"  TOP 5 PAR ROI")
    print(f"{'='*70}")
    sorted_strat = sorted(strategies, key=lambda x: -x[1]["pnl"]/(x[1]["bets"]*MISE)*100 if x[1]["bets"]>0 else -999)
    for name, r in sorted_strat[:5]:
        n=r["bets"]
        w=r["wins"]; hw=r["half_w"]; p=r["push"]; hl=r["half_l"]; l=r["losses"]
        pnl=r["pnl"]
        if n>0:
            print_stat(name, n, w, hw, p, hl, l, pnl)

    # Analyse par intervalle de cotes
    print(f"\n{'='*70}")
    print(f"  ANALYSE PAR COTE DU FAVORI HOME AH")
    print(f"{'='*70}")
    for lo, hi in [(1.0,1.5),(1.5,1.7),(1.7,1.9),(1.9,2.1),(2.1,2.5),(2.5,3.0),(3.0,5.0),(5.0,15.0)]:
        sub=[m for m in matches if lo<=m["h_odds"]<hi]
        if not sub: continue
        pnl=sum(compute_pnl(m["h_res"],m["h_odds"]) for m in sub)
        n=len(sub)
        roi=pnl/(n*MISE)*100
        w=sum(1 for m in sub if m["h_res"]==1)
        hw=sum(1 for m in sub if m["h_res"]==0.5)
        pu=sum(1 for m in sub if m["h_res"]==0)
        hl=sum(1 for m in sub if m["h_res"]==-0.5)
        l=sum(1 for m in sub if m["h_res"]==-1)
        print(f"  Cote {lo:.1f}-{hi:.1f}: {n:>6} matchs, {w:>4}W/{hw}HW/{pu}P/{hl}HL/{l}L "
              f"ROI {roi:+.1f}% PnL {pnl:+.0f}")

if __name__=="__main__":
    main()
