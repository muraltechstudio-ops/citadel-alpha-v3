import { NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 })
    }

    const session = await createCheckoutSession(priceId)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
