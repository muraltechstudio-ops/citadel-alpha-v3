"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile record is handled by a trigger or here if no trigger exists.
      // Assuming no trigger, we manually create it here for safety, though
      // Supabase triggers are better. We rely on the user passing metadata.
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        }
      ]).select()

      router.push("/tarifs")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="font-medium text-[#F59E0B] hover:text-[#FCD34D]">
            Connectez-vous
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1E293B] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-800">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Nom complet
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-md shadow-sm bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] sm:text-sm"
                />
              </div>
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-md shadow-sm bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#0F172A] bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F59E0B] disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
