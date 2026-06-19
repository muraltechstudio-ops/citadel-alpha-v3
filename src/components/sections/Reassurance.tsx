"use client"

import { motion } from 'framer-motion'
import { Shield, Database, TrendingUp, Users } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const reassurances = [
  {
    icon: Shield,
    title: "Backtesté sur 10 ans",
    description: "Données S&P500 complètes 2016-2026 sans biais de survie",
    color: "text-[#F59E0B]"
  },
  {
    icon: Database,
    title: "Glissement réel inclus",
    description: "Commission et glissement réels appliqués pour une précision totale",
    color: "text-[#3B82F6]"
  },
  {
    icon: TrendingUp,
    title: "Rendements vérifiés",
    description: "Performance validée par audit tiers indépendant",
    color: "text-[#10B981]"
  },
  {
    icon: Users,
    title: "Stratégie transparente",
    description: "Méthodologie complète et accessible pour tous les investisseurs",
    color: "text-[#FCD34D]"
  }
]

export function Reassurance() {
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
              Pourquoi Nous Faire Confiance
            </span>
          </h2>
          <p className="text-xl text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Notre engagement envers la transparence et la précision garantit des résultats fiables
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reassurances.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300 hover:transform hover:scale-105 h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1E293B] mb-6 ${item.color}`}>
                  <item.icon size={32} className="drop-shadow-lg" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-[#FEFEFE]/70 leading-relaxed">{item.description}</p>

                {/* Animated border on hover */}
                <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-[#F59E0B]/20 to-[#FCD34D]/20 rounded-2xl p-8 border border-[#F59E0B]/30 backdrop-blur-sm max-w-5xl mx-auto">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                Prêt à Rejoindre les <span className="text-[#F59E0B]">Gagnants</span>
              </h3>
              <p className="text-lg text-[#FEFEFE]/70 mb-8">
                Rejoignez des milliers d'investisseurs utilisant la stratégie quantitative la plus performante
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2 text-[#FEFEFE]/60">
                  <Shield size={20} className="text-[#10B981]" />
                  <span>Strategy testée</span>
                </div>
                <div className="flex items-center space-x-2 text-[#FEFEFE]/60">
                  <TrendingUp size={20} className="text-[#10B981]" />
                  <span>Performance vérifiée</span>
                </div>
                <div className="flex items-center space-x-2 text-[#FEFEFE]/60">
                  <Database size={20} className="text-[#10B981]" />
                  <span>Données transparentes</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}