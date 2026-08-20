"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Activity, BarChart3, DollarSign, Brain, Shield, LineChart } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const stats = [
  {
    label: "CAGR",
    value: "33.9%",
    change: "+19 pts vs SPY",
    icon: BarChart3,
    color: "text-[#F59E0B]"
  },
  {
    label: "Capital Final",
    value: "163 663€",
    change: "+1 537%",
    icon: Activity,
    color: "text-[#3B82F6]"
  },
  {
    label: "Drawdown Max",
    value: "−24.3%",
    change: "Mieux que le SPY",
    icon: TrendingUp,
    color: "text-[#10B981]"
  },
  {
    label: "Win Rate",
    value: "69.3%",
    change: "Sharpe 1.46",
    icon: DollarSign,
    color: "text-[#F59E0B]"
  }
]

export function PerformanceStats() {
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
          <h2 className="text-3xl font-bold text-white mb-4">
            Performances Historiques (2016-2026)
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Basé sur le top 5 des actions S&P 500 avec notre algorithme Dual Momentum.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}>
                  <Icon size={64} />
                </div>
                <p className="text-zinc-400 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 ${stat.color}`}>
                  {stat.change}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* NOUVELLE SECTION PHILOSOPHIE */}
        <div className="border-t border-zinc-800 pt-20 pb-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Notre philosophie</h2>
            <p className="text-xl text-zinc-400">Pas de magie. Juste des mathématiques.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                <Brain className="text-blue-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">📊 Systématique</h3>
              <p className="text-zinc-400 leading-relaxed">
                Zéro émotion. Zéro intuition. Chaque décision est dictée par l'algorithme. La discipline est la clé de la surperformance long terme.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-600/20 flex items-center justify-center mb-6">
                <LineChart className="text-emerald-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">🔬 Transparent</h3>
              <p className="text-zinc-400 leading-relaxed">
                Méthodologie open-source, paramètres publics, track record complet. Vous savez exactement comment fonctionne chaque signal que vous recevez.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-amber-600/20 flex items-center justify-center mb-6">
                <Shield className="text-amber-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">🛡️ Prudent</h3>
              <p className="text-zinc-400 leading-relaxed">
                Le filtre SPY absolu protège le capital en marché baissier. Le filtre sectoriel évite la concentration. 5 positions pour diversifier le risque.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
