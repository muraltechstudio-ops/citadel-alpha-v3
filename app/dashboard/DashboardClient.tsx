"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardClient({ user, profile, currentSignals, previousSignals, history }: any) {
  const router = useRouter()
  const [loadingPortal, setLoadingPortal] = useState(false)

  // States pour Portfolio Tracker (Plan Alpha uniquement)
  const [investedCapital, setInvestedCapital] = useState<number>(10000)
  const [stockPrices, setStockPrices] = useState<Record<string, number>>({})
  const [loadingPrices, setLoadingPrices] = useState(false)

  // Charger le capital investi du localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("citadel_invested_capital")
      if (saved) setInvestedCapital(Number(saved))
    }
  }, [])

  // Sauvegarder le capital investi dans localStorage
  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setInvestedCapital(val)
    if (typeof window !== "undefined") {
      localStorage.setItem("citadel_invested_capital", val.toString())
    }
  }

  // Fetcher les prix des actions pour le portfolio tracker
  useEffect(() => {
    if (profile.plan !== "alpha" || !currentSignals) return

    const fetchPrices = async () => {
      setLoadingPrices(true)
      const prices: Record<string, number> = {}

      for (const pos of currentSignals.positions) {
        try {
          const res = await fetch(`/api/stock-price?ticker=${pos.ticker}`)
          const data = await res.json()
          if (data.price) prices[pos.ticker] = data.price
        } catch (err) {
          console.error(`Erreur fetch prix pour ${pos.ticker}`, err)
        }
      }

      setStockPrices(prices)
      setLoadingPrices(false)
    }

    fetchPrices()
  }, [currentSignals, profile.plan])

  // Fonction d'export CSV
  const handleExportCSV = () => {
    if (!currentSignals) return
    const csvRows = ["Ticker,Secteur,Score Momentum,Allocation (%),Montant (€),Prix ($),Nb Actions"]

    currentSignals.positions.forEach((pos: any) => {
      const montant = investedCapital * (pos.weight / 100)
      const price = stockPrices[pos.ticker] || 0
      const shares = price > 0 ? Math.floor(montant / price) : 0

      csvRows.push(`${pos.ticker},${pos.industry || 'N/A'},${(pos.momentum12m * 100).toFixed(1)},${pos.weight.toFixed(1)},${montant.toFixed(2)},${price.toFixed(2)},${shares}`)
    })

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("download", `citadel_portfolio_${currentSignals.month}.csv`)
    a.click()
  }

  const handleManageSubscription = async () => {
    try {
      setLoadingPortal(true)
      const res = await fetch("/api/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Portal error", error)
    } finally {
      setLoadingPortal(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  let sellTickers: string[] = []
  let buyTickers: string[] = []
  let holdTickers: string[] = []

  if (currentSignals && previousSignals) {
    const currentTickers = currentSignals.positions.map((p: any) => p.ticker)
    const prevTickers = previousSignals.positions.map((p: any) => p.ticker)

    sellTickers = prevTickers.filter((t: string) => !currentTickers.includes(t))
    buyTickers = currentTickers.filter((t: string) => !prevTickers.includes(t))
    holdTickers = currentTickers.filter((t: string) => prevTickers.includes(t))
  } else if (currentSignals) {
    buyTickers = currentSignals.positions.map((p: any) => p.ticker)
  }

  // Format data for chart
  const chartData = history.slice(-24).map((h: any) => ({
    name: h.month,
    capital: h.capital
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR */}
        <div className="w-full lg:w-1/4">
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#FCD34D] rounded-full flex items-center justify-center text-[#0F172A] font-bold text-xl">
                {profile.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white truncate max-w-[150px]">{profile.full_name || "Membre"}</h3>
                <p className="text-sm text-slate-400 truncate max-w-[150px]">{user.email}</p>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-slate-700 rounded-lg p-3 mb-6 flex justify-between items-center">
              <span className="text-sm text-slate-400">Plan actuel</span>
              <span className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold rounded uppercase">
                {profile.plan}
              </span>
            </div>

            <nav className="space-y-2 mb-8">
              <a href="#signaux" className="block px-4 py-2 rounded-lg bg-[#334155]/50 text-white font-medium">
                Signaux du mois
              </a>
              {profile.plan?.toLowerCase() === "alpha" && (
                <a href="#portfolio" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-[#334155]/30 hover:text-white transition-colors flex justify-between items-center">
                  <span>Mon Portfolio</span>
                  <span className="text-[10px] bg-[#F59E0B] text-[#0F172A] font-bold px-1.5 py-0.5 rounded uppercase">Alpha</span>
                </a>
              )}
              <a href="#performance" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-[#334155]/30 hover:text-white transition-colors">
                Performance
              </a>
              <a href="#compte" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-[#334155]/30 hover:text-white transition-colors">
                Mon compte
              </a>
            </nav>

            <div className="space-y-3">
              <button
                onClick={handleManageSubscription}
                disabled={loadingPortal}
                className="w-full py-2 px-4 border border-[#F59E0B] text-[#F59E0B] rounded-lg text-sm font-medium hover:bg-[#F59E0B]/10 transition-colors disabled:opacity-50"
              >
                {loadingPortal ? "Chargement..." : "Gérer mon abonnement"}
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full lg:w-3/4 space-y-8">

          {/* SIGNAUX */}
          <section id="signaux" className="scroll-mt-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Signaux du mois : {currentSignals?.month}</h2>
              {profile.plan === "alpha" && (
                <button className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Télécharger CSV
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {currentSignals?.positions.map((pos: any, idx: number) => {
                const isNew = buyTickers.includes(pos.ticker)
                return (
                  <div key={idx} className={`bg-[#1E293B] border ${isNew ? 'border-[#10B981]' : 'border-slate-800'} rounded-xl p-4 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xl font-bold text-white">{pos.ticker}</span>
                      {isNew && <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1 line-clamp-1">{pos.industry || 'Tech'}</div>
                      <div className="flex justify-between items-end">
                        <span className={`font-bold ${pos.momentum12m > 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                          {(pos.momentum12m * 100).toFixed(1)}%
                        </span>
                        <span className="text-sm font-medium text-slate-300">{pos.weight.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Ce que vous devez faire :</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-500 text-sm">🔴</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">VENDRE :</span>
                    <p className="text-slate-400 mt-1">{sellTickers.length > 0 ? sellTickers.join(' • ') : "Aucune position à vendre ce mois-ci."}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#10B981] text-sm">🟢</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">ACHETER :</span>
                    <p className="text-slate-400 mt-1">{buyTickers.length > 0 ? buyTickers.join(' • ') : "Aucune nouvelle position à acheter."}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-slate-400 text-sm">⚪</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">CONSERVER :</span>
                    <p className="text-slate-400 mt-1">{holdTickers.length > 0 ? holdTickers.join(' • ') : "Aucune position à conserver."}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PORTFOLIO TRACKER (ALPHA) */}
          {profile.plan?.toLowerCase() === "alpha" && (
            <section id="portfolio" className="scroll-mt-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Portfolio Tracker
                  <span className="text-xs bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] px-2 py-1 rounded uppercase tracking-wider">Alpha</span>
                </h2>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Exporter CSV
                </button>
              </div>

              <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 mb-8">
                <div className="mb-6 max-w-sm">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Mon capital investi (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={investedCapital}
                      onChange={handleCapitalChange}
                      placeholder="Ex: 5000"
                      className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-[#F59E0B] transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Le tracker calcule automatiquement le nombre d'actions à acheter.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#334155]/50 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3 font-medium">Position</th>
                        <th className="px-4 py-3 font-medium text-right">Allocation</th>
                        <th className="px-4 py-3 font-medium text-right">Montant Investi</th>
                        <th className="px-4 py-3 font-medium text-right">Prix Actuel</th>
                        <th className="px-4 py-3 font-medium text-right">Nb Actions</th>
                        <th className="px-4 py-3 font-medium text-right text-[#F59E0B]">Valeur Actuelle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {currentSignals?.positions.map((pos: any, idx: number) => {
                        const montant = investedCapital * (pos.weight / 100)
                        const price = stockPrices[pos.ticker] || 0
                        const shares = price > 0 ? Math.floor(montant / price) : 0
                        const valeurActuelle = shares * price

                        return (
                          <tr key={idx} className="hover:bg-[#334155]/20 transition-colors">
                            <td className="px-4 py-4">
                              <div className="font-bold text-white">{pos.ticker}</div>
                              <div className="text-xs text-slate-400">{pos.industry || 'Tech'}</div>
                            </td>
                            <td className="px-4 py-4 text-right text-slate-300">{pos.weight.toFixed(0)}%</td>
                            <td className="px-4 py-4 text-right text-slate-300">
                              {montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </td>
                            <td className="px-4 py-4 text-right text-slate-300">
                              {loadingPrices ? (
                                <span className="animate-pulse">...</span>
                              ) : (
                                price > 0 ? price.toFixed(2) : '-'
                              )}
                            </td>
                            <td className="px-4 py-4 text-right text-white font-medium">{shares}</td>
                            <td className="px-4 py-4 text-right font-bold text-[#F59E0B]">
                              {valeurActuelle > 0 ? valeurActuelle.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Capital Initial Total</div>
                    <div className="text-xl font-bold text-white">
                      {investedCapital.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Valeur Actuelle (Estimée)</div>
                    <div className="text-xl font-bold text-[#F59E0B]">
                      {(() => {
                        const valTotal = currentSignals?.positions.reduce((acc: number, pos: any) => {
                          const montant = investedCapital * (pos.weight / 100)
                          const price = stockPrices[pos.ticker] || 0
                          const shares = price > 0 ? Math.floor(montant / price) : 0
                          return acc + (shares * price)
                        }, 0) || 0
                        return valTotal > 0 ? valTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Performance (Brute)</div>
                    {(() => {
                      const valTotal = currentSignals?.positions.reduce((acc: number, pos: any) => {
                        const montant = investedCapital * (pos.weight / 100)
                        const price = stockPrices[pos.ticker] || 0
                        const shares = price > 0 ? Math.floor(montant / price) : 0
                        return acc + (shares * price)
                      }, 0) || 0

                      const diff = valTotal - investedCapital
                      const pct = investedCapital > 0 ? (diff / investedCapital) * 100 : 0

                      if (valTotal === 0) return <div className="text-xl font-bold text-slate-500">-</div>

                      return (
                        <div className={`text-xl font-bold ${diff >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                          {diff > 0 ? '+' : ''}{diff.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} ({pct > 0 ? '+' : ''}{pct.toFixed(2)}%)
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PERFORMANCE */}
          <section id="performance" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6">Performance de l'algorithme</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">CAGR</div>
                <div className="text-2xl font-bold text-[#F59E0B]">33.9%</div>
              </div>
              <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Drawdown Max</div>
                <div className="text-2xl font-bold text-[#10B981]">-24.3%</div>
              </div>
              <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Capital Actuel (Base 10k)</div>
                <div className="text-2xl font-bold text-white">
                  {currentSignals?.capital.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 h-[400px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#F59E0B' }}
                    formatter={(value: any) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value)), 'Capital']}
                  />
                  <Line type="monotone" dataKey="capital" stroke="#F59E0B" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#F59E0B' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#334155]/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Mois</th>
                    <th className="px-6 py-4 font-medium text-right">Performance</th>
                    <th className="px-6 py-4 font-medium text-right">Drawdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.slice(-6).reverse().map((h: any, i: number) => (
                    <tr key={i} className="hover:bg-[#334155]/20 transition-colors">
                      <td className="px-6 py-4 text-white">{h.month}</td>
                      <td className={`px-6 py-4 text-right font-medium ${h.return_pct >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                        {h.return_pct > 0 ? '+' : ''}{h.return_pct.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400">
                        {h.drawdown.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* COMPTE */}
          <section id="compte" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6">Mon compte</h2>
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Plan actuel</h3>
                  <div className="text-xl font-bold text-white uppercase">{profile.plan}</div>
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profile.subscription_status}
                    </span>
                  </div>
                  {profile.subscription_end_date && (
                    <div className="text-sm text-slate-400 mt-2">
                      Renouvellement le : {new Date(profile.subscription_end_date).toLocaleDateString("fr-FR")}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-3">
                  {profile.plan === "starter" && (
                    <Link href="/tarifs" className="w-full py-3 px-4 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#0F172A] rounded-lg text-sm font-bold text-center hover:opacity-90 transition-opacity">
                      Passer au plan ALPHA
                    </Link>
                  )}
                  <button
                    onClick={handleManageSubscription}
                    disabled={loadingPortal}
                    className="w-full py-3 px-4 bg-[#334155] text-white rounded-lg text-sm font-medium hover:bg-[#475569] transition-colors disabled:opacity-50"
                  >
                    Gérer la facturation sur Stripe
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
