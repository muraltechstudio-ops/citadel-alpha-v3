import { kv } from "@vercel/kv"

const KEYS = {
  subscribers: "subscribers",
  currentSignal: "current_signal",
  signalsHistory: "signals_history",
  sp500Tickers: "sp500_tickers",
} as const

export interface Signal {
  ticker: string
  momentum12m: number
  price: number
}

export interface SignalPayload {
  month: string
  generatedAt: string
  tickers: Signal[]
}

// Subscribers
export async function addSubscriber(email: string): Promise<void> {
  await kv.sadd(KEYS.subscribers, email.toLowerCase())
}

export async function removeSubscriber(email: string): Promise<void> {
  await kv.srem(KEYS.subscribers, email.toLowerCase())
}

export async function getSubscribers(): Promise<string[]> {
  return await kv.smembers(KEYS.subscribers)
}

// Current signal
export async function setCurrentSignal(payload: SignalPayload): Promise<void> {
  await kv.set(KEYS.currentSignal, payload)
}

export async function getCurrentSignal(): Promise<SignalPayload | null> {
  return await kv.get(KEYS.currentSignal)
}

// Signals history (last 12 months)
export async function pushSignalHistory(payload: SignalPayload): Promise<void> {
  await kv.lpush(KEYS.signalsHistory, payload)
  await kv.ltrim(KEYS.signalsHistory, 0, 11)
}

export async function getSignalHistory(): Promise<SignalPayload[]> {
  return await kv.lrange(KEYS.signalsHistory, 0, -1) ?? []
}

// S&P 500 tickers cache (7 days)
export async function getCachedTickers(): Promise<string[] | null> {
  return await kv.get(KEYS.sp500Tickers)
}

export async function setCachedTickers(tickers: string[]): Promise<void> {
  await kv.setex(KEYS.sp500Tickers, 604800, tickers) // 7 days
}

export { KEYS }
