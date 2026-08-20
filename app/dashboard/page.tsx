import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import { getCurrentSignals, getSignalsHistory } from "@/lib/signals"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // We only allow users with starter or alpha plans
  if (!profile || !["starter", "alpha"].includes(profile.plan)) {
    redirect("/tarifs")
  }

  const currentSignals = await getCurrentSignals()
  const history = await getSignalsHistory()
  const previousSignals = history.length > 1 ? history[history.length - 2] : null

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pt-16">
      <DashboardClient
        user={user}
        profile={profile}
        currentSignals={currentSignals}
        previousSignals={previousSignals}
        history={history}
      />
    </div>
  )
}
