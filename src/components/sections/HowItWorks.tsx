"use client"

import { motion } from 'framer-motion'
import { Target, TrendingUp, RotateCw } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const steps = [
  {
    number: "01",
    title: "Analyse du Momentum Mixte",
    description: "Analyse des données pour identifier les actions avec un momentum constant sur 12, 6 et 3 mois.",
    icon: Target,
    color: "text-[#F59E0B]"
  },
  {
    number: "02",
    title: "Sélection Qualité & Sectorielle",
    description: "Filtres qualitatifs (liquidité/cap) et sélection des 5 meilleures actions en limitant à 1 par secteur.",
    icon: TrendingUp,
    color: "text-[#3B82F6]"
  },
  {
    number: "03",
    title: "Rééquilibrage Mensuel",
    description: "Réallocation de votre portefeuille chaque mois selon les tailles recommandées (volatility scaling).",
    icon: RotateCw,
    color: "text-[#10B981]"
  }
]

export function HowItWorks() {
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
              Comment ça Marche
            </span>
          </h2>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Une approche simple et systématique, soutenue par 10 ans de données de marché et des tests rigoureux
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#10B981] opacity-30 transform -translate-y-1/2"></div>
          <div className="md:hidden absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-[#F59E0B] via-[#FCD34D] to-[#10B981] opacity-30"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300 hover:transform hover:-translate-y-2 md:pl-6 pl-16">
                  <div className="absolute top-6 left-6 md:-top-6 md:left-1/2 md:transform md:-translate-x-1/2 w-12 h-12 rounded-full bg-[#0F172A] border-2 border-[#F59E0B] flex items-center justify-center font-bold text-xl text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] z-20">
                    {step.number}
                  </div>
                  <div className={`md:mt-8 mb-4 ${step.color}`}>
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[#FEFEFE]/60">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
