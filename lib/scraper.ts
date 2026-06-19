import yahooFinance from "yahoo-finance2"
import { getCachedTickers, setCachedTickers, type Signal } from "./kv"

// Known S&P 500 tickers (fallback if API fails)
const FALLBACK_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "GOOG", "BRK.B",
  "UNH", "XOM", "LLY", "JPM", "JNJ", "V", "PG", "MA", "CVX", "HD", "MRK",
  "ABBV", "BAC", "KO", "PEP", "PFE", "AVGO", "COST", "WMT", "DIS", "CSCO",
  "ADBE", "NFLX", "CRM", "INTC", "AMD", "TXN", "QCOM", "AMGN", "IBM", "HON",
  "CAT", "GE", "GS", "BA", "MMM", "TRV", "AXP", "MS", "C", "WFC", "BLK",
  "BKNG", "UBER", "ABNB", "NOW", "SHOP", "ADP", "ISRG", "VRTX", "PANW",
  "LRCX", "MU", "STX", "WDC", "KLAC", "FTI", "NRG", "PBI", "GME", "BBBY",
  "SE", "NVDA", "AAPL", "FOX", "TPR", "RCL", "AVGO", "PHM", "RIG", "THC",
  "GE", "FTI", "FSLR", "OI", "NFLX", "SLG", "URI", "WDC", "NRG", "PBI",
  "TE", "FOSL", "STX", "MU", "NEM", "LRCX", "WDC", "DVN", "MUR", "RRC",
  "EOG", "COP", "CF", "APA", "M", "DVN", "GME", "HAR", "SIG", "DVN",
  "MUR", "EOG", "COP", "CF", "APA", "RRC", "HAR", "SIG", "M", "RIG",
  "GME", "BBBY", "CPRI", "PBI", "THC", "FCX", "FOSL", "RRC", "EQT",
]

export async function calculateMomentum(): Promise<Signal[]> {
  // Get tickers (from cache or fallback)
  let tickers = await getCachedTickers()

  if (!tickers || tickers.length === 0) {
    tickers = FALLBACK_TICKERS
    await setCachedTickers(tickers)
  }

  const results: Signal[] = []
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)
  const dateStr = twelveMonthsAgo.toISOString().split("T")[0]

  for (const ticker of tickers) {
    try {
      const historical: any[] = await yahooFinance.historical(ticker, {
        period1: dateStr,
        interval: "1mo" as const,
      })

      if (!historical || historical.length < 2) continue

      const firstPrice = historical[0]?.close ?? 0
      const lastPrice = historical[historical.length - 1]?.close ?? 0

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

  // Sort by momentum descending, take top 5
  results.sort((a, b) => b.momentum12m - a.momentum12m)
  return results.slice(0, 5)
}
