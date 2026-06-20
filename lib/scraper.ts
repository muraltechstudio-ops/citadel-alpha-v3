const TICKERS = [
  "NVDA", "AMD", "MU", "AVGO", "LRCX", "KLAC", "WDC", "STX",
  "AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA",
  "UNH", "LLY", "V", "MA", "COST", "WMT",
  "JPM", "BAC", "GS", "MS", "AXP", "BLK",
  "XOM", "CVX", "COP", "EOG", "FCX",
  "CAT", "GE", "BA", "HON", "MMM",
  "PG", "KO", "PEP", "ABBV", "MRK",
  "ADBE", "NFLX", "CRM", "TXN", "QCOM",
  "ISRG", "VRTX", "PANW", "NOW", "BKNG",
]

export async function calculateMomentum() {
  const results: Array<{ ticker: string; momentum12m: number; price: number }> = []
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY

  if (!apiKey) {
    throw new Error("ALPHA_VANTAGE_API_KEY manquante")
  }

  for (const ticker of TICKERS) {
    try {
      // Alpha Vantage: Monthly Adjusted (handles splits correctly)
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`

      const res = await fetch(url, {
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) continue

      const json: any = await res.json()
      const series = json["Monthly Adjusted Time Series"]
      if (!series) continue

      const dates = Object.keys(series).sort()
      if (dates.length < 2) continue

      const firstDate = dates[0]
      const lastDate = dates[dates.length - 1]

      const firstClose = parseFloat(series[firstDate]["5. adjusted close"])
      const lastClose = parseFloat(series[lastDate]["5. adjusted close"])

      if (isNaN(firstClose) || isNaN(lastClose) || firstClose <= 0) continue

      const momentum = ((lastClose - firstClose) / firstClose) * 100

      if (momentum > 0) {
        results.push({
          ticker,
          momentum12m: Math.round(momentum * 100) / 100,
          price: Math.round(lastClose * 100) / 100,
        })
      }
    } catch {
      continue
    }

    // Alpha Vantage limit: 5 calls per minute
    await new Promise((r) => setTimeout(r, 300))
  }

  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
