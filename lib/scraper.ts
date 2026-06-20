import YahooFinance from "yahoo-finance2"
const yahooFinance = new YahooFinance()

const FALLBACK_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "GOOG",
  "UNH", "XOM", "LLY", "JPM", "JNJ", "V", "PG", "MA", "CVX", "HD",
  "MRK", "ABBV", "BAC", "KO", "PEP", "AVGO", "COST", "WMT", "DIS",
  "ADBE", "NFLX", "CRM", "AMD", "TXN", "QCOM", "AMGN", "IBM", "HON",
  "CAT", "GE", "GS", "BA", "MMM", "AXP", "MS", "C", "WFC", "BLK",
  "LRCX", "MU", "KLAC", "FTI", "NRG", "GME", "RCL", "PHM", "THC",
  "URI", "NEM", "DVN", "EOG", "COP", "FCX", "EQT", "WDC", "STX",
  "SLG", "CF", "RRC", "APA", "MUR",
]

export async function calculateMomentum() {
  const results: Array<{ ticker: string; momentum12m: number; price: number }> = []

  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  for (const ticker of FALLBACK_TICKERS) {
    try {
      const chart = await yahooFinance.chart(ticker, {
        period1: oneYearAgo.toISOString(),
        interval: "1mo",
      })

      const quotes = chart?.quotes ?? []
      if (quotes.length < 2) continue

      const firstPrice = quotes[0]?.close ?? 0
      const lastPrice = quotes[quotes.length - 1]?.close ?? 0

      if (firstPrice <= 0 || lastPrice <= 0) continue

      const momentum = ((lastPrice - firstPrice) / firstPrice) * 100

      if (momentum > 0) {
        results.push({
          ticker,
          momentum12m: Math.round(momentum * 100) / 100,
          price: Math.round(lastPrice * 100) / 100,
        })
      }
    } catch {
      continue
    }
  }

  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
