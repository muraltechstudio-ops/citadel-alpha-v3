#!/usr/bin/env python3
"""
Backtest: Strategie combine 3 matchs a cote ~1.3
TOUTES les ligues de football-data.co.uk (38 codes)
v5 — Chargement massif, groupe par date, calculs propres.
"""

import csv, io, urllib.request, json, sys
from datetime import datetime
from collections import defaultdict

# ── CONFIG ──────────────────────────────────────────────────────────────────
BANKROLL_INIT = 1000.0
MISE_PAR_COMBI = 10.0
COTE_MIN = 1.25
COTE_MAX = 1.40
TAILLE_COMBI = 3
PERIODE_FORME = 5

SEASONS = ["1920","2021","2122","2223","2324","2425","2526"]

# 22 codes mmz4281
MMZ_CODES = {
    "E0":"Premier League","E1":"Championship","E2":"League 1","E3":"League 2","EC":"National League",
    "SC0":"Premiership Scot","SC1":"Champ Scot","SC2":"L1 Scot","SC3":"L2 Scot",
    "D1":"Bundesliga 1","D2":"Bundesliga 2",
    "I1":"Serie A","I2":"Serie B",
    "SP1":"La Liga","SP2":"Segunda",
    "F1":"Ligue 1","F2":"Ligue 2",
    "N1":"Eredivisie",
    "B1":"Pro League (BEL)",
    "P1":"Liga Portugal",
    "T1":"Super Lig (TUR)",
    "G1":"Super League (GRE)",
}

# 21 codes new format (16 + 5 supplementaires)
NEW_CODES = {
    "ARG":"Argentina","AUT":"Autriche","BRA":"Bresil","CHN":"Chine",
    "CHL":"Chili","COL":"Colombie","DNK":"Danemark","FIN":"Finlande",
    "IRL":"Irlande","JPN":"Japon","KOR":"Coree",
    "MEX":"Mexique","NOR":"Norvege","PHL":"Philippines",
    "POL":"Pologne","ROU":"Roumanie","RUS":"Russie",
    "SWE":"Suede","SWZ":"Suisse","USA":"USA",
}
NEW_LEAGUE_NAMES = {
    "ARG":"Liga Profesional","AUT":"Bundesliga","BRA":"Serie A","CHN":"Super League",
    "CHL":"Primera Div","COL":"Primera A","DNK":"Superliga","FIN":"Veikkausliiga",
    "IRL":"Premier Division","JPN":"J1 League","KOR":"K League 1",
    "MEX":"Liga MX","NOR":"Eliteserien","PHL":"Philippines Football League",
    "POL":"Ekstraklasa","ROU":"Superliga","RUS":"Premier League",
    "SWE":"Allsvenskan","SWZ":"Super League","USA":"MLS",
}

