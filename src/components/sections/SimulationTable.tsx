"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Users } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const simulationData = [
  { amount: "3,000€", result: "35,019€", return: "1,067%", roi: "1067%" },
  { amount: "5,000€", result: "58,365€", return: "1,067%", roi: "1067%" },
  { amount: "10,000€", result: "116,730€", return: "1,067%", roi: "1067%" },
  { amount: "20,000€", result: "233,461€", return: "1,067%", roi: "1067%" }
]

export function SimulationTable() {
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
              What If You Invested 10 ans?
            </span>
          </h2>
          <p className="text-xl text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Transform your capital with compound growth over a decade of proven strategy
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
                  <th className="px-8 py-6 text-left text-sm font-semibold text-[#FCD34D]">
                    <div className="flex items-center">
                      <Users size={20} className="mr-2" />
                      Initial Investment
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-[#FCD34D]">
                    After 10 ans
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-[#FCD34D]">
                    Return Rate
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-[#FCD34D]">
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
                    <td className="px-8 py-8">
                      <div className="text-2xl font-bold text-white">{item.amount}</div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center text-[#10B981] font-bold text-2xl">
                        <TrendingUp size={20} className="mr-2" />
                        {item.result}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="text-2xl font-semibold text-[#F59E0B]">{item.return}</div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="text-2xl font-bold text-[#10B981]">{item.roi}</div>
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
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-[#F59E0B]/20 to-[#FCD34D]/20 rounded-full px-8 py-4 border border-[#F59E0B]/30">
            <div className="text-[#FCD34D] font-medium">
              📊 Des données réelles, pas de théorie
            </div>
            <div className="text-[#FCD34D] font-medium">
              ⚡ Tirages au sort indépendants
            </div>
            <div className="text-[#FCD34D] font-medium">
              🎯 Aucune garantie de rendements futurs
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}