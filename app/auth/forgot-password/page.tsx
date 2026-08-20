"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Entrez votre email pour réinitialiser votre mot de passe
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1E293B] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-800">
          {success ? (
            <div className="text-center">
              <div className="bg-green-500/10 border border-green-500/50 rounded-md p-4 mb-4">
                <p className="text-sm text-green-400">
                  Si un compte existe avec cet email, un lien de réinitialisation vous a été envoyé.
                </p>
              </div>
              <Link href="/auth/login" className="font-medium text-[#F59E0B] hover:text-[#FCD34D]">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleReset}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-md shadow-sm bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/auth/login" className="font-medium text-[#F59E0B] hover:text-[#FCD34D]">
                    Retour à la connexion
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#0F172A] bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F59E0B] disabled:opacity-50"
                >
                  {loading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
