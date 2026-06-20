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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function getYahooChart(ticker: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1y&interval=1mo`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json",
    },
  })

  if (!res.ok) return null

  const json = await res.json()
  const result = json?.chart?.result?.[0]
  if (!result) return null

  const quotes = result.quotes ?? []
  const valid = quotes.filter((q: any) => q?.close !== null && q?.close > 0)

  if (valid.length < 2) return null

  return {
    firstClose: valid[0].close,
    lastClose: valid[valid.length - 1].close,
  }
}

export async function calculateMomentum() {
  const results: Array<{ ticker: string; momentum12m: number; price: number }> = []

  for (let i = 0; i < FALLBACK_TICKERS.length; i++) {
    const ticker = FALLBACK_TICKERS[i]

    try {
      const data = await getYahooChart(ticker)
      if (!data || data.firstClose <= 0) continue

      const momentum = ((data.lastClose - data.firstClose) / data.firstClose) * 100

      // Sanity check: stock split adjustment can give absurd values
      // If momentum > 500%, skip (likely split issue)
      if (momentum > 500) continue

      if (momentum > 0) {
        results.push({
          ticker,
          momentum12m: Math.round(momentum * 100) / 100,
          price: Math.round(data.lastClose * 100) / 100,
        })
      }
    } catch {
      continue
    }

    // Delay to avoid rate limiting (every 3 tickers)
    if (i % 3 === 0) await sleep(200)
  }

  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
