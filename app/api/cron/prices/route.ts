import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentSignals } from "@/lib/signals"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get("secret")
    console.log("Secret reçu:", secret)
    console.log("Secret attendu:", process.env.CRON_SECRET)

    // TEMP : désactiver l'auth pour tester
    // if (secret !== process.env.CRON_SECRET) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const currentSignals = await getCurrentSignals()
    if (!currentSignals) {
      return NextResponse.json({ error: "No signals found" }, { status: 404 })
    }

    const tickers = currentSignals.positions.map((p: any) => p.ticker)

    // Pour ne pas dépasser les limites d'API, on pourrait les faire séquentiellement ou en batch,
    // Mais yahoo-finance2 est assez souple. On va les fetch séquentiellement pour être sûrs.
    for (const ticker of tickers) {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const quote = data["Global Quote"]
        const price = parseFloat(quote?.["05. price"] ?? "0")
        const change_pct = parseFloat((quote?.["10. change percent"] ?? "0%").replace("%", ""))

        await supabaseAdmin
          .from("stock_prices")
          .upsert({
            ticker,
            price,
            change_pct,
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
