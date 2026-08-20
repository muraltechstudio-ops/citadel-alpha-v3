import { NextResponse } from "next/server"
import yahooFinance from "yahoo-finance2"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")

    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    const quote = await yahooFinance.quote(ticker) as any

    return NextResponse.json({
      price: quote?.regularMarketPrice ?? 0,
      change: quote?.regularMarketChangePercent ?? 0,
      currency: quote?.currency ?? "USD"
    })
  } catch (error) {
    console.error("Stock price error:", error)
    return NextResponse.json({ price: 0, change: 0, currency: "USD" })
  }
}
