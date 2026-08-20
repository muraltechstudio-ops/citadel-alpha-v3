"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Users } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const simulationData = [
  { amount: "10 000€", result: "163 663€", return: "+1 537%", roi: "1537%" },
  { amount: "20 000€", result: "327 326€", return: "+1 537%", roi: "1537%" },
  { amount: "50 000€", result: "818 315€", return: "+1 537%", roi: "1537%" },
  { amount: "100 000€", result: "1 636 630€", return: "+1 537%", roi: "1537%" }
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
              Simulation sur 10.5 Ans
            </span>
          </h2>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Transformez votre capital avec la croissance composée de notre stratégie sur les 10 dernières années (Jan. 2016 - Août 2026)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="overflow-hidden rounded-2xl border border-[#334155]/50 bg-[#1E293B]/50 backdrop-blur-sm max-w-4xl mx-auto"
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
                    Après 10.5 Ans
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
                    className="border-b border-[#334155]/30 last:border-0 hover:bg-[#334155]/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-[#FEFEFE] font-medium">{item.amount}</td>
                    <td className="px-6 py-4 text-xl font-bold text-[#F59E0B]">
                      {item.result}
                    </td>
                    <td className="px-6 py-4 text-[#10B981] font-semibold">{item.return}</td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#10B981]/20 text-[#10B981]">
                        <TrendingUp size={12} className="mr-1" />
                        {item.roi}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
