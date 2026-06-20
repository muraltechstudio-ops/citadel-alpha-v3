import { NextResponse } from "next/server"

export async function GET() {
  const results: any[] = []

  const testTickers = ["AAPL", "NVDA", "MSFT", "MU", "AMD"]
  const now = Math.floor(Date.now() / 1000)
  const oneYearAgo = now - 366 * 24 * 60 * 60

  for (const ticker of testTickers) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${oneYearAgo}&period2=${now}&interval=1mo`

      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(10000),
      })

      const info: any = { ticker, status: res.status, ok: res.ok }

      if (res.ok) {
        const text = await res.text()
        try {
          const json = JSON.parse(text)
          const quotes = json?.chart?.result?.[0]?.quotes ?? []
          const meta = json?.chart?.result?.[0]?.meta
          const valid = quotes.filter((q: any) => q?.close && q.close > 0)

          info.validQuotes = valid.length
          info.currentPrice = meta?.regularMarketPrice
          info.firstClose = valid.length > 0 ? valid[0].close : null
          info.lastClose = valid.length > 0 ? valid[valid.length - 1].close : null
          info.firstDate = valid.length > 0 ? new Date(valid[0].date * 1000).toISOString() : null
          info.lastDate = valid.length > 0 ? new Date(valid[valid.length - 1].date * 1000).toISOString() : null
          info.allQuotes = valid.map((q: any) => ({ date: new Date(q.date * 1000).toISOString().substring(0, 10), close: q.close }))
        } catch {
          info.parseError = text.substring(0, 200)
        }
      } else {
        info.statusText = res.statusText
      }

      results.push(info)
    } catch (e: any) {
      results.push({ ticker, error: e.message })
    }
  }

  return NextResponse.json(results)
}
