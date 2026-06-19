import { NextResponse } from "next/server"
import { removeSubscriber } from "@/lib/kv"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      )
    }

    await removeSubscriber(email)

    return NextResponse.json({
      success: true,
      message: "Désinscription réussie.",
    })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la désinscription" },
      { status: 500 }
    )
  }
}

// GET for unsubscribe links in emails: /api/unsubscribe?email=x@y.com
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 })
  }

  await removeSubscriber(email)

  return NextResponse.redirect(
    new URL("/?unsubscribed=true", request.url)
  )
}
