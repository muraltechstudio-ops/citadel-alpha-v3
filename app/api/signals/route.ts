import { NextResponse } from "next/server"
import { getCurrentSignal, getSignalHistory } from "@/lib/kv"

export async function GET() {
  try {
    const currentSignal = await getCurrentSignal()
    const history = await getSignalHistory()

    return NextResponse.json({
      current: currentSignal,
      history,
    })
  } catch (error) {
    console.error("Signals error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des signaux" },
      { status: 500 }
    )
  }
}
