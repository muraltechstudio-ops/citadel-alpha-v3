import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentSignals } from "@/lib/signals"
import yahooFinance from "yahoo-finance2"

export async function GET(req: Request) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get("authorization")
    const cronKey = process.env.CRON_SECRET

    if (authHeader !== `Bearer ${cronKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentSignals = await getCurrentSignals()
    if (!currentSignals) {
      return NextResponse.json({ error: "No signals found" }, { status: 404 })
    }

    const tickers = currentSignals.positions.map((p: any) => p.ticker)

    // Pour ne pas dépasser les limites d'API, on pourrait les faire séquentiellement ou en batch,
    // Mais yahoo-finance2 est assez souple. On va les fetch séquentiellement pour être sûrs.
    for (const ticker of tickers) {
      try {
        const quote = await yahooFinance.quote(ticker) as any

        await supabaseAdmin
          .from("stock_prices")
          .upsert({
            ticker,
            price: quote?.regularMarketPrice ?? 0,
            change_pct: quote?.regularMarketChangePercent ?? 0,
            updated_at: new Date().toISOString()
          }, { onConflict: "ticker" })

      } catch (e) {
        console.error(`Error fetching price for ${ticker}:`, e)
      }
    }

    return NextResponse.json({ success: true, updatedTickers: tickers.length })
  } catch (error: any) {
    console.error("Cron prices error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
