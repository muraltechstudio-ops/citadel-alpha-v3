"use client"

import { motion } from 'framer-motion'
import { Shield, Database, TrendingUp, Users, BarChart3, Lock } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const reassurances = [
  {
    icon: Shield,
    title: "7 Ans de Backtest",
    description: "Données S&P500 complètes 2020-2026 sans biais de survie. Chaque trade est simulé dans des conditions de marché réelles, incluant les crises COVID, l'inflation 2022 et la volatilité 2024.",
    color: "text-[#F59E0B]"
  },
  {
    icon: Database,
    title: "Frais Réels Inclus",
    description: "Commissions broker, spread bid-ask et glissement de marché sont déduits de chaque simulation. Pas de chiffres gonflés — ce que vous voyez est ce que vous auriez réellement obtenu.",
    color: "text-[#3B82F6]"
  },
  {
    icon: TrendingUp,
    title: "Surperformance Vérifiée",
    description: "La stratégie bat le S&P 500 sur 6 années sur 7. CAGR 46.1% vs 15.4%. Drawdown max divisé par 2. Ratio Sharpe plus du double. Les chiffres parlent d'eux-mêmes.",
    color: "text-[#10B981]"
  },
  {
    icon: Lock,
    title: "Méthodologie Ouverte",
    description: "Pas de boîte noire. Notre algorithme de momentum est documenté, vérifiable et exécutable par quiconque. Transparence totale sur les règles d'entrée, de sortie et de gestion des risques.",
    color: "text-[#FCD34D]"
  }
]

export function Reassurance() {
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
              Pourquoi Nous Faire Confiance
            </span>
          </h2>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Nous n'avons rien à cacher. Méthodologie transparente, données vérifiables, résultats reproductibles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reassurances.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300 hover:transform hover:scale-[1.02] h-full">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1E293B] mb-4 ${item.color}`}>
                  <item.icon size={24} className="drop-shadow-lg" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#FEFEFE]/60 leading-relaxed">{item.description}</p>
                <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-[#F59E0B]/20 to-[#FCD34D]/20 rounded-2xl p-6 border border-[#F59E0B]/30 backdrop-blur-sm max-w-5xl mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Prêt à Rejoindre les <span className="text-[#F59E0B]">Gagnants</span> ?
              </h3>
              <p className="text-sm text-[#FEFEFE]/70 mb-6">
                Rejoignez les investisseurs qui utilisent notre stratégie quantitative pour battre le marché
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="flex items-center space-x-2 text-xs text-[#FEFEFE]/60">
                  <Shield size={16} className="text-[#10B981]" />
                  <span>Stratégie testée</span>
                </span>
                <span className="flex items-center space-x-2 text-xs text-[#FEFEFE]/60">
                  <TrendingUp size={16} className="text-[#10B981]" />
                  <span>Performance vérifiée</span>
                </span>
                <span className="flex items-center space-x-2 text-xs text-[#FEFEFE]/60">
                  <Database size={16} className="text-[#10B981]" />
                  <span>Données transparentes</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}