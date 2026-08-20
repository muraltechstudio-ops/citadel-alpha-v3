import fs from "fs"
import path from "path"

export type Position = {
  ticker: string
  price: number
  momentum12m: number
  weight: number
  shares?: number
  value?: number
  industry?: string
}

export type SignalMonth = {
  month: string
  positions: Position[]
  capital: number
  return_pct: number
  return_eur: number
  drawdown: number
}

function getJsonData() {
  try {
    const filePath = path.join(process.cwd(), "dm_final_v2_results.json")
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    return data
  } catch (error) {
    console.error("Erreur lecture dm_final_v2_results.json:", error)
    return null
  }
}

export async function getSignalsHistory(): Promise<SignalMonth[]> {
  const data = getJsonData()
  if (!data || !data.monthly_details) return []
  return data.monthly_details
}

export async function getCurrentSignals(): Promise<SignalMonth | null> {
  const data = getJsonData()
  if (!data || !data.monthly_details || data.monthly_details.length === 0) {
    return null
  }
  // Le dernier élément du tableau
  return data.monthly_details[data.monthly_details.length - 1]
}
