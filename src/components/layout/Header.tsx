"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Track Record", href: "/track-record" },
  { label: "Guide", href: "/guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Tarifs", href: "/tarifs" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setShowDropdown(false)
    router.push("/")
    router.refresh()
  }

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

            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-[#FEFEFE]/70 hover:text-[#F59E0B] transition-colors duration-200 font-medium"
                >
                  Se connecter
                </Link>
                <Link
                  href="/track-record"
                  className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-sm font-bold rounded-lg transition-colors duration-200"
                >
                  Accéder à la stratégie
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:border-[#F59E0B] transition-colors"
                >
                  <User className="text-[#F59E0B] w-5 h-5" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl py-2 flex flex-col">
                    <div className="px-4 py-2 border-b border-slate-700/50 mb-1 truncate">
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="px-4 py-2 text-sm text-white hover:bg-slate-800 transition-colors"
                    >
                      Mon compte
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <Link href="/dashboard" className="text-[#F59E0B]">
                <User size={20} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#FEFEFE]/70 hover:text-[#F59E0B] transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-[#334155]/50 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 text-base font-medium text-[#FEFEFE]/70 hover:text-[#F59E0B] hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="block px-3 py-2 text-base font-medium text-[#FEFEFE]/70 hover:text-[#F59E0B] hover:bg-white/5 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                href="/track-record"
                className="block w-full text-center mt-4 px-4 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-base font-bold rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Accéder à la stratégie
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-white hover:text-[#F59E0B] hover:bg-white/5 rounded-md transition-colors border-t border-slate-800 mt-2 pt-4"
                onClick={() => setIsOpen(false)}
              >
                Mon compte
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-white/5 rounded-md transition-colors"
              >
                Se déconnecter
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
