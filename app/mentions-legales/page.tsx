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
              <p className="mb-2">
                <strong className="text-white">Open Crest LLC</strong><br />
                Société à responsabilité limitée<br />
                1704 Llano St, Ste B-1474<br />
                Santa Fe, NM 87505<br />
                États-Unis
              </p>
              <p>
                Company Number : <strong className="text-white">0008094299</strong><br />
                EIN : <strong className="text-white">38-4394129</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Directeur de la publication</h2>
              <p><strong className="text-white">Cyril Rancurel</strong></p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
              <p>Email : <a href="mailto:contact@citadel-alpha.com" className="text-[#F59E0B] hover:underline">contact@citadel-alpha.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Hébergement</h2>
              <p>
                Le site est hébergé par :<br />
                <strong className="text-white">Vercel Inc.</strong><br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                États-Unis<br />
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#F59E0B] hover:underline">https://vercel.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Propriété intellectuelle</h2>
              <p>L&apos;ensemble des contenus du site (textes, graphismes, logos, données chiffrées, algorithmes) est la propriété exclusive d&apos;Open Crest LLC. Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite et sanctionnée par les dispositions du Code de la Propriété Intellectuelle.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Risques et limitation de responsabilité</h2>
              <p>Les informations fournies sur ce site le sont à titre indicatif uniquement et ne constituent en aucun cas un conseil en investissement personnalisé. Le trading et l&apos;investissement comportent des risques financiers importants, y compris la perte partielle ou totale du capital investi. Les performances passées ne préjugent pas des résultats futurs. Open Crest LLC ne saurait être tenu responsable des pertes ou dommages directs ou indirects résultant de l&apos;utilisation des informations présentées sur ce site.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Données personnelles (RGPD)</h2>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables, vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez également vous opposer au traitement de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@citadel-alpha.com" className="text-[#F59E0B] hover:underline">contact@citadel-alpha.com</a>. Les données collectées via le formulaire d&apos;abonnement sont utilisées uniquement pour l&apos;envoi des signaux de trading et ne sont jamais cédées à des tiers.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Droit applicable</h2>
              <p>Les présentes mentions légales sont régies par le droit de l&apos;État du Nouveau-Mexique, États-Unis, et par le droit européen en ce qui concerne la protection des données personnelles. Tout litige relève des tribunaux compétents de Santa Fe, Nouveau-Mexique.</p>
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
