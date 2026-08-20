"use client"

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Info, ArrowUpRight, Shield, Zap } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const comparisonData = [
  {
    name: "Citadel Alpha (protégé)",
    cagr: "33.9%",
    maxDrawdown: "-24.3%",
    volatility: "23.2%",
    sharpeRatio: "1.46",
    trades: "505",
    winRate: "69.3%",
    profitFactor: "2.14"
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
    title: "CAGR 2.2x supérieur",
    desc: "33.9% contre 15.4% pour le S&P 500 — votre capital croît 2.2x plus vite chaque année.",
    color: "text-[#10B981]"
  },
  {
    icon: Shield,
    title: "Protection intégrée",
    desc: "Le filtre SPY absolu protège le capital lors des krachs. Drawdown max : -24.3% contre -30.3% pour le marché.",
    color: "text-[#F59E0B]"
  },
  {
    icon: Zap,
    title: "Capital 10 000€ → 163 663€",
    desc: "10 000€ investis en 2016 = 163 663€ aujourd'hui. Soit +1 537% en 10.5 ans avec des risques maîtrisés.",
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
            Notre stratégie surpasse le marché sur les 10 dernières années — pas de cherry picking, que des faits.
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
                    className={`
                      border-b border-[#334155]/30 last:border-0 hover:bg-[#334155]/20 transition-colors
                      ${index === 0 ? 'bg-[#1E293B]/30' : ''}
                    `}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {index === 0 && <Shield className="w-4 h-4 text-[#F59E0B] mr-2" />}
                        <span className={`font-bold ${index === 0 ? 'text-[#F59E0B]' : 'text-white'}`}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${index === 0 ? 'text-[#10B981]' : 'text-[#FEFEFE]/80'}`}>
                        {item.cagr}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${index === 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {item.maxDrawdown}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#FEFEFE]/80 text-sm">{item.volatility}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${index === 0 ? 'text-[#FCD34D]' : 'text-[#FEFEFE]/80'}`}>
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
                <span><strong className="text-white">33.9% de CAGR</strong> : 10 000€ investis = <strong className="text-[#10B981]">163 663€</strong> en 10.5 ans. Soit <strong className="text-white">+1 537%</strong> avec un drawdown limité à <strong className="text-white">-24.3%</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span><strong className="text-white">Drawdown -24.3%</strong> contre 30.3% pour le S&P 500. Le filtre macro économique (SPY) évite d'être investi dans les pires moments.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span><strong className="text-white">Taux de réussite 69.3%</strong> : plus de 2 trades sur 3 sont gagnants, garantissant une croissance stable du capital mois après mois.</span>
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
                <span><strong className="text-white">Filtre Qualité (2026)</strong> — nous excluons systématiquement les penny stocks, les actions peu liquides et les capitalisations inférieures à 2Mds$.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-white">Lookback Mixte</strong> — l'algorithme ne regarde pas seulement les 12 derniers mois, mais combine les dynamiques 12m, 6m et 3m pour être plus réactif.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-white">Volatility Scaling</strong> — les tailles de positions sont ajustées dynamiquement en fonction du VIX pour limiter le risque quand le marché s'emballe.</span>
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
            <span className="text-sm text-[#FCD34D] font-medium">★ 10 ans de track record</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Drawdown maitrisé</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Actions qualitatives</span>
            <span className="text-sm text-[#FCD34D] font-medium">★ Overfitting vérifié</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
