#!/usr/bin/env python3
"""
Backtest DEDIE: DNB Away (AH +0.00 exterieur)
Le seul signal positif detecte. Calculs propres, chiffres precis.
22 ligues europeennes, 2020-2026.
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

def compute_ah_result(hg, ag, line):
    """Asian Handicap result: 1=W, 0.5=HW, 0=P, -0.5=HL, -1=L"""
    net = hg - ag
    adj = net + line
    if line == int(line):
        if adj > 0: return 1
        elif adj < 0: return -1
        else: return 0
    elif line % 1 == 0.5:
        return 1 if adj > 0 else -1
    else:
        base = int(line)
        frac = round(line - base, 2)
        adj_base = net + base
        if frac == 0.25:
            r1 = 1 if adj_base > 0 else (-1 if adj_base < 0 else 0)
            r2 = 1 if (adj_base + 0.5) > 0 else -1
        elif frac == -0.25:
            r1 = 1 if adj_base > 0 else (-1 if adj_base < 0 else 0)
            r2 = 1 if (adj_base - 0.5) > 0 else -1
        elif frac == 0.75:
            r1 = 1 if (adj_base + 0.5) > 0 else -1
            r2 = 1 if (adj_base + 1.0) > 0 else (-1 if (adj_base + 1.0) < 0 else 0)
        elif frac == -0.75:
            r1 = 1 if (adj_base - 0.5) > 0 else -1
            r2 = 1 if (adj_base - 1.0) > 0 else (-1 if (adj_base - 1.0) < 0 else 0)
        else: return None
        return round((r1 + r2) / 2 * 4) / 4

def pnl(result, odds):
    if result == 1: return MISE * (odds - 1)
    elif result == 0.5: return MISE * (odds - 1) * 0.5
    elif result == 0: return 0
    elif result == -0.5: return -MISE * 0.5
    elif result == -1: return -MISE
    return -MISE

def load_all():
    matches=[]
    for code_name, league_name in MMZ_CODES.items():
        code=code_name
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
                    # Pinnacle closing odds (Max) puis B365
                    if "MaxAHH" in idx:
                        try: h_odds=float(r[idx["MaxAHH"]]); a_odds=float(r[idx["MaxAHA"]])
                        except: continue
                    elif "B365AHH" in idx:
                        try: h_odds=float(r[idx["B365AHH"]]); a_odds=float(r[idx["B365AHA"]])
                        except: continue
                    else: continue

                    matches.append({
                        "date":dt,"home":r[idx["HomeTeam"]].strip(),
                        "away":r[idx["AwayTeam"]].strip(),"hg":hg,"ag":ag,
                        "ah_line":ah_line,"h_odds":h_odds,"a_odds":a_odds,
                        "league":league_name,"code":code,
                    })
                except: pass
        sys.stdout.write("."); sys.stdout.flush()
    print(f"\n{len(matches)} matchs")
    return matches

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

    print("=" * 70)
    print("  BACKTEST DNB AWAY (AH +0.00 exterieur)")
    print("  22 ligues europeennes | 2020-2026")
    print("=" * 70)

    matches=load_all()

    # Filtrer AH 0.00 seulement
    dnb_matches=[]
    for m in matches:
        try:
            if abs(float(m["ah_line"])) <= 0.05:
                dnb_matches.append(m)
        except: pass

    dnb_matches.sort(key=lambda x:x["date"])
    n=len(dnb_matches)
    print(f"\nMatchs AH 0.00: {n}")

    # ── STATS GLOBALES ────────────────────────────────────────────────────
    away_wins=sum(1 for m in dnb_matches if m["ag"]>m["hg"])
    home_wins=sum(1 for m in dnb_matches if m["hg"]>m["ag"])
    draws=sum(1 for m in dnb_matches if m["hg"]==m["ag"])

    print(f"\n=== RESULTATS BRUTS (n={n}) ===")
    print(f"  Victoire exterieur: {away_wins} ({away_wins/n*100:.1f}%)")
    print(f"  Match nul (push):   {draws} ({draws/n*100:.1f}%)")
    print(f"  Victoire domicile:  {home_wins} ({home_wins/n*100:.1f}%)")

    # ── PERFORMANCE DNB AWAY ─────────────────────────────────────────────
    w=hl=p=hw=0
    bank=BANKROLL_INIT
    peak=BANKROLL_INIT
    max_dd=0.0
    pnl_total=0.0
    odds_w,odds_l=[],[]
    consec_w=consec_l=0
    max_ws=max_ls=0
    wins_streaks=[]
    loss_streaks=[]

    for m in dnb_matches:
        res=compute_ah_result(m["hg"], m["ag"], float(m["ah_line"]))
        if res is None: continue
        p=pnl(res, m["a_odds"])
        bank+=p
        pnl_total+=p
        if bank>peak: peak=bank
        dd=(peak-bank)/peak*100
        if dd>max_dd: max_dd=dd

        if res==1: w+=1; odds_w.append(m["a_odds"]); consec_w+=1; consec_l=0
        elif res==0.5: hw+=1; odds_w.append(m["a_odds"]); consec_w+=1; consec_l=0
        elif res==0: p+=1; consec_w=consec_l=0
        elif res==-0.5: hl+=1; odds_l.append(m["a_odds"]); consec_l+=1; consec_w=0
        elif res==-1: odds_l.append(m["a_odds"]); consec_l+=1; consec_w=0

        if consec_w>max_ws: max_ws=consec_w
        if consec_l>max_ls: max_ls=consec_l

    # Stats de performance
    total_explicit=w+hw+p+hl+(n-w-hw-p-hl)
    roi=pnl_total/(n*MISE)*100
    aw=sum(odds_w)/len(odds_w) if odds_w else 0
    al=sum(odds_l)/len(odds_l) if odds_l else 0
    wr_effective=(w+hw*0.5+hl*(-0.5)+(-1)*(n-w-hw-p-hl))/n  # moyenne pondérée

    print(f"\n=== PERFORMANCE DNB AWAY (mise {MISE:.0f}EUR) ===")
    print(f"  Paris:                {n}")
    print(f"  Gagnes (W):           {w}")
    print(f"  Demi-gagnes (HW):     {hw}")
    print(f"  Rembourses (P):       {p}  ← match nul, mise remboursee")
    print(f"  Demi-perdus (HL):     {hl}")
    print(f"  Perdus (L):           {n-w-hw-p-hl}")
    print(f"  Cote moyenne W:       {aw:.3f}")
    print(f"  Cote moyenne L:       {al:.3f}")
    print(f"\n  --- FINANCIER ---")
    print(f"  Bankroll initiale:    {BANKROLL_INIT:.0f}EUR")
    print(f"  Mise totale:          {n*MISE:.0f}EUR")
    print(f"  Profit net:           {pnl_total:+.0f}EUR")
    print(f"  Bankroll finale:      {bank:.0f}EUR")
    print(f"  Rendement:            {(bank/BANKROLL_INIT-1)*100:+.1f}%")
    print(f"  ROI:                  {roi:+.2f}%")
    print(f"  Drawdown max:         {max_dd:.1f}%")
    print(f"\n  --- SERIES ---")
    print(f"  Plus longue serie W:  {max_ws}")
    print(f"  Plus longue serie L:  {max_ls}")

    # Esperance
    esperance_unitaire = pnl_total / n if n else 0
    print(f"  Esperance/paris:      {esperance_unitaire:+.2f}EUR")
    print(f"  Esperance/paris (%):  {roi:+.2f}%")

    # ── PAR LIGUE ────────────────────────────────────────────────────────
    print(f"\n=== PAR LIGUE ===")
    by_league=defaultdict(lambda:{"n":0,"w":0,"hw":0,"p":0,"hl":0,"l":0,"pnl":0.0,"odds":[]})
    for m in dnb_matches:
        res=compute_ah_result(m["hg"],m["ag"],float(m["ah_line"]))
        if res is None: continue
        L=by_league[m["league"]]
        L["n"]+=1
        L["pnl"]+=pnl(res,m["a_odds"])
        L["odds"].append(m["a_odds"])
        if res==1: L["w"]+=1
        elif res==0.5: L["hw"]+=1
        elif res==0: L["p"]+=1
        elif res==-0.5: L["hl"]+=1
        else: L["l"]+=1

    print(f"{'Ligue':<22} {'N':>5} {'W':>4} {'HW':>3} {'P':>3} {'HL':>3} {'L':>4} {'WR%':>5} {'ROI':>7} {'PnL':>7}")
    print("-"*70)

    for league in sorted(by_league.keys(), key=lambda x:-by_league[x]["n"]):
        L=by_league[league]
        wr=L["w"]/(L["n"]-L["p"])*100 if L["n"]-L["p"]>0 else 0
        roi_league=L["pnl"]/(L["n"]*MISE)*100
        print(f"{league:<22} {L['n']:>5} {L['w']:>4} {L['hw']:>3} {L['p']:>3} {L['hl']:>3} {L['l']:>4} {wr:>4.1f}% {roi_league:>+6.1f}% {L['pnl']:>+6.0f}")

    # ── PAR SAISON ────────────────────────────────────────────────────────
    print(f"\n=== PAR SAISON ===")
    by_season=defaultdict(lambda:{"n":0,"w":0,"hw":0,"p":0,"hl":0,"l":0,"pnl":0.0})
    for m in dnb_matches:
        res=compute_ah_result(m["hg"],m["ag"],float(m["ah_line"]))
        if res is None: continue
        season=f"{m['date'].year-1}-{m['date'].year}" if m["date"].month<7 else f"{m['date'].year}-{m['date'].year+1}"
        if m["date"].year<2020: continue
        S=by_season[season]
        S["n"]+=1
        S["pnl"]+=pnl(res,m["a_odds"])
        if res==1: S["w"]+=1
        elif res==0.5: S["hw"]+=1
        elif res==0: S["p"]+=1
        elif res==-0.5: S["hl"]+=1
        else: S["l"]+=1

    print(f"{'Saison':<12} {'N':>5} {'W':>4} {'P':>4} {'L':>4} {'ROI':>7} {'PnL':>7}")
    print("-"*50)
    for season in sorted(by_season.keys()):
        S=by_season[season]
        roi_s=S["pnl"]/(S["n"]*MISE)*100
        l=S["n"]-S["w"]-S["hw"]-S["p"]-S["hl"]
        print(f"{season:<12} {S['n']:>5} {S['w']:>4} {S['p']:>4} {l:>4} {roi_s:>+6.1f}% {S['pnl']:>+6.0f}")

    # ── PAR COTE ──────────────────────────────────────────────────────────
    print(f"\n=== PAR TRANCHE DE COTES ===")
    for lo,hi in [(1.3,1.6),(1.6,1.8),(1.8,2.0),(2.0,2.2),(2.2,2.5),(2.5,3.0),(3.0,5.0)]:
        sub=[m for m in dnb_matches if lo<=m["a_odds"]<hi]
        if not sub: continue
        sub_pnl=0
        for m in sub:
            res=compute_ah_result(m["hg"],m["ag"],float(m["ah_line"]))
            if res is not None: sub_pnl+=pnl(res,m["a_odds"])
        roi_sub=sub_pnl/(len(sub)*MISE)*100
        w_sub=sum(1 for m in sub if m["ag"]>m["hg"])
        d_sub=sum(1 for m in sub if m["hg"]==m["ag"])
        print(f"  Cote {lo:.1f}-{hi:.1f}: {len(sub):>5} matchs, W={w_sub:>4}, P={d_sub:>4}, "
              f"ROI {roi_sub:>+6.1f}%, PnL {sub_pnl:>+6.0f}EUR")

    # ── PAR MOIS ──────────────────────────────────────────────────────────
    print(f"\n=== PAR MOIS ===")
    by_month=defaultdict(lambda:{"n":0,"pnl":0.0})
    for m in dnb_matches:
        res=compute_ah_result(m["hg"],m["ag"],float(m["ah_line"]))
        if res is None: continue
        month=m["date"].month
        by_month[month]["n"]+=1
        by_month[month]["pnl"]+=pnl(res,m["a_odds"])

    for m in sorted(by_month.keys()):
        M=by_month[m]
        roi_m=M["pnl"]/(M["n"]*MISE)*100
        print(f"  Mois {m:02d}: {M['n']:>5} matchs, ROI {roi_m:>+6.1f}%, PnL {M['pnl']:>+6.0f}EUR")

    # ── SIMULATION BANKROLL ──────────────────────────────────────────────
    print(f"\n=== SIMULATION BANKROLL (mise 2% progressive) ===")
    bank2=1000.0
    peak2=1000.0
    dd2=0.0
    for i,m in enumerate(dnb_matches):
        res=compute_ah_result(m["hg"],m["ag"],float(m["ah_line"]))
        if res is None: continue
        mise=min(bank2*0.02, 50.0)
        if mise<1: continue
        def pnl2(res,odds):
            if res==1: return mise*(odds-1)
            elif res==0.5: return mise*(odds-1)*0.5
            elif res==0: return 0
            elif res==-0.5: return -mise*0.5
            elif res==-1: return -mise
            return -mise
        p=pnl2(res,m["a_odds"])
        bank2+=p
        if bank2>peak2: peak2=bank2
        dd2=max(dd2, (peak2-bank2)/peak2*100)

    print(f"  Bankroll initiale:    1000EUR")
    print(f"  Bankroll finale:      {bank2:.0f}EUR")
    print(f"  Profit net:           {bank2-1000:+.0f}EUR")
    print(f"  Rendement:            {(bank2/1000-1)*100:+.1f}%")
    print(f"  Drawdown max:         {dd2:.1f}%")

if __name__=="__main__":
    main()
