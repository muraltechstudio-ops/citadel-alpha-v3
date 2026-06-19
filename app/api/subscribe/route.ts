import { NextResponse } from "next/server"
import { addSubscriber } from "@/lib/kv"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      )
    }

    await addSubscriber(email)

    return NextResponse.json({
      success: true,
      message: "Inscription réussie ! Vous recevrez les signaux chaque mois.",
    })
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}
