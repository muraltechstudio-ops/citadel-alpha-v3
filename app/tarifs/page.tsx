"use client"

import { motion } from 'framer-motion'
import { Check, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const plans = [
  {
    name: "Starter",
    priceIdMonthly: "price_1U6KL36wVHIsqe2mG5IIETak",
    priceIdYearly: "price_1U6Ka26wVHIsqe2mWoGUFreT",
    priceMonthly: "29€",
    priceYearly: "290€",
    period: "/mois",
    description: "L'essentiel pour suivre la stratégie",
    popular: false,
    features: [
      "Signaux mensuels : les 5 actions sélectionnées",
      "Track record complet 10 ans",
      "Alertes email automatiques à chaque rééquilibrage",
      "Accès aux performances historiques",
    ]
  },
  {
    name: "Alpha",
    priceIdMonthly: "price_1U6Kdn6wVHIsqe2mH6nfnget",
    priceIdYearly: "price_1U6Kdn6wVHIsqe2mBjOtWZbq",
    priceMonthly: "49€",
    priceYearly: "399€",
    period: "/mois",
    description: "Pour les investisseurs exigeants",
    popular: true,
    features: [
      "Tout le plan Starter",
      "Score momentum détaillé pour chaque action",
      "Comparaison vs SPY en temps réel",
      "Export CSV des signaux",
      "Accès prioritaire aux nouvelles fonctionnalités",
    ]
  }
]

export default function TarifsPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoadingPriceId(priceId)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Checkout error:", data.error)
        alert("Erreur lors de la redirection vers le paiement.")
      }
    } catch (error) {
      console.error(error)
      alert("Erreur lors de la redirection vers le paiement.")
    } finally {
      setLoadingPriceId(null)
    }
  }

  return (
    <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#F59E0B] hover:text-[#FCD34D] transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Retour à l'accueil
        </Link>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Des tarifs simples et transparents
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Choisissez le plan qui correspond à vos objectifs d'investissement. Sans engagement, annulation à tout moment.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-white font-bold' : 'text-zinc-400'}`}>Mensuel</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white font-bold' : 'text-zinc-400'}`}>
              Annuel <span className="text-[#F59E0B] text-xs font-semibold ml-1">Économisez jusqu'à 2 mois</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const currentPriceId = isAnnual ? plan.priceIdYearly : plan.priceIdMonthly
            const isLoading = loadingPriceId === currentPriceId

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? 'bg-zinc-900 border-2 border-[#F59E0B] shadow-[0_0_30px_rgba(245,158,11,0.15)]'
                    : 'bg-zinc-900 border border-zinc-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#F59E0B] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={14} /> Recommandé
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-400">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline text-white">
                    <span className="text-5xl font-extrabold tracking-tight">
                      {isAnnual ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="ml-1 text-xl font-medium text-zinc-400">
                      {isAnnual ? '/an' : plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-400" />
                      </div>
                      <span className="ml-3 text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 mt-auto">
                  <button
                    onClick={() => handleCheckout(currentPriceId)}
                    disabled={isLoading}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-all disabled:opacity-50 ${
                      plan.popular
                        ? 'bg-[#F59E0B] text-black hover:bg-[#FCD34D]'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                  >
                    {isLoading ? 'Chargement...' : 'Commencer'}
                  </button>
                  <p className="text-xs text-zinc-500 text-center mt-2">
                    14 jours d'essai gratuit — Sans engagement
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-500">
            Les performances passées ne préjugent pas des performances futures.
            Citadel Alpha fournit des signaux algorithmiques à titre informatif uniquement.
            Ce service ne constitue pas un conseil en investissement.
          </p>
        </div>
      </div>
    </main>
  )
}
