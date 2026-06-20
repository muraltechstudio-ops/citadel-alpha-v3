// Top 50 S&P 500 tickers
const TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
  "UNH", "XOM", "LLY", "JPM", "JNJ", "V", "PG", "MA", "CVX", "HD",
  "MRK", "ABBV", "BAC", "KO", "PEP", "AVGO", "COST", "WMT", "DIS",
  "ADBE", "NFLX", "CRM", "AMD", "TXN", "QCOM", "AMGN", "IBM", "HON",
  "CAT", "GE", "GS", "BA", "MMM", "AXP", "MS", "C", "WFC", "BLK",
  "LRCX", "MU", "KLAC", "WDC", "STX",
]

export async function calculateMomentum() {
  const results: Array<{ ticker: string; momentum12m: number; price: number }> = []

  const now = Math.floor(Date.now() / 1000)
  const oneYearAgo = now - 366 * 24 * 60 * 60

  for (const ticker of TICKERS) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${oneYearAgo}&period2=${now}&interval=1mo`

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
        },
        // Timeout plus court
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) continue

      const json: any = await res.json()
      const meta = json?.chart?.result?.[0]?.meta
      const quotes: any[] = json?.chart?.result?.[0]?.quotes ?? []

      // Use meta.regularMarketPrice for current price (more reliable)
      const currentPrice = meta?.regularMarketPrice
      if (!currentPrice || currentPrice <= 0) continue

      // Get the first valid close from quotes (12 months ago)
      let firstPrice: number | null = null
      for (const q of quotes) {
        if (q?.close && q.close > 0) {
          firstPrice = q.close
          break
        }
      }

      if (!firstPrice || firstPrice <= 0) continue

      // Check for stock split (any single month > 200%)
      let hasSplit = false
      let prevClose: number | null = null
      for (const q of quotes) {
        if (!q?.close || q.close <= 0) continue
        if (prevClose !== null) {
          const change = Math.abs((q.close - prevClose) / prevClose * 100)
          if (change > 200) { hasSplit = true; break }
        }
        prevClose = q.close
      }
      if (hasSplit) continue

      // Compare first price to current meta price (not last quote)
      const momentum = ((currentPrice - firstPrice) / firstPrice) * 100

      if (momentum > 0) {
        results.push({
          ticker,
          momentum12m: Math.round(momentum * 100) / 100,
          price: Math.round(currentPrice * 100) / 100,
        })
      }
    } catch {
      continue
    }
  }

  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
