"use client"

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const comparisonData = [
  {
    name: "Citadel Alpha",
    cagr: "26.37%",
    maxDrawdown: "-14.5%",
    volatility: "18.7%",
    sharpeRatio: "1.85",
    trades: "192",
    winRate: "53.1%",
    profitFactor: "2.57"
  },
  {
    name: "SPY (S&P 500)",
    cagr: "15.35%",
    maxDrawdown: "-30.3%",
    volatility: "22.1%",
    sharpeRatio: "0.97",
    trades: "Illimité",
    winRate: "52.3%",
    profitFactor: "1.14"
  }
]

export function ComparisonTable() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <div className="py-16 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Performance vs S&P 500
            </span>
          </h2>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Surperformance de la stratégie sur tous les indicateurs clés avec des rendements ajustés au risque supérieurs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="overflow-hidden rounded-2xl border border-[#334155]/50 bg-[#1E293B]/50 backdrop-blur-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#334155]/50 bg-[#1E293B]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">Stratégie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">CAGR</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">Drawdown Max</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">Volatilité</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">Ratio Sharpe</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">Trades</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">Taux Réussite</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">Facteur Profit</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="border-b border-[#334155]/30 hover:bg-[#F59E0B]/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="font-bold text-white">{item.name}</div>
                        {item.name === "Citadel Alpha" && (
                          <div className="ml-3 px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] text-xs rounded-full font-semibold">
                            PREMIER
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-[#10B981] font-semibold">
                        <TrendingUp size={14} className="mr-1.5" />
                        {item.cagr}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-[#EF4444] font-semibold">
                        <TrendingDown size={14} className="mr-1.5" />
                        {item.maxDrawdown}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#FEFEFE]/80 text-sm">{item.volatility}</td>
                    <td className="px-6 py-4 text-[#FEFEFE]/80 text-sm">{item.sharpeRatio}</td>
                    <td className="px-6 py-4 text-[#FEFEFE]/80 text-sm">{item.trades}</td>
                    <td className="px-6 py-4 text-[#FEFEFE]/80 text-sm">{item.winRate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-[#10B981] font-semibold">
                        <TrendingUp size={14} className="mr-1.5" />
                        {item.profitFactor}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-[#F59E0B]/10 rounded-full px-6 py-3 border border-[#F59E0B]/30">
            <span className="text-sm text-[#FCD34D] font-medium">★ 10+ ans de backtests</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Glissement réel inclus</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Sans biais de survie</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}