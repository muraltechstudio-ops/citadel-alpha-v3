"use client"

import { motion } from 'framer-motion'
import { Check, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: "Essentiel",
    subtitle: "Pour les investisseurs individuels",
    price: "49€",
    period: "/mois",
    description: "Accès complet à la stratégie pour suivre les signaux chaque mois",
    popular: false,
    features: [
      "Signaux de trading mensuels",
      "Track record complet en temps réel",
      "Portefeuille recommandé (Top 2)",
      "Alertes email à chaque rééquilibrage",
      "Accès aux performances historiques",
      "Support email prioritaire"
    ]
  },
  {
    name: "Premium",
    subtitle: "Pour les investisseurs avancés",
    price: "149€",
    period: "/mois",
    description: "Tout l'Essentiel + outils avancés et support dédié",
    popular: true,
    features: [
      "Tout le plan Essentiel",
      "Signaux détaillés avec analyse complète",
      "Analyse personnalisée",
      "Rapport mensuel de performance PDF",
      "API d'accès aux données",
      "Support prioritaire 7j/7",
      "Webinaire mensuel exclusif"
    ]
  }
]

export default function TarifsPage() {
  return (
    <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#F59E0B] hover:text-[#FCD34D] transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[#F59E0B]/20 border border-[#F59E0B]/50 rounded-full px-5 py-2 mb-6">
            <Sparkles size={16} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-sm font-medium">14 jours gratuits</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Nos Tarifs
            </span>
          </h1>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Annulation à tout moment sans frais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative rounded-2xl border ${plan.popular ? 'border-[#F59E0B] bg-[#1E293B]/80' : 'border-[#334155]/50 bg-[#1E293B]/50'} backdrop-blur-sm p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#0F172A] text-xs font-bold px-4 py-1.5 rounded-full">
                  Recommandé
                </div>
              )}

              <div className="text-center mb-8 mt-2">
                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-[#FEFEFE]/50 mb-6">{plan.subtitle}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-lg text-[#FEFEFE]/40 ml-1">{plan.period}</span>
                </div>
                <p className="text-xs text-[#F59E0B] mt-2 font-medium">14 jours gratuits • Sans engagement</p>
                <p className="text-sm text-[#FEFEFE]/50 mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Check size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#FEFEFE]/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                className={`block text-center px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#0F172A] hover:from-[#FCD34D] hover:to-[#F59E0B]'
                    : 'border-2 border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/10'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Commencer l'essai gratuit</span>
                  <ArrowRight size={18} />
                </span>
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* FAQ rapide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <div className="bg-[#1E293B]/30 border border-[#334155]/50 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Questions fréquentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-sm font-semibold text-white mb-1">Puis-je annuler quand je veux ?</p>
                <p className="text-xs text-[#FEFEFE]/50">Oui, sans frais ni pénalité. Vous gardez l'accès jusqu'à la fin de la période payée.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Comment fonctionne l'essai gratuit ?</p>
                <p className="text-xs text-[#FEFEFE]/50">14 jours pour tester la stratégie complète. Aucune carte bancaire requise pour démarrer.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Les performances passées garantissent-elles l'avenir ?</p>
                <p className="text-xs text-[#FEFEFE]/50">Non, les performances passées ne préjugent pas des résultats futurs. Le trading comporte des risques.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Puis-je passer d'Essentiel à Premium ?</p>
                <p className="text-xs text-[#FEFEFE]/50">Oui, à tout moment. La différence est calculée au prorata temporis.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}