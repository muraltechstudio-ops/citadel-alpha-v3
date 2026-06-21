"use client"

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CGUPage() {
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
              Conditions Générales d'Utilisation
            </span>
          </h1>

          <div className="space-y-8 text-[#FEFEFE]/70 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Préambule</h2>
              <p>Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») régissent l'accès et l'utilisation du site internet <strong className="text-white">citadel-alpha.com</strong> (ci-après le « Site ») édité par <strong className="text-white">Open Crest LLC</strong>, société à responsabilité limitée immatriculée sous le numéro 0008094299, EIN 38-4394129, dont le siège social est situé au 1704 Llano St, Ste B-1474, Santa Fe, NM 87505, États-Unis.</p>
              <p className="mt-3">En accédant au Site, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Objet du Site</h2>
              <p>Le Site a pour objet de fournir des informations sur une stratégie de trading quantitative (Dual Momentum) et de proposer un service de signaux de trading mensuels. Les contenus publiés le sont à titre informatif et éducatif uniquement. Ils ne constituent en aucun cas un conseil en investissement personnalisé, une recommandation d'achat ou de vente d'actifs financiers, ni une sollicitation à investir.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Risques financiers</h2>
              <p>Le trading et l'investissement dans les marchés financiers comportent des risques élevés, y compris la perte partielle ou totale du capital investi. Les performances passées présentées sur le Site ne préjugent en aucun cas des résultats futurs. Les stratégies de trading présentées peuvent ne pas convenir à tous les profils d'investisseurs.</p>
              <p className="mt-3">Vous reconnaissez être pleinement informé des risques et acceptez de ne pas tenir Open Crest LLC, ses dirigeants, employés ou partenaires responsables des pertes ou dommages directs ou indirects résultant de l'utilisation des informations fournies sur le Site.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Abonnement aux signaux</h2>
              <p>L'accès aux signaux de trading mensuels est soumis à un abonnement payant dont les modalités (durée, prix, conditions de résiliation) sont précisées sur la page Tarifs du Site.</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>L'abonnement est souscrit pour une durée d'un mois, renouvelable par tacite reconduction.</li>
                <li>Le client peut résilier son abonnement à tout moment. La résiliation prend effet à la fin de la période en cours.</li>
                <li>Les frais d'abonnement sont facturés mensuellement et ne sont pas remboursables, sauf disposition légale contraire.</li>
                <li>Tout défaut de paiement entraîne la suspension immédiate de l'accès aux signaux.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Propriété intellectuelle</h2>
              <p>L'ensemble des contenus du Site (textes, graphismes, logos, données chiffrées, algorithmes, stratégies de trading, code source) est protégé par les lois sur la propriété intellectuelle et est la propriété exclusive d'Open Crest LLC.</p>
              <p className="mt-3">Toute reproduction, représentation, modification, distribution ou exploitation, totale ou partielle, des contenus du Site sans autorisation écrite préalable d'Open Crest LLC est strictement interdite et pourra faire l'objet de poursuites judiciaires.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Données personnelles</h2>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation américaine applicable, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles.</p>
              <p className="mt-3">Les données collectées (nom, adresse email) sont utilisées uniquement dans le cadre de la fourniture des services proposés sur le Site. Elles ne sont jamais cédées à des tiers. Vous pouvez exercer vos droits à tout moment en nous contactant à <a href="mailto:contact@citadel-alpha.com" className="text-[#F59E0B] hover:underline">contact@citadel-alpha.com</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Responsabilité</h2>
              <p>Open Crest LLC s'efforce de fournir des informations exactes et à jour, mais ne peut garantir l'exhaustivité, l'exactitude ou l'actualité des contenus publiés. Le Site peut contenir des liens vers des sites tiers sur lesquels Open Crest LLC n'a aucun contrôle.</p>
              <p className="mt-3">Open Crest LLC ne pourra être tenue responsable :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Des dommages directs ou indirects résultant de l'utilisation du Site</li>
                <li>Des interruptions temporaires ou permanentes du service</li>
                <li>Des pertes financières résultant de l'application des stratégies présentées</li>
                <li>Des erreurs ou omissions dans les données fournies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Litiges et droit applicable</h2>
              <p>Les présentes CGU sont régies par le droit de l'État du Nouveau-Mexique, États-Unis d'Amérique, sans préjudice des dispositions impératives du droit européen applicables à la protection des données personnelles.</p>
              <p className="mt-3">Tout litige relatif à l'interprétation ou à l'exécution des présentes CGU relève de la compétence exclusive des tribunaux de Santa Fe, Nouveau-Mexique, sauf disposition légale contraire.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Modification des CGU</h2>
              <p>Open Crest LLC se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le Site. Il vous incombe de consulter régulièrement les CGU. En cas de modification substantielle, les utilisateurs abonnés en seront informés par email.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Contact</h2>
              <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter à :</p>
              <p className="mt-2">
                Open Crest LLC<br />
                1704 Llano St, Ste B-1474<br />
                Santa Fe, NM 87505, USA<br />
                Email : <a href="mailto:contact@citadel-alpha.com" className="text-[#F59E0B] hover:underline">contact@citadel-alpha.com</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[#334155]/30 text-center">
            <p className="text-sm text-[#FEFEFE]/40">Dernière mise à jour : Juin 2026</p>
            <p className="text-sm text-[#FEFEFE]/40 mt-1">&copy; 2026 Open Crest LLC. Tous droits réservés.</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
