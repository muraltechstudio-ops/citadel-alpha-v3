import { NextResponse } from "next/server"
import { calculateMomentum } from "@/lib/scraper"
import {
  setCurrentSignal,
  pushSignalHistory,
  getSubscribers,
} from "@/lib/kv"
import { sendSignalEmail } from "@/lib/email"

export async function GET(request: Request) {
  // Protect with CRON_SECRET
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")

  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    // 1. Calculate momentum signals
    const signals = await calculateMomentum()

    if (signals.length === 0) {
      return NextResponse.json({
        message: "Aucun signal ce mois-ci (marché baissier)",
        signals: [],
      })
    }

    // 2. Build payload
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    const payload = {
      month,
      generatedAt: now.toISOString(),
      tickers: signals,
    }

    // 3. Store in KV
    await setCurrentSignal(payload)
    await pushSignalHistory(payload)

    // 4. Send emails to subscribers
    const subscribers = await getSubscribers()

    if (subscribers.length > 0) {
      const emailPromises = subscribers.map((email) =>
        sendSignalEmail(email, payload).catch((err) =>
          console.error(`Failed to send email to ${email}:`, err)
        )
      )
      await Promise.allSettled(emailPromises)
    }

    return NextResponse.json({
      success: true,
      month,
      tickers: signals.map((s) => s.ticker),
      emailsSent: subscribers.length,
    })
  } catch (error) {
    console.error("Scrape error:", error)
    return NextResponse.json(
      { error: "Erreur lors du calcul des signaux" },
      { status: 500 }
    )
  }
}
