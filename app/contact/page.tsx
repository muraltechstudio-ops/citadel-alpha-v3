"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, MapPin, Send, Check, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus("success")
        setStatusMessage("Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.")
        setFormData({ name: "", email: "", message: "" })
      } else {
        const data = await res.json()
        setStatus("error")
        setStatusMessage(data.error || "Erreur lors de l'envoi")
      }
    } catch {
      setStatus("error")
      setStatusMessage("Erreur de connexion. Veuillez réessayer.")
    }
  }

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Contact
            </span>
          </h1>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Une question sur la stratégie, les abonnements ou le fonctionnement ? Écrivez-nous.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-5"
            >
              <Mail size={20} className="text-[#F59E0B] mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Email</h3>
              <a href="mailto:contact@citadel-alpha.com" className="text-sm text-[#F59E0B] hover:underline">
                contact@citadel-alpha.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-5"
            >
              <MapPin size={20} className="text-[#F59E0B] mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Adresse</h3>
              <p className="text-sm text-[#FEFEFE]/60">
                Open Crest LLC<br />
                1704 Llano St, Ste B-1474<br />
                Santa Fe, NM 87505, USA
              </p>
            </motion.div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-8"
            >
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/20 mb-4">
                    <Check size={32} className="text-[#10B981]" />
                  </div>
                  <p className="text-[#10B981] font-medium">{statusMessage}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-sm text-[#F59E0B] hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-[#FEFEFE]/70 mb-2">Nom</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155]/50 rounded-xl text-white focus:border-[#F59E0B]/50 outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#FEFEFE]/70 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155]/50 rounded-xl text-white focus:border-[#F59E0B]/50 outline-none transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#FEFEFE]/70 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155]/50 rounded-xl text-white focus:border-[#F59E0B]/50 outline-none transition-colors resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-[#EF4444]">{statusMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#0F172A] font-bold rounded-xl hover:from-[#FCD34D] hover:to-[#F59E0B] transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Envoyer</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
