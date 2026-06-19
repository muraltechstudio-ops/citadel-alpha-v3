"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Activity, BarChart3, DollarSign } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const stats = [
  {
    label: "CAGR",
    value: "26.37%",
    change: "+11.36%",
    icon: BarChart3,
    color: "text-[#F59E0B]"
  },
  {
    label: "Max Drawdown",
    value: "-14.5%",
    change: "-0.8%",
    icon: Activity,
    color: "text-[#EF4444]"
  },
  {
    label: "Win Rate",
    value: "53.1%",
    change: "+0.1%",
    icon: TrendingUp,
    color: "text-[#10B981]"
  },
  {
    label: "Profit Factor",
    value: "2.57",
    change: "+0.09",
    icon: DollarSign,
    color: "text-[#3B82F6]"
  }
]

export function PerformanceStats() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <div className="py-20 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Performance Benchmarks
            </span>
          </h2>
          <p className="text-xl text-[#FEFEFE]/60 max-w-3xl mx-auto">
            10-year proven track record with consistent outperformance vs SPY benchmark
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-8 hover:border-[#F59E0B]/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1E293B] mb-6 ${stat.color}`}>
                  <stat.icon size={32} className="drop-shadow-lg" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-[#94A3B8] font-medium mb-2">{stat.label}</div>
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