"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-[#334155]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
                CITADEL
              </span>
              <span className="text-[#FEFEFE]/60 font-light ml-1">ALPHA</span>
            </Link>
            <p className="mt-4 text-sm text-[#FEFEFE]/50 max-w-sm leading-relaxed">
              Stratégie de trading quantitative sécurisée (2020-2026) : CAGR 80.6%, 299 trades, stop-loss -20%, drawdown max -20%.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-[#FCD34D] uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Accueil</Link></li>
              <li><Link href="/track-record" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Track Record</Link></li>
              <li><Link href="/tarifs" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Tarifs</Link></li>
              <li><Link href="/blog" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Contact</Link></li>
              <li><Link href="/dashboard" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[#FCD34D] uppercase tracking-wider mb-4">Informations</h4>
            <ul className="space-y-3">
              <li><Link href="/mentions-legales" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Mentions Légales</Link></li>
              <li><Link href="/mentions-legales" className="text-sm text-[#FEFEFE]/60 hover:text-[#F59E0B] transition-colors">Politique de Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#334155]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#FEFEFE]/40">
            &copy; 2026 Open Crest LLC. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-2 text-sm text-[#FEFEFE]/30">
            <span>Stratégie quantitative</span>
            <span className="w-1 h-1 bg-[#F59E0B]/50 rounded-full"></span>
            <span>Backtesté sur 10 ans</span>
          </div>
        </div>
      </div>
    </footer>
  )
}