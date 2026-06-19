"use client"

import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
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
            Une question ? N'hésitez pas à nous contacter
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-2xl p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm text-[#FEFEFE]/70 mb-2">Nom</label>
                <input type="text" className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155]/50 rounded-xl text-white focus:border-[#F59E0B]/50 outline-none transition-colors" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm text-[#FEFEFE]/70 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155]/50 rounded-xl text-white focus:border-[#F59E0B]/50 outline-none transition-colors" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm text-[#FEFEFE]/70 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155]/50 rounded-xl text-white focus:border-[#F59E0B]/50 outline-none transition-colors resize-none" placeholder="Votre message..."></textarea>
              </div>
              <button type="submit" className="w-full px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#0F172A] font-bold rounded-xl hover:from-[#FCD34D] hover:to-[#F59E0B] transition-all duration-300">
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}