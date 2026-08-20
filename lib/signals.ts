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
  if (!data || !Array.isArray(data)) return []
  return data.map((item: any) => ({
    month: item.month,
    positions: Array.isArray(item.signal) ? item.signal.map((s: any) => ({
      ticker: s.ticker,
      price: 0,
      momentum12m: s.score,
      weight: s.alloc_weight,
      industry: s.sector,
      return_pct: s.return_pct
    })) : [],
    capital: item.capital,
    return_pct: item.return_pct,
    return_eur: item.return,
    drawdown: item.drawdown
  }))
}

export async function getCurrentSignals(): Promise<SignalMonth | null> {
  const history = await getSignalsHistory()
  if (!history || history.length === 0) return null
  return history[history.length - 1]
}
