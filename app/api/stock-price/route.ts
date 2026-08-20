import { NextResponse } from "next/server"
import yahooFinance from "yahoo-finance2"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")

    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    const quote = await yahooFinance.quote(ticker)

    return NextResponse.json({
      price: quote.regularMarketPrice,
      change: quote.regularMarketChangePercent,
      currency: quote.currency
    })
  } catch (error: any) {
    console.error("Erreur yahoo-finance:", error)
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 })
  }
}
