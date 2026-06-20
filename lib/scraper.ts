import YahooFinance from "yahoo-finance2"
const yahooFinance = new YahooFinance()
import { getCachedTickers, setCachedTickers, type Signal } from "./kv"

const FALLBACK_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "GOOG",
  "UNH", "XOM", "LLY", "JPM", "JNJ", "V", "PG", "MA", "CVX", "HD",
  "MRK", "ABBV", "BAC", "KO", "PEP", "AVGO", "COST", "WMT", "DIS",
  "ADBE", "NFLX", "CRM", "AMD", "TXN", "QCOM", "AMGN", "IBM", "HON",
  "CAT", "GE", "GS", "BA", "MMM", "AXP", "MS", "C", "WFC", "BLK",
  "BKNG", "UBER", "NOW", "ADP", "ISRG", "VRTX", "PANW", "LRCX", "MU",
  "KLAC", "FTI", "NRG", "GME", "FOX", "TPR", "RCL", "PHM", "THC",
  "FSLR", "URI", "NEM", "DVN", "EOG", "COP", "M", "RIG", "FCX",
  "EQT", "WDC", "STX", "PBI", "FOSL", "HAR", "SIG", "CPRI",
  "SLG", "RRC", "CF", "APA", "MUR", "OI", "TE", "LB",
]

export async function calculateMomentum(): Promise<Signal[]> {
  let tickers = await getCachedTickers()
  if (!tickers || tickers.length === 0) {
    tickers = [...new Set(FALLBACK_TICKERS)]
    await setCachedTickers(tickers)
  }

  const results: Signal[] = []
  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const fromDate = oneYearAgo.toISOString().split("T")[0]

  for (const ticker of tickers) {
    try {
      const data: any[] = await yahooFinance.historical(ticker, {
        period1: fromDate,
        interval: "1mo",
      })

      if (!data || data.length < 2) continue

      const firstPrice = data[0]?.close ?? data[0]?.adjClose ?? 0
      const lastPrice = data[data.length - 1]?.close ?? data[data.length - 1]?.adjClose ?? 0

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
