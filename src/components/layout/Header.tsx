"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Track Record", href: "/track-record" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] border-b border-[#334155]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
                CITADEL
              </span>
              <span className="text-[#FEFEFE]/60 font-light ml-1">ALPHA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#FEFEFE]/70 hover:text-[#F59E0B] transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track-record"
              className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-sm font-bold rounded-lg transition-colors duration-200"
            >
              Accéder à la stratégie
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#FEFEFE] p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#1E293B] border-t border-[#334155]/50">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm text-[#FEFEFE]/70 hover:text-[#F59E0B] transition-colors duration-200 font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track-record"
              onClick={() => setIsOpen(false)}
              className="block text-center px-4 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-sm font-bold rounded-lg transition-colors duration-200"
            >
              Accéder à la stratégie
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}