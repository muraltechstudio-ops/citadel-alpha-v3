const TICKERS = [
  "NVDA", "AAPL", "MSFT", "AMZN", "GOOGL",
  "META", "AVGO", "AMD", "TSLA", "LLY",
  "UNH", "V", "MA", "NFLX", "COST",
  "MU", "LRCX", "WDC", "STX", "GE",
  "JPM", "XOM", "CVX", "CAT", "DIS",
]

export async function calculateMomentum() {
  const results: Array<{ ticker: string; momentum12m: number; price: number }> = []
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY

  if (!apiKey) {
    throw new Error("ALPHA_VANTAGE_API_KEY manquante")
  }

  // Appels en parallèle par lots de 5 (rate limit: 5/min)
  // Attendre 70s entre chaque lot pour respecter le quota
  for (let i = 0; i < TICKERS.length; i += 5) {
    const batch = TICKERS.slice(i, i + 5)

    const batchResults = await Promise.all(
      batch.map(async (ticker) => {
        try {
          const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`

          const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
          if (!res.ok) return null

          const json: any = await res.json()
          const series = json["Monthly Adjusted Time Series"]
          if (!series) return null

          const dates = Object.keys(series).sort()
          if (dates.length < 2) return null

          const lastDate = dates[dates.length - 1]
          const firstDate = dates[dates.length - 2] // Mois précédent pour 1mo return
          // Ou prendre le mois d'il y a 12 mois
          const twelveMoAgo = dates[0]

          const firstClose = parseFloat(series[twelveMoAgo]["5. adjusted close"])
          const lastClose = parseFloat(series[lastDate]["5. adjusted close"])

          if (isNaN(firstClose) || isNaN(lastClose) || firstClose <= 0) return null

          const momentum = ((lastClose - firstClose) / firstClose) * 100

          if (momentum > 0) {
            return {
              ticker,
              momentum12m: Math.round(momentum * 100) / 100,
              price: Math.round(lastClose * 100) / 100,
            }
          }
        } catch {}
        return null
      })
    )

    for (const r of batchResults) {
      if (r) results.push(r)
    }

    // Wait 65s between batches (5 calls per minute)
    if (i + 5 < TICKERS.length) {
      await new Promise((r) => setTimeout(r, 65000))
    }
  }

  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
