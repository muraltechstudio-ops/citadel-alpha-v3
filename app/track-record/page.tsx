"use client"

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Trade {
  t: string; d: string; ex: string; ra: string;
  pe: number; ps: number; pp: number; me: number;
  peur: number; ca: number; s: string; y: number;
}

interface TrackRecordMeta {
  period: string; years: number; initial_capital: number;
  final_capital: number; total_return_pct: number; cagr: number;
  max_drawdown: number; trades: number; win_rate: number;
  win_months: number; total_months: number;
}

function fmt(n: number) { return n > 0 ? '+' + n.toFixed(2) : n.toFixed(2); }

export default function TrackRecordPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [meta, setMeta] = useState<TrackRecordMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    fetch('/data/track-record.json')
      .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then(data => {
        setTrades(data.trades);
        setMeta(data.meta);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#F59E0B] mx-auto mb-4" />
          <p className="text-[#FEFEFE]/60">Chargement du track record...</p>
        </div>
      </main>
    );
  }

  if (error || !meta) {
    return (
      <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#EF4444] text-lg mb-4">Impossible de charger les données du track record.</p>
          <Link href="/" className="text-[#F59E0B] hover:text-[#FCD34D] transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  const allTrades = trades;
  const filteredTrades = selectedYear
    ? allTrades.filter((t: Trade) => t.y === selectedYear)
    : allTrades;

  const years = [...new Set(trades.map((t: Trade) => t.y))].sort((a: number, b: number) => b - a);
  const wins = filteredTrades.filter((t: Trade) => t.s === "win").length;
  const displayTotal = filteredTrades.length;
  const displayWinRate = displayTotal > 0 ? ((wins / displayTotal) * 100).toFixed(1) : "0";

  const fmtCap = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#F59E0B] hover:text-[#FCD34D] transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Track Record Complet
            </span>
          </h1>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            {meta.trades} trades de {meta.period.replace(' → ', ' à ')} — glissement et frais réels inclus
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{displayTotal}</div>
            <div className="text-xs text-[#FEFEFE]/50">Trades</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#10B981]">{displayWinRate}%</div>
            <div className="text-xs text-[#FEFEFE]/50">Réussite</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F59E0B]">{meta.cagr}%</div>
            <div className="text-xs text-[#FEFEFE]/50">CAGR</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#3B82F6]">{fmtCap(meta.final_capital)}€</div>
            <div className="text-xs text-[#FEFEFE]/50">Capital Final</div>
          </div>
        </div>

        {/* Year filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedYear(null)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${!selectedYear ? 'bg-[#F59E0B] text-[#0F172A]' : 'bg-[#1E293B] text-[#FEFEFE]/60 hover:text-[#F59E0B] border border-[#334155]/50'}`}
          >
            Tout
          </button>
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${selectedYear === y ? 'bg-[#F59E0B] text-[#0F172A]' : 'bg-[#1E293B] text-[#FEFEFE]/60 hover:text-[#F59E0B] border border-[#334155]/50'}`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-[#334155]/50 bg-[#1E293B]/50 backdrop-blur-sm"
        >
          <div className="overflow-x-auto max-h-[700px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E293B] z-10">
                <tr className="border-b border-[#334155]/50">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Ticker</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Entrée</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Sortie</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Raison</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Px Entrée</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Px Sortie</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Pnl%</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Mise €</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Pnl €</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Capital</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade: Trade, i: number) => (
                  <motion.tr
                    key={`${trade.t}-${trade.d}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: Math.min(i * 0.005, 0.8) }}
                    className="border-b border-[#334155]/20 hover:bg-[#F59E0B]/5 transition-colors"
                  >
                    <td className="px-3 py-2 text-sm font-medium text-white">{trade.t}</td>
                    <td className="px-3 py-2 text-sm text-[#FEFEFE]/60 whitespace-nowrap">{trade.d}</td>
                    <td className="px-3 py-2 text-sm text-[#FEFEFE]/60 whitespace-nowrap">{trade.ex}</td>
                    <td className="px-3 py-2 text-xs text-[#FEFEFE]/50 max-w-[120px] truncate">{trade.ra}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.pe.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.ps.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right text-sm font-semibold ${trade.s === 'win' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      <span className="flex items-center justify-end space-x-1">
                        {trade.s === 'win' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        <span>{fmt(trade.pp)}%</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.me.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right text-sm font-semibold ${trade.peur > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{fmt(trade.peur)}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.ca.toFixed(2)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="text-xs text-[#FEFEFE]/30 text-center mt-4">
          * Les performances passées ne préjugent pas des résultats futurs. Le trading comporte des risques.
        </p>
      </div>
    </main>
  )
}
