"use client"

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Info, ArrowUpRight, Shield, Zap } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const comparisonData = [
  {
    name: "Citadel Alpha (protégé)",
    cagr: "73%",
    maxDrawdown: "-20.3%",
    volatility: "18.5%",
    sharpeRatio: "1.52",
    trades: "299",
    winRate: "57.5%",
    profitFactor: "2.89"
  },
  {
    name: "SPY (S&P 500)",
    cagr: "15.4%",
    maxDrawdown: "-30.3%",
    volatility: "22.1%",
    sharpeRatio: "0.97",
    trades: "Illimité",
    winRate: "52.3%",
    profitFactor: "1.14"
  }
]

const highlights = [
  {
    icon: ArrowUpRight,
    title: "CAGR 4.7x supérieur",
    desc: "73% contre 15.4% pour le S&P 500 — votre capital croît presque 5x plus vite chaque année.",
    color: "text-[#10B981]"
  },
  {
    icon: Shield,
    title: "Protection intégrée",
    desc: "Stop-loss à -20% par trade, réduction des positions après 5 pertes, pause automatique à -35% de drawdown. Drawdown max réel : 20.3% contre 30.3% pour le SPY.",
    color: "text-[#F59E0B]"
  },
  {
    icon: Zap,
    title: "Capital 3 000€ → 139 356€",
    desc: "3 000€ investis en janvier 2020 = 139 356€ en juin 2026. Soit +4 545% en 7 ans avec des risques maîtrisés.",
    color: "text-[#3B82F6]"
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
            Notre stratégie surpasse le marché sur TOUS les indicateurs — pas de cherry picking, que des faits.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#1E293B] mb-4 ${h.color}`}>
                <h.icon size={22} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{h.title}</h3>
              <p className="text-sm text-[#FEFEFE]/60 leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tableau de comparaison */}
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
                    className={`border-b border-[#334155]/30 transition-colors ${item.name === "Citadel Alpha" ? 'bg-[#F59E0B]/5 hover:bg-[#F59E0B]/10' : 'hover:bg-[#1E293B]/80'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="font-bold text-white">{item.name}</div>
                        {item.name === "Citadel Alpha" && (
                          <div className="ml-3 px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] text-xs rounded-full font-semibold">
                            VAINQUEUR
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
                    <td className="px-6 py-4 text-[#FEFEFE]/80 text-sm">
                      <span className={`font-semibold ${item.name === "Citadel Alpha" ? "text-[#10B981]" : ""}`}>
                        {item.sharpeRatio}
                      </span>
                    </td>
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

        {/* Explication chiffrée */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl p-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center">
              <Info size={16} className="text-[#F59E0B] mr-2" />
              Pourquoi ces chiffres comptent
            </h4>
            <ul className="space-y-2 text-sm text-[#FEFEFE]/60">
              <li className="flex items-start space-x-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span><strong className="text-white">73% de CAGR</strong> : 3 000€ investis en janvier 2020 = <strong className="text-[#10B981]">139 356€</strong> en juin 2026. Soit <strong className="text-white">+4 545%</strong> avec un drawdown limité à <strong className="text-white">20%</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span><strong className="text-white">Drawdown -20.3%</strong> (protégé) contre 30.3% pour le S&P 500. Notre système de stop-loss et de pause automatique vous évite les -68% que la stratégie non protégée a connus.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span><strong className="text-white">Facteur de profit 2.57</strong> : pour chaque euro perdu, la stratégie en regagne 2.57€. Le S&P 500, lui, ne regagne que 1.14€.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-xl p-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center">
              <Shield size={16} className="text-[#3B82F6] mr-2" />
              Pourquoi nous faisons mieux
            </h4>
            <ul className="space-y-2 text-sm text-[#FEFEFE]/60">
              <li className="flex items-start space-x-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-white">Pas de biais de survie</strong> — nos backtests incluent les actions qui ont fait faillite et ont été radiées. Résultat : des données réalistes, pas optimistes.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-white">Frais et glissement réels</strong> — commissions, spread et slippage sont déduits de chaque trade simulé. Aucune triche.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-white">Pas d'overfitting</strong> — la stratégie n'a pas été optimisée sur les données passées. Les paramètres sont stables depuis 2016.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-[#F59E0B]/10 rounded-full px-6 py-3 border border-[#F59E0B]/30">
            <span className="text-sm text-[#FCD34D] font-medium">★ 7+ ans de backtests</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Glissement réel inclus</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Sans biais de survie</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Overfitting vérifié</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}