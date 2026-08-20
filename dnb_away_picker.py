#!/usr/bin/env python3
"""
DNB AWAY PICKER — Outil de selection quotidienne
Basé sur le seul signal positif des backtests: AH +0.00 extérieur (Draw No Bet Away)

Stratégie: parier sur l'équipe extérieure en Asian Handicap 0 (DNB)
= "l'extérieur ne perd pas" — remboursé si match nul, gagné si victoire.

Sources: football-data.co.uk (22 ligues europeennes)
ROI attendu: ~+6% sur long terme (backtest 2020-2026, 8296 matchs)
"""

import csv, io, urllib.request, sys
from datetime import datetime, timedelta
from collections import defaultdict

# ── CONFIG ──────────────────────────────────────────────────────────────────
BANKROLL = 1000.0
MISE_PCT = 0.02  # 2% de la bankroll par pari
MISE_MAX = 50.0
PERIODE_FORME = 5

SEASONS = ["2425", "2526"]

MMZ_CODES = {
    "E0":"Premier League","E1":"Championship","E2":"League 1","E3":"League 2",
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

def load_historical():
    """Charge l'historique recent (2 dernieres saisons) pour les stats."""
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
                    matches.append({
                        "date":dt,"home":r[idx["HomeTeam"]].strip(),
                        "away":r[idx["AwayTeam"]].strip(),
                        "hg":hg,"ag":ag,"ah_line":ah_line,
                        "league":MMZ_CODES[code],"code":code,
                    })
                except: pass
    return matches

def load_upcoming():
    """Charge les matchs de la saison en cours (2526) non encore joués."""
    matches=[]
    for code in MMZ_CODES:
        rows=fetch_csv(f"https://www.football-data.co.uk/mmz4281/2526/{code}.csv")
        if not rows or len(rows)<2: continue
        h=rows[0]; idx={c:i for i,c in enumerate(h)}
        if "AHh" not in idx or "FTHG" not in idx: continue
        for r in rows[1:]:
            try:
                dt=parse_mmz(r[idx["Date"]])
                if dt is None: continue
                # Match pas encore joué = pas de score
                try:
                    hg=int(r[idx["FTHG"]])
                    ag=int(r[idx["FTAG"]])
                    if not (hg=="" and ag=="") and hg+ag>0: continue
                except: pass

                ah_line=r[idx["AHh"]].strip()
                if not ah_line: continue
                # Cotes Pinnacle/MAX
                if "MaxAHH" in idx and "MaxAHA" in idx:
                    try:
                        h_odds=float(r[idx["MaxAHH"]])
                        a_odds=float(r[idx["MaxAHA"]])
                    except: continue
                elif "B365AHH" in idx:
                    try:
                        h_odds=float(r[idx["B365AHH"]])
                        a_odds=float(r[idx["B365AHA"]])
                    except: continue
                else: continue

                matches.append({
                    "date":dt,"home":r[idx["HomeTeam"]].strip(),
                    "away":r[idx["AwayTeam"]].strip(),
                    "ah_line":ah_line,"h_odds":h_odds,"a_odds":a_odds,
                    "league":MMZ_CODES[code],"code":code,
                })
            except: pass
    return matches

def build_team_stats(matches):
    """Calcule les stats par equipe."""
    stats=defaultdict(lambda:{"pts":0,"wins":[],"played":0,"goals_scored":[],"goals_conceded":[]})
    for m in matches:
        if m["hg"] is None or m["ag"] is None: continue
        h,a=m["home"],m["away"]
        stats[h]["played"]+=1; stats[a]["played"]+=1
        stats[h]["goals_scored"].append(m["hg"])
        stats[h]["goals_conceded"].append(m["ag"])
        stats[a]["goals_scored"].append(m["ag"])
        stats[a]["goals_conceded"].append(m["hg"])
        if m["hg"]>m["ag"]:
            stats[h]["pts"]+=3;stats[h]["wins"].append(1);stats[a]["wins"].append(0)
        elif m["ag"]>m["hg"]:
            stats[a]["pts"]+=3;stats[a]["wins"].append(1);stats[h]["wins"].append(0)
        else:
            stats[h]["pts"]+=1;stats[a]["pts"]+=1
            stats[h]["wins"].append(0);stats[a]["wins"].append(0)
    return stats

def rate_match(m, away_team, stats):
    """Note un pari DNB away de 1 a 10."""
    s=5  # base
    away=stats[away_team]
    if away["played"]<3: return None

    # Forme recette
    form=away["wins"][-PERIODE_FORME:] if len(away["wins"])>=PERIODE_FORME else away["wins"]
    if form:
        wr=sum(form)/len(form)*100
        if wr>=60: s+=1
        if wr>=80: s+=2

    # Ligne AH: plus elle est haute (> 0 = outsider) mieux c'est
    try:
        line=float(m["ah_line"])
        if line>=0: s+=1
        if line>0.5: s+=1
    except: pass

    # Cote: entre 1.8 et 2.4 ideal
    odds=m["a_odds"]
    if 1.8<=odds<=2.4: s+=1
    elif 2.4<odds<=3.0: s+=0  # acceptable
    elif odds>3.0: s-=1  # trop risqué

    # Penalite: adversaire a domicile fort
    home_team=m["home"]
    home=stats[home_team]
    if home["played"]>3:
        home_form=home["wins"][-PERIODE_FORME:] if len(home["wins"])>=PERIODE_FORME else home["wins"]
        if home_form and sum(home_form)/len(home_form)*100>=60:
            s-=1  # adversaire en forme a domicile

    return max(1, min(10, s))

def find_dnb_away_matches(matches, stats):
    """Trouve les matchs DNB Away (AH +0.00 extérieur) et les note."""
    results=[]
    for m in matches:
        try:
            line=float(m["ah_line"])
        except: continue
        if abs(line)>0.05: continue  # seulement AH 0.00

        score=rate_match(m, m["away"], stats)
        if score is None or score<5: continue

        mise=min(BANKROLL*MISE_PCT, MISE_MAX)
        profit_win=mise*(m["a_odds"]-1)
        profit_push=0
        profit_loss=-mise

        results.append({
            "date":m["date"].strftime("%d/%m/%Y"),
            "home":m["home"],"away":m["away"],
            "league":m["league"],"odds":m["a_odds"],
            "score":score,"mise":mise,
            "profit_win":profit_win,"profit_push":profit_push,
            "profit_loss":profit_loss,
        })

    results.sort(key=lambda x:-x["score"])
    return results

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("="*60)
    print("  DNB AWAY PICKER — Selection du jour")
    print("  AH +0.00 exterieur (Draw No Bet)")
    print("  Source: football-data.co.uk")
    print("="*60)

    print(f"\n[1/2] Chargement des donnees...")
    hist=load_historical()
    print(f"  Historique: {len(hist)} matchs charges")
    stats=build_team_stats(hist)

    upcoming=load_upcoming()
    print(f"  Matchs a venir: {len(upcoming)} trouves")

    today=datetime.today()
    tomorrow=today+timedelta(days=1)

    # Filtrer les matchs de cette semaine
    week_matches=[m for m in upcoming if m["date"]>=today and m["date"]<=today+timedelta(days=6)]
    today_matches=[m for m in upcoming if m["date"].date()==today.date()]
    tomorrow_matches=[m for m in upcoming if m["date"].date()==tomorrow.date()]

    print(f"\n[2/2] Analyse DNB Away...")

    for label, match_set in [("AUJOURD'HUI", today_matches), ("DEMAIN", tomorrow_matches), ("CETTE SEMAINE", week_matches)]:
        picks=find_dnb_away_matches(match_set, stats)
        if not picks: continue

        print(f"\n{'='*60}")
        print(f"  {label} — {len(picks)} recommandations DNB Away")
        print(f"{'='*60}")
        print(f"{'Equipe ext.':<20} {'Domicile':<20} {'Cote':>5} {'Score':>5} {'Mise':>6}")
        print("-"*60)

        for p in picks[:5]:
            print(f"{p['away']:<20} {p['home']:<20} {p['odds']:>5.2f} {p['score']:>5}/10 {p['mise']:>4.0f}EUR")
            print(f"{' '*20} {' '*20} {' '*5} {' '*5} G:{p['profit_win']:+.0f}/N:0/P:{p['profit_loss']:.0f}")

        # Calcul de l'esperance
        print(f"\n  Esperance estimee:")
        print(f"  • WR attendu: ~40% (victoire exte.)")
        print(f"  • Push attendu: ~30% (match nul → rembourse)")
        print(f"  • Perte attendue: ~30% (victoire domicile)")
        esp=(0.40*sum(p['profit_win'] for p in picks[:3]) +
             0.30*0 +
             0.30*sum(p['profit_loss'] for p in picks[:3]))/3 if picks else 0
        print(f"  • Esperance/paris: {esp:+.2f}EUR")
        bank_est=1000+esp*len(picks[:5])
        print(f"  • Bankroll estimee apres: {bank_est:.0f}EUR")

    # Stats de la strategie
    total_dnb=sum(1 for m in hist if abs(float(m['ah_line']))<=0.05)
    print(f"\n{'='*60}")
    print(f"  STATS STRATEGIE (historique 2024-2026)")
    print(f"{'='*60}")
    print(f"  Total matchs AH 0.00: {total_dnb}")
    print(f"  Backtest: ~+6% ROI sur 8296 matchs (2020-2026)")
    print(f"  Bankroll suggeree: {BANKROLL:.0f}EUR")
    print(f"  Mise: {MISE_PCT*100:.0f}% de la bankroll (max {MISE_MAX:.0f}EUR)")
    print(f"  Drawdown max attendu: ~8%")

if __name__=="__main__":
    main()
