const FALLBACK_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "GOOG",
  "UNH", "XOM", "LLY", "JPM", "JNJ", "V", "PG", "MA", "CVX", "HD",
  "MRK", "ABBV", "BAC", "KO", "PEP", "AVGO", "COST", "WMT", "DIS",
  "ADBE", "NFLX", "CRM", "AMD", "TXN", "QCOM", "AMGN", "IBM", "HON",
  "CAT", "GE", "GS", "BA", "MMM", "AXP", "MS", "C", "WFC", "BLK",
  "LRCX", "MU", "KLAC", "FTI", "NRG", "RCL", "PHM", "THC",
  "URI", "NEM", "DVN", "EOG", "COP", "FCX", "EQT", "WDC", "STX",
  "SLG", "CF", "RRC", "APA", "MUR",
]

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo"

const priceCache: Map<string, number> = new Map()

async function getMonthlyPrice(ticker: string, month: number): Promise<number | null> {
  // Try cache first
  const cacheKey = `${ticker}_m${month}`
  if (priceCache.has(cacheKey)) return priceCache.get(cacheKey)!

  // Use Yahoo Finance API directly via yf-chart endpoint
  // period1 = 1 year ago, period2 = now
  const now = Math.floor(Date.now() / 1000)
  const oneYearAgo = now - 365 * 24 * 60 * 60

  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${oneYearAgo}&period2=${now}&interval=1mo`

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    })
    if (!res.ok) return null

    const text = await res.text()
    if (!text || text.includes("Too Many Requests") || text.includes("blocked")) {
      return null
    }

    const json = JSON.parse(text)
    const quotes = json?.chart?.result?.[0]?.quotes ?? []
    const valid = quotes.filter((q: any) => q?.close !== null && q?.close > 0)

    if (valid.length < 2) return null

    // Check for split issues: if any month has >300% change, skip the ticker
    for (let i = 1; i < valid.length; i++) {
      const change = Math.abs((valid[i].close - valid[i - 1].close) / valid[i - 1].close * 100)
      if (change > 200) return null // stock split detected
    }

    const firstClose = valid[0].close
    const lastClose = valid[valid.length - 1].close

    if (firstClose <= 0 || lastClose <= 0) return null

    // Cache
    priceCache.set(cacheKey, firstClose)
    priceCache.set(`${ticker}_current`, lastClose)

    return firstClose
  } catch {
    return null
  }
}

async function getCurrentPrice(ticker: string): Promise<number | null> {
  const cacheKey = `${ticker}_current`
  if (priceCache.has(cacheKey)) return priceCache.get(cacheKey)!

  return null // Will be set by getMonthlyPrice
}

export async function calculateMomentum() {
  const results: Array<{ ticker: string; momentum12m: number; price: number }> = []
  priceCache.clear()

  // Process in batches of 3 to avoid rate limiting
  for (let i = 0; i < FALLBACK_TICKERS.length; i += 3) {
    const batch = FALLBACK_TICKERS.slice(i, i + 3)

    const promises = batch.map(async (ticker) => {
      try {
        const firstPrice = await getMonthlyPrice(ticker, 0)
        if (!firstPrice) return null

        const currentKey = `${ticker}_current`
        const lastPrice = priceCache.get(currentKey)
        if (!lastPrice || lastPrice <= 0) return null

        const momentum = ((lastPrice - firstPrice) / firstPrice) * 100

        // Safety check: ignore absurd values
        if (Math.abs(momentum) > 500) return null

        if (momentum > 0) {
          return {
            ticker,
            momentum12m: Math.round(momentum * 100) / 100,
            price: Math.round(lastPrice * 100) / 100,
          }
        }
      } catch {}
      return null
    })

    const batchResults = await Promise.all(promises)
    for (const r of batchResults) {
      if (r) results.push(r)
    }

    // Delay between batches to avoid rate limiting
    if (i + 3 < FALLBACK_TICKERS.length) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
