import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")

    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    const { data: stock, error } = await supabaseAdmin
      .from("stock_prices")
      .select("price, change_pct")
      .eq("ticker", ticker)
      .single()

    if (error || !stock) {
      console.error("Stock price error (Supabase):", error)
      return NextResponse.json({ price: 0, change: 0, currency: "USD" })
    }

    return NextResponse.json({
      price: stock.price ?? 0,
      change: stock.change_pct ?? 0,
      currency: "USD" // Yahoo finance renvoyait souvent USD, pour faire simple on hardcode USD ici pour le tracker
    })
  } catch (error) {
    console.error("Stock price error:", error)
    return NextResponse.json({ price: 0, change: 0, currency: "USD" })
  }
}
