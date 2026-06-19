"use client"

import { motion } from 'framer-motion'
import { Target, TrendingUp, RotateCw } from 'lucide-react'
import { useScrollAnimation } from '@/lib/animations'

const steps = [
  {
    number: "01",
    title: "Scan Momentum",
    description: "Analyze 5-year historical data to identify stocks with consistent upward momentum",
    icon: Target,
    color: "text-[#F59E0B]"
  },
  {
    number: "02",
    title: "Select Top 2",
    description: "Rank highest momentum stocks and select top 2 performers for portfolio construction",
    icon: TrendingUp,
    color: "text-[#3B82F6]"
  },
  {
    number: "03",
    title: "Monthly Rebalance",
    description: "Reallocate monthly to maintain optimal exposure to winning momentum signals",
    icon: RotateCw,
    color: "text-[#10B981]"
  }
]

export function HowItWorks() {
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
              How It Works
            </span>
          </h2>
          <p className="text-xl text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Simple, systematic approach backed by 10 years of market data and rigorous testing
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#F59E0B] via-[#FCD34D] to-[#10B981] opacity-30"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-8 hover:border-[#F59E0B]/30 transition-all duration-300 hover:transform hover:scale-105">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#0F172A] border-2 border-[#F59E0B] flex items-center justify-center font-bold text-xl text-white">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1E293B] mb-6 ${step.color}`}>
                    <step.icon size={40} className="drop-shadow-lg" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-[#FEFEFE]/70 leading-relaxed">{step.description}</p>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F59E0B]/10 to-transparent rounded-full blur-2xl"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Why This Strategy Works</h3>
            <p className="text-[#FEFEFE]/70 leading-relaxed mb-6">
              Dual Momentum has proven effective across multiple market cycles, capturing upside while managing downside risk through systematic rebalancing and strict entry/exit criteria.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#F59E0B]">97%</div>
                <div className="text-sm text-[#FEFEFE]/60">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F59E0B]">15.2 mois</div>
                <div className="text-sm text-[#FEFEFE]/60">Holding Period</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F59E0B]">3 signaux</div>
                <div className="text-sm text-[#FEFEFE]/60">Filtrage momentum</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}