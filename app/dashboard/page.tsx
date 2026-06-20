"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowLeft, Calendar, BarChart3, Mail, Check, Loader2 } from "lucide-react"
import Link from "next/link"

interface Signal {
  ticker: string
  momentum12m: number
  price: number
}

interface SignalPayload {
  month: string
  generatedAt: string
  tickers: Signal[]
}

export default function DashboardPage() {
  const [currentSignal, setCurrentSignal] = useState<SignalPayload | null>(null)
  const [history, setHistory] = useState<SignalPayload[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [subscribeMessage, setSubscribeMessage] = useState("")

  useEffect(() => {
    fetch("/api/signals")
      .then((res) => res.json())
      .then((data) => {
        setCurrentSignal(data.current)
        setHistory(data.history || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribeStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubscribeStatus("success")
        setSubscribeMessage(data.message)
        setEmail("")
      } else {
        setSubscribeStatus("error")
        setSubscribeMessage(data.error || "Erreur")
      }
    } catch {
      setSubscribeStatus("error")
      setSubscribeMessage("Erreur de connexion")
    }
  }

  return (
    <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#F59E0B] hover:text-[#FCD34D] transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Dashboard Signaux
            </span>
          </h1>
          <p className="text-lg text-[#FEFEFE]/60">
            Signaux mensuels de la stratégie Dual Momentum
          </p>
        </motion.div>

        {/* Subscribe form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-r from-[#F59E0B]/10 to-[#FCD34D]/10 border border-[#F59E0B]/30 rounded-2xl p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Recevoir les signaux par email</h3>
              <p className="text-sm text-[#FEFEFE]/60">Gratuit — un email par mois avec le top 5 des tickers</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="px-4 py-3 bg-[#0F172A] border border-[#334155]/50 rounded-xl text-white text-sm min-w-[240px] focus:border-[#F59E0B]/50 outline-none"
              />
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#0F172A] font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
              >
                {subscribeStatus === "loading" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Mail size={18} />
                )}
                <span>S'abonner</span>
              </button>
            </form>
          </div>
          {subscribeStatus === "success" && (
            <div className="mt-3 flex items-center space-x-2 text-[#10B981] text-sm">
              <Check size={16} />
              <span>{subscribeMessage}</span>
            </div>
          )}
          {subscribeStatus === "error" && (
            <p className="mt-3 text-[#EF4444] text-sm">{subscribeMessage}</p>
          )}
        </motion.div>

        {/* Current signal */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-[#F59E0B]">Chargement des signaux...</div>
          </div>
        ) : currentSignal ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1E293B]/50 border border-[#F59E0B]/30 rounded-2xl p-8 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-[#F59E0B]" />
                <h2 className="text-xl font-bold text-white">Signal en cours</h2>
              </div>
              <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-sm font-medium px-4 py-1.5 rounded-full">
                {currentSignal.month}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {currentSignal.tickers.map((ticker, i) => (
                <div
                  key={i}
                  className="bg-[#0F172A] border border-[#334155]/50 rounded-xl p-5 text-center hover:border-[#F59E0B]/30 transition-all"
                >
                  <div className="text-2xl font-black text-white mb-1">{ticker.ticker}</div>
                  <div className={`text-sm font-semibold ${ticker.momentum12m > 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {ticker.momentum12m > 0 ? "+" : ""}{ticker.momentum12m.toFixed(1)}%
                  </div>
                  <div className="text-xs text-[#FEFEFE]/50 mt-1">{ticker.price.toFixed(2)}$</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-2xl p-12 text-center mb-12">
            <p className="text-[#FEFEFE]/50 text-lg mb-2">Aucun signal pour le moment</p>
            <p className="text-[#FEFEFE]/30 text-sm">Le prochain signal sera généré le 2 du mois prochain</p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart3 size={20} className="text-[#F59E0B] mr-3" />
              Historique des signaux
            </h2>

            <div className="space-y-4">
              {history.map((signal, i) => (
                <div
                  key={i}
                  className="bg-[#1E293B]/30 border border-[#334155]/50 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#FCD34D]">{signal.month}</span>
                    <span className="text-xs text-[#FEFEFE]/40">
                      {new Date(signal.generatedAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {signal.tickers.map((t, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center space-x-2 bg-[#0F172A] border border-[#334155]/50 rounded-lg px-3 py-1.5 text-sm"
                      >
                        <span className="font-bold text-white">{t.ticker}</span>
                        <span className={t.momentum12m > 0 ? "text-[#10B981]" : "text-[#EF4444]"}>
                          {t.momentum12m > 0 ? "+" : ""}{t.momentum12m.toFixed(1)}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
