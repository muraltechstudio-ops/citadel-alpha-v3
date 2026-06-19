"use client"

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
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
              Blog
            </span>
          </h1>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            Analyses, actualités et insights sur le trading quantitatif
          </p>
        </motion.div>

        <div className="text-center py-12">
          <p className="text-[#FEFEFE]/40">Articles à venir...</p>
        </div>
      </div>
    </main>
  )
}