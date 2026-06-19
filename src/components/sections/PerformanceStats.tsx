"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Activity, BarChart3, DollarSign } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const stats = [
  {
    label: "CAGR",
    value: "73%",
    change: "+57 pts vs SPY",
    icon: BarChart3,
    color: "text-[#F59E0B]"
  },
  {
    label: "Capital Final",
    value: "139 356€",
    change: "+4 545%",
    icon: Activity,
    color: "text-[#3B82F6]"
  },
  {
    label: "Drawdown Max",
    value: "−20.3%",
    change: "Protégé",
    icon: TrendingUp,
    color: "text-[#10B981]"
  },
  {
    label: "Trades",
    value: "299",
    change: "172 gagnants",
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Performance
            </span>
          </h2>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Résultats prouvés sur 7 ans (2020-2026) — protections intégrées : stop-loss -20%, drawdown limité à -20%
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1E293B] mb-4 ${stat.color}`}>
                  <stat.icon size={28} className="drop-shadow-lg" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-[#94A3B8] font-medium mb-2">{stat.label}</div>
                <div className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}