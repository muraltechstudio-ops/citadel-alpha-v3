"use client"

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MentionsLegalesPage() {
  return (
    <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#F59E0B] hover:text-[#FCD34D] transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Retour à l'accueil
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Mentions Légales
            </span>
          </h1>

          <div className="space-y-8 text-[#FEFEFE]/70 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Éditeur du site</h2>
              <p>Open Crest LLC<br />
              Société à responsabilité limitée<br />
              Contact : contact@citadel-alpha.com</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Propriété intellectuelle</h2>
              <p>L&apos;ensemble des contenus du site (textes, graphismes, logos, données chiffrées) est la propriété exclusive d&apos;Open Crest LLC. Toute reproduction ou utilisation sans autorisation est interdite.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Limitation de responsabilité</h2>
              <p>Les informations fournies sur ce site le sont à titre indicatif uniquement. Le trading comporte des risques financiers importants. Les performances passées ne préjugent pas des résultats futurs. Open Crest LLC ne saurait être tenu responsable des décisions d&apos;investissement prises sur la base de ces informations.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Données personnelles</h2>
              <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à contact@citadel-alpha.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Droit applicable</h2>
              <p>Les présentes mentions légales sont régies par le droit américain et européen. Tout litige relève des tribunaux compétents.</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[#334155]/30 text-center">
            <p className="text-sm text-[#FEFEFE]/40">&copy; 2026 Open Crest LLC. Tous droits réservés.</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}