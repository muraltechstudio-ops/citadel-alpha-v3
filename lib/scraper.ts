const TICKERS = [
  "NVDA", "AAPL", "MSFT", "AMZN", "GOOGL",
  "META", "AVGO", "AMD", "TSLA", "LLY",
  "UNH", "V", "MA", "NFLX", "COST",
  "MU", "LRCX", "WDC", "STX", "GE",
  "JPM", "XOM", "CVX", "CAT", "DIS",
]

const CACHE: Map<string, { price: number; date: string }> = new Map()

async function fetchTwelveData(ticker: string): Promise<{ firstClose: number; lastClose: number } | null> {
  const apiKey = process.env.TWELVEDATA_API_KEY
  if (!apiKey) throw new Error("TWELVEDATA_API_KEY manquante")

  const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1month&outputsize=13&apikey=${apiKey}`

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) return null

  const json: any = await res.json()
  const values: any[] = json?.values ?? []
  if (values.length < 2) return null

  // First = 12 months ago, Last = most recent
  const last = values[0]
  const first = values[values.length - 1]

  const lastClose = parseFloat(last.close)
  const firstClose = parseFloat(first.close)

  if (isNaN(firstClose) || isNaN(lastClose) || firstClose <= 0) return null

  return { firstClose, lastClose }
}

export async function calculateMomentum() {
  const results: Array<{ ticker: string; momentum12m: number; price: number }> = []
  CACHE.clear()

  // Twelve Data: 800 calls/day sur plan gratuit, pas de rate limit agressif
  // On fait tout en parallèle
  const allData = await Promise.all(
    TICKERS.map(async (ticker) => {
      try {
        const data = await fetchTwelveData(ticker)
        if (!data) return null

        const momentum = ((data.lastClose - data.firstClose) / data.firstClose) * 100

        if (momentum > 0) {
          return {
            ticker,
            momentum12m: Math.round(momentum * 100) / 100,
            price: Math.round(data.lastClose * 100) / 100,
          }
        }
      } catch {}
      return null
    })
  )

  for (const r of allData) {
    if (r) results.push(r)
  }

  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
