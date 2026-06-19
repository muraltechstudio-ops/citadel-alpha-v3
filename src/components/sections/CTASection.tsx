"use client"

import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react'

export function CTASection() {
  const benefits = [
    { icon: TrendingUp, text: "Rendements historiquement supérieurs à 20%" },
    { icon: Shield, text: "Gestion des risques éprouvée" },
    { icon: Users, text: "Communauté de traders prospères" }
  ]

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="py-20 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#F59E0B]/30 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 to-[#3B82F6]/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3B82F6]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 bg-[#F59E0B]/20 border border-[#F59E0B]/50 rounded-full px-5 py-2 mb-6">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
                <span className="text-[#F59E0B] text-sm font-medium">
                  Stratégie en ligne maintenant
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Prêt à Transcender le{" "}
                <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
                  Marché ?
                </span>
              </h2>

              <p className="text-lg text-[#FEFEFE]/70 mb-10 max-w-3xl mx-auto leading-relaxed">
                Commencez votre parcours vers des rendements supérieurs dès aujourd&apos;hui. Bénéficiez de la même stratégie quantitative qui a battu le marché pendant plus d&apos;une décennie.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-2 text-[#FEFEFE]/80"
                  >
                    <div className="bg-[#F59E0B]/20 p-1.5 rounded-lg">
                      <benefit.icon size={18} className="text-[#F59E0B]" />
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.a
                  href="/track-record"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="group relative px-10 py-5 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:from-[#FCD34D] hover:to-[#F59E0B] text-[#0F172A] font-bold text-base rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-[#F59E0B]/25"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Accéder à la Stratégie</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.a>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="px-10 py-5 border-2 border-[#FEFEFE]/30 hover:border-[#F59E0B]/50 text-[#FEFEFE] font-semibold text-base rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-[#F59E0B]/10"
                >
                  Télécharger le Rapport
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-12 flex flex-wrap justify-center items-center gap-6 text-[#FEFEFE]/40"
              >
                <span className="flex items-center space-x-2 text-xs">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#F59E0B]/30"></span>
                  <span>10+ ans de données</span>
                  <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#F59E0B]/30"></span>
                </span>
                <span className="flex items-center space-x-2 text-xs">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#F59E0B]/30"></span>
                  <span>Répartition testée</span>
                  <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#F59E0B]/30"></span>
                </span>
                <span className="flex items-center space-x-2 text-xs">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#F59E0B]/30"></span>
                  <span>Audit de code</span>
                  <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#F59E0B]/30"></span>
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}