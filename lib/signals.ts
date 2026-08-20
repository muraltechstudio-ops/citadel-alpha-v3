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

async function getJsonData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/dm_final_v2_results.json`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Erreur lecture dm_final_v2_results.json via fetch:", error)
    return null
  }
}

export async function getSignalsHistory(): Promise<SignalMonth[]> {
  const data = await getJsonData()
  if (!data || !data.monthly_details) return []
  return data.monthly_details
}

export async function getCurrentSignals(): Promise<SignalMonth | null> {
  const data = await getJsonData()
  if (!data || !data.monthly_details || data.monthly_details.length === 0) {
    return null
  }
  // Le dernier élément du tableau
  return data.monthly_details[data.monthly_details.length - 1]
}
