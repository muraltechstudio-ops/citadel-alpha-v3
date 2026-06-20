"use client"

import { motion } from 'framer-motion'
import { Target, TrendingUp, RotateCw } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const steps = [
  {
    number: "01",
    title: "Analyse du Momentum",
    description: "Analyse des données historiques sur 5 ans pour identifier les actions avec un momentum haussier constant",
    icon: Target,
    color: "text-[#F59E0B]"
  },
  {
    number: "02",
    title: "Sélection Top 2",
    description: "Classement des actions au meilleur momentum et sélection des 2 meilleures pour la construction du portefeuille",
    icon: TrendingUp,
    color: "text-[#3B82F6]"
  },
  {
    number: "03",
    title: "Rééquilibrage Mensuel",
    description: "Réallocation mensuelle pour maintenir une exposition optimale aux signaux de momentum gagnants",
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
            Une approche simple et systématique, soutenue par 5.3 ans de données de marché et des tests rigoureux
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#F59E0B] via-[#FCD34D] to-[#10B981] opacity-30"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#0F172A] border-2 border-[#F59E0B] flex items-center justify-center font-bold text-xl text-white">
                    {step.number}
                  </div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1E293B] mb-4 ${step.color}`}>
                    <step.icon size={32} className="drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-[#FEFEFE]/70 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">Pourquoi Cette Stratégie Fonctionne</h3>
            <p className="text-sm text-[#FEFEFE]/70 leading-relaxed mb-4">
              Le Dual Momentum a prouvé son efficacité à travers plusieurs cycles de marché, capturant la hausse tout en gérant le risque de baisse grâce à un rééquilibrage systématique et des critères d&apos;entrée/sortie stricts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#F59E0B]">97%</div>
                <div className="text-xs text-[#FEFEFE]/60">Taux de Succès</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#F59E0B]">15.2 mois</div>
                <div className="text-xs text-[#FEFEFE]/60">Période de Détention</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#F59E0B]">3 signaux</div>
                <div className="text-xs text-[#FEFEFE]/60">Filtres de Momentum</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}