# ── FETCH ───────────────────────────────────────────────────────────────────
def fetch_csv(url):
    """Telecharge un CSV. Silencieux en erreur."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
            for enc in ["utf-8-sig", "latin-1", "cp1252"]:
                try: return list(csv.reader(io.StringIO(raw.decode(enc))))
                except: pass
    except:
        pass
    return []

def parse_date_mmz(s):
    p = s.split("/")
    if len(p) != 3: return None
    try:
        d,m,y = int(p[0]),int(p[1]),int(p[2])
        if y < 100: y += 2000
        return datetime(y,m,d)
    except: return None

def parse_date_new(s):
    if not s: return None
    try:
        if "-" in s:
            parts = s.split("-")
            return datetime(int(parts[0]),int(parts[1]),int(parts[2]))
        p = s.split("/")
        return datetime(int(p[2]),int(p[1]),int(p[0]))
    except: return None

# ── LOADERS ─────────────────────────────────────────────────────────────────
def load_mmz(code):
    """Charge une ligue du format mmz4281 (E0, D1, etc.)."""
    matches = []
    for s in SEASONS:
        rows = fetch_csv(f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv")
        if not rows or len(rows) < 2: continue
        h = rows[0]; idx = {c:i for i,c in enumerate(h)}
        for r in rows[1:]:
            try:
                dt = parse_date_mmz(r[idx["Date"]])
                if dt is None: continue
                m = {"date": dt, "home": r[idx["HomeTeam"]].strip(),
                     "away": r[idx["AwayTeam"]].strip(),
                     "hg": int(r[idx["FTHG"]]), "ag": int(r[idx["FTAG"]]),
                     "league": code}
                # Prendre la meilleure cote dispo: AvgH > PSH > B365H
                for col in ["AvgH","PSH","B365H"]:
                    if col in idx:
                        try:
                            m["odds"] = float(r[idx[col]])
                            break
                        except: pass
                if "odds" in m and m["odds"] > 0: matches.append(m)
            except: pass
    return matches

def load_new(code):
    """Charge une ligue du format new (ARG, BRA, etc.)."""
    matches = []
    rows = fetch_csv(f"https://www.football-data.co.uk/new/{code}.csv")
    if not rows or len(rows) < 2: return matches
    h = rows[0]; idx = {c:i for i,c in enumerate(h)}
    target_league = NEW_LEAGUE_NAMES[code]
    has_league_col = "League" in idx
    for r in rows[1:]:
        try:
            if has_league_col:
                league = r[idx["League"]].strip()
                if league != target_league: continue
            seas = r[idx["Season"]].strip()
            try:
                if int(seas[:4]) < 2020: continue
            except: pass
            dt = parse_date_new(r[idx["Date"]].strip())
            if dt is None: continue
            m = {"date": dt, "home": r[idx["Home"]].strip(),
                 "away": r[idx["Away"]].strip(),
                 "hg": int(r[idx["HG"]]), "ag": int(r[idx["AG"]]),
                 "league": code}
            for col in ["AvgCH","B365CH","PSCH"]:
                if col in idx:
                    try:
                        m["odds"] = float(r[idx[col]])
                        break
                    except: pass
            if "odds" in m and m["odds"] > 0: matches.append(m)
        except: pass
    return matches

# ── STRATEGIE ───────────────────────────────────────────────────────────────
def build_stats(matches, date_limit):
    stats = defaultdict(lambda: {"pts":0,"wins":[],"played":0})
    for m in matches:
        if m["date"] >= date_limit: continue
        h,a = m["home"],m["away"]
        stats[h]["played"] += 1; stats[a]["played"] += 1
        if m["hg"] > m["ag"]:
            stats[h]["pts"]+=3; stats[h]["wins"].append(1); stats[a]["wins"].append(0)
        elif m["ag"] > m["hg"]:
            stats[a]["pts"]+=3; stats[a]["wins"].append(1); stats[h]["wins"].append(0)
        else:
            stats[h]["pts"]+=1; stats[a]["pts"]+=1
            stats[h]["wins"].append(0); stats[a]["wins"].append(0)
    return stats

def get_rank(stats, team):
    st = sorted(stats.items(), key=lambda x: -x[1]["pts"])
    for rank,(t,_) in enumerate(st,1):
        if t == team: return rank
    return len(st)

def score_match(m, stats):
    s = 2  # domicile
    hf = stats[m["home"]]["wins"][-PERIODE_FORME:]
    if hf:
        wp = sum(hf)/len(hf)*100
        if wp >= 80: s+=2
        elif wp >= 60: s+=1
    total = len(stats)
    if total > 0:
        r = get_rank(stats, m["away"])
        if r > total*0.5: s+=2
        elif r > total*0.35: s+=1
    af = stats[m["away"]]["wins"][-PERIODE_FORME:]
    if af and sum(af)/len(af)*100 >= 60: s-=1
    if COTE_MIN <= m["odds"] <= COTE_MAX: s+=1
    return s

def eligible(m, stats):
    if m["odds"] < COTE_MIN or m["odds"] > COTE_MAX: return False,0
    if stats[m["home"]]["played"] < PERIODE_FORME: return False,0
    if stats[m["away"]]["played"] < PERIODE_FORME: return False,0
    sc = score_match(m, stats)
    return True, sc

# ── BACKTEST ────────────────────────────────────────────────────────────────
def run_backtest(all_matches):
    if not all_matches: return None
    all_matches.sort(key=lambda x:x["date"])
    by_date = defaultdict(list)
    for m in all_matches: by_date[m["date"]].append(m)

    engine = {"combos":0,"wins":0,"losses":0,"profit":0.0,
              "peak":BANKROLL_INIT,"max_dd":0.0,
              "odds_won":[],"odds_lost":[],
              "consec_w":0,"consec_l":0,"max_ws":0,"max_ls":0,
              "bankroll":BANKROLL_INIT,"log":[]}

    sorted_dates = sorted(by_date.keys())
    for date in sorted_dates:
        day_m = by_date[date]
        stats = build_stats(all_matches, date)

        cand = []
        for m in day_m:
            ok,sc = eligible(m,stats)
            if ok: cand.append((m,sc))

        if len(cand) < TAILLE_COMBI: continue

        cand.sort(key=lambda x:-x[1])
        best = cand[:TAILLE_COMBI]

        combi_odds = 1.0
        for m,_ in best: combi_odds *= m["odds"]

        won = all(m["hg"]>m["ag"] for m,_ in best)
        wc = sum(1 for m,_ in best if m["hg"]>m["ag"])

        mise = MISE_PAR_COMBI
        if won:
            profit = mise*(combi_odds-1)
            engine["bankroll"] += profit
            engine["profit"] += profit
            engine["wins"] += 1
            engine["odds_won"].append(combi_odds)
            engine["consec_w"]+=1; engine["consec_l"]=0
            if engine["consec_w"]>engine["max_ws"]: engine["max_ws"]=engine["consec_w"]
        else:
            profit = -mise
            engine["bankroll"] += profit
            engine["profit"] += profit
            engine["losses"] += 1
            engine["odds_lost"].append(combi_odds)
            engine["consec_l"]+=1; engine["consec_w"]=0
            if engine["consec_l"]>engine["max_ls"]: engine["max_ls"]=engine["consec_l"]

        engine["combos"] += 1
        if engine["bankroll"] > engine["peak"]: engine["peak"] = engine["bankroll"]
        dd = (engine["peak"]-engine["bankroll"])/engine["peak"]*100
        if dd > engine["max_dd"]: engine["max_dd"] = dd

        engine["log"].append({
            "date": date.strftime("%Y-%m-%d"), "status": "W" if won else "L",
            "odds": round(combi_odds,3), "profit": round(profit,0),
            "bank": round(engine["bankroll"],0),
            "w": wc, "l": TAILLE_COMBI-wc,
        })

    return engine

# ── MAIN ────────────────────────────────────────────────────────────────────
def main():
    # Detect encoding for Windows
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("=" * 70)
    print("  BACKTEST COMBINE 3x ~1.3 — TOUTES LIGUES (38 codes)")
    print("  football-data.co.uk | Saisons 2020-2026")
    print("=" * 70)

    # ── CHARGER TOUTES LES LIGUES ──────────────────────────────────────────
    print("\n[1/2] Chargement des donnees...")
    all_matches = []
    ligue_stats = {}

    total_codes = len(MMZ_CODES) + len(NEW_CODES)
    done = 0

    for code, name in MMZ_CODES.items():
        m = load_mmz(code)
        for match in m: match["league_name"] = name
        all_matches.extend(m)
        ligue_stats[code] = {"name": name, "matches": len(m), "type": "hiver"}
        done += 1
        pct = done/total_codes*100
        sys.stdout.write(f"\r  [{pct:4.0f}%] MMZ {code}={name}: {len(m)} matchs           ")
        sys.stdout.flush()

    for code, name in NEW_CODES.items():
        m = load_new(code)
        for match in m: match["league_name"] = name
        all_matches.extend(m)
        ligue_stats[code] = {"name": name, "matches": len(m), "type": "ete"}
        done += 1
        pct = done/total_codes*100
        sys.stdout.write(f"\r  [{pct:4.0f}%] NEW {code}={name}: {len(m)} matchs           ")
        sys.stdout.flush()

    print(f"\n\nTotal: {len(all_matches)} matchs charges depuis {len(ligue_stats)} codes.")

    if len(all_matches) == 0:
        print("ERREUR: aucun match charge.")
        return

    # Afficher le top 10 des ligues par nombre de matchs
    print("\nTop 10 ligues par volume:")
    top_ligues = sorted(ligue_stats.items(), key=lambda x:-x[1]["matches"])[:10]
    for code, info in top_ligues:
        t = "HIVER" if info["type"]=="hiver" else "ETE"
        print(f"  {info['name']} ({code}): {info['matches']} matchs [{t}]")

    # ── BACKTEST ───────────────────────────────────────────────────────────
    print("\n[2/2] Execution du backtest...")
    engine = run_backtest(all_matches)

    if not engine or engine["combos"] == 0:
        print("\nAucun combine joue — le filtre est trop strict.")
        return

    n = engine["combos"]
    w = engine["wins"]
    l = n - w
    wr = w/n*100 if n else 0
    mise_tot = n*MISE_PAR_COMBI
    roi = engine["profit"]/mise_tot*100 if mise_tot else 0
    aw = sum(engine["odds_won"])/len(engine["odds_won"]) if engine["odds_won"] else 0
    al = sum(engine["odds_lost"])/len(engine["odds_lost"]) if engine["odds_lost"] else 0
    fb = BANKROLL_INIT + engine["profit"]

    esperance = (wr/100)*aw - (1-wr/100)

    # ── AFFICHAGE ─────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("  RESULTATS")
    print("=" * 70)
    print(f"\n  Combines joues:             {n}")
    print(f"  Gagnes:                     {w}")
    print(f"  Perdus:                     {l}")
    print(f"  Win rate:                   {wr:.1f}%")
    print(f"  Cote moyenne gagnants:      {aw:.3f}")
    print(f"  Cote moyenne perdants:      {al:.3f}")
    print(f"\n  --- FINANCIER ---")
    print(f"  Bankroll initiale:          {BANKROLL_INIT:.0f}")
    print(f"  Mise totale:                {mise_tot:.0f}")
    print(f"  Profit net:                 {engine['profit']:+.0f}")
    print(f"  Bankroll finale:            {fb:.0f}")
    print(f"  Rendement:                  {(fb/BANKROLL_INIT-1)*100:+.1f}%")
    print(f"  ROI:                        {roi:+.1f}%")
    print(f"  Drawdown max:               {engine['max_dd']:.1f}%")
    print(f"\n  --- SERIES ---")
    print(f"  Max win streak:             {engine['max_ws']}")
    print(f"  Max loss streak:            {engine['max_ls']}")
    print(f"\n  Esperance/combine:          {esperance:+.4f} ", end="")
    if esperance > 0: print("(gagnant LT)")
    else: print("(perdant LT)")

    # Derniers 10 combos
    logs = engine["log"]
    print(f"\n  --- {len(logs)} combos joues ---")
    for entry in logs[-10:]:
        print(f"  [{entry['date']}] {entry['status']} | odds {entry['odds']:.3f} "
              f"| P:{entry['profit']:+1.0f} | Bank:{entry['bank']:.0f}")

    # Distribution temporelle
    winter_combo = sum(1 for e in logs if int(e["date"][:4]) < 6 or int(e["date"][:4]) == 12 or
                       (int(e["date"][5:7]) >= 8) or (int(e["date"][5:7]) <= 5))
    summer_combo = len(logs) - winter_combo
    print(f"\n  Distribution saisonniere:")
    print(f"    Saison hiver (aout-mai):   {winter_combo} combos")
    print(f"    Saison ete (mai-aout):     {summer_combo} combos")
    print(f"    Jours avec combine:        {len(logs)}")

    # Analyse par mois
    monthly = defaultdict(int)
    for e in logs:
        month = e["date"][5:7]
        monthly[month] += 1
    print(f"\n  Distribution mensuelle (nombre de combos):")
    for m in sorted(monthly.keys()):
        print(f"    Mois {m}: {monthly[m]} combos")

    # ── SAUVEGARDE ─────────────────────────────────────────────────────────
    output = {
        "config": {
            "bankroll_init": BANKROLL_INIT, "mise_par_combi": MISE_PAR_COMBI,
            "cote_range": [COTE_MIN, COTE_MAX], "taille_combi": TAILLE_COMBI,
            "periode_forme": PERIODE_FORME, "nb_ligues": len(ligue_stats),
            "matchs_charges": len(all_matches),
        },
        "total": {
            "combines": n, "gagnes": w, "perdus": l,
            "win_rate": round(wr,2), "profit_net": round(engine["profit"],2),
            "roi_pct": round(roi,2), "max_drawdown": round(engine["max_dd"],2),
            "avg_odds_won": round(aw,3), "avg_odds_lost": round(al,3),
            "max_win_streak": engine["max_ws"], "max_loss_streak": engine["max_ls"],
            "esperance": round(esperance,4),
            "bankroll_finale": round(fb,2),
            "combos_par_jour": len(logs),
            "winter_combos": winter_combo, "summer_combos": summer_combo,
        },
        "ligue_stats": {k: v for k,v in sorted(ligue_stats.items(), key=lambda x:-x[1]["matches"])},
        "log": logs,
    }

    with open("football_backtest_results.json","w",encoding="utf-8") as f:
        json.dump(output,f,indent=2,ensure_ascii=False)
    print(f"\nResultats sauvegardes.")

if __name__ == "__main__":
    main()
