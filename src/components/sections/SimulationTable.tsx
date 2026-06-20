"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Users } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const simulationData = [
  { amount: "3 000€", result: "34 955€", return: "+1 065%", roi: "1065%" },
  { amount: "5 000€", result: "58 258€", return: "+1 065%", roi: "1065%" },
  { amount: "10 000€", result: "116 517€", return: "+1 065%", roi: "1065%" },
  { amount: "20 000€", result: "233 033€", return: "+1 065%", roi: "1065%" }
]

export function SimulationTable() {
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
              Simulation sur 5.3 Ans
            </span>
          </h2>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Transformez votre capital avec la croissance composée d&apos;une stratégie éprouvée sur 5.3 ans (2021-2026)
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2" />
                      Investissement Initial
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">
                    Après 10 Ans
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">
                    Rendement
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FCD34D]">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="border-b border-[#334155]/30 hover:bg-[#F59E0B]/10 transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="text-xl font-bold text-white">{item.amount}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-[#10B981] font-bold text-xl">
                        <TrendingUp size={16} className="mr-2" />
                        {item.result}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xl font-semibold text-[#F59E0B]">{item.return}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xl font-bold text-[#10B981]">{item.roi}</div>
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
          <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-gradient-to-r from-[#F59E0B]/20 to-[#FCD34D]/20 rounded-full px-6 py-3 border border-[#F59E0B]/30">
            <span className="text-sm text-[#FCD34D] font-medium">📊 Données réelles, pas de théorie</span>
            <span className="text-sm text-[#FCD34D] font-medium">⚡ Frais réels inclus</span>
            <span className="text-sm text-[#FCD34D] font-medium">🎯 Aucune garantie de rendements futurs</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}