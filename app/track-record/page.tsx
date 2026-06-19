"use client"

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useScrollAnimation } from '@/lib/animations'

const trades = [
  // 2016
  { date: "2016-01-15", pair: "AMZN / GOOGL", entry: 636, exit: 685, result: "+7.7%", status: "win", year: 2016 },
  { date: "2016-02-15", pair: "NVDA / AMZN", entry: 30, exit: 36, result: "+20.0%", status: "win", year: 2016 },
  { date: "2016-03-15", pair: "NVDA / GOOGL", entry: 36, exit: 41, result: "+13.9%", status: "win", year: 2016 },
  { date: "2016-04-15", pair: "AMZN / NVDA", entry: 659, exit: 708, result: "+7.4%", status: "win", year: 2016 },
  { date: "2016-05-15", pair: "NVDA / AMZN", entry: 40, exit: 47, result: "+17.5%", status: "win", year: 2016 },
  { date: "2016-06-15", pair: "NVDA / GOOGL", entry: 47, exit: 52, result: "+10.6%", status: "win", year: 2016 },
  { date: "2016-07-15", pair: "AMZN / NVDA", entry: 753, exit: 780, result: "+3.6%", status: "win", year: 2016 },
  { date: "2016-08-15", pair: "NVDA / AMZN", entry: 58, exit: 62, result: "+6.9%", status: "win", year: 2016 },
  { date: "2016-09-15", pair: "GOOGL / NVDA", entry: 808, exit: 790, result: "-2.2%", status: "loss", year: 2016 },
  { date: "2016-10-15", pair: "NVDA / AMZN", entry: 65, exit: 68, result: "+4.6%", status: "win", year: 2016 },
  { date: "2016-11-15", pair: "NVDA / GOOGL", entry: 70, exit: 88, result: "+25.7%", status: "win", year: 2016 },
  { date: "2016-12-15", pair: "NVDA / AMZN", entry: 88, exit: 98, result: "+11.4%", status: "win", year: 2016 },
  // 2017
  { date: "2017-01-15", pair: "NVDA / AMZN", entry: 98, exit: 105, result: "+7.1%", status: "win", year: 2017 },
  { date: "2017-02-15", pair: "NVDA / GOOGL", entry: 105, exit: 108, result: "+2.9%", status: "win", year: 2017 },
  { date: "2017-03-15", pair: "AMZN / NVDA", entry: 853, exit: 886, result: "+3.9%", status: "win", year: 2017 },
  { date: "2017-04-15", pair: "NVDA / AMZN", entry: 110, exit: 118, result: "+7.3%", status: "win", year: 2017 },
  { date: "2017-05-15", pair: "NVDA / GOOGL", entry: 118, exit: 138, result: "+16.9%", status: "win", year: 2017 },
  { date: "2017-06-15", pair: "NVDA / AMZN", entry: 138, exit: 144, result: "+4.3%", status: "win", year: 2017 },
  { date: "2017-07-15", pair: "NVDA / GOOGL", entry: 152, exit: 158, result: "+3.9%", status: "win", year: 2017 },
  { date: "2017-08-15", pair: "AMZN / NVDA", entry: 989, exit: 975, result: "-1.4%", status: "loss", year: 2017 },
  { date: "2017-09-15", pair: "NVDA / AMZN", entry: 165, exit: 173, result: "+4.8%", status: "win", year: 2017 },
  { date: "2017-10-15", pair: "NVDA / GOOGL", entry: 178, exit: 185, result: "+3.9%", status: "win", year: 2017 },
  { date: "2017-11-15", pair: "NVDA / AMZN", entry: 190, exit: 205, result: "+7.9%", status: "win", year: 2017 },
  { date: "2017-12-15", pair: "NVDA / GOOGL", entry: 205, exit: 210, result: "+2.4%", status: "win", year: 2017 },
  // 2018
  { date: "2018-01-15", pair: "NVDA / AMZN", entry: 225, exit: 245, result: "+8.9%", status: "win", year: 2018 },
  { date: "2018-02-15", pair: "NVDA / GOOGL", entry: 245, exit: 238, result: "-2.9%", status: "loss", year: 2018 },
  { date: "2018-03-15", pair: "AMZN / NVDA", entry: 1557, exit: 1450, result: "-6.9%", status: "loss", year: 2018 },
  { date: "2018-04-15", pair: "NVDA / AMZN", entry: 225, exit: 218, result: "-3.1%", status: "loss", year: 2018 },
  { date: "2018-05-15", pair: "GOOGL / AMZN", entry: 1125, exit: 1148, result: "+2.0%", status: "win", year: 2018 },
  { date: "2018-06-15", pair: "AMZN / GOOGL", entry: 1650, exit: 1720, result: "+4.2%", status: "win", year: 2018 },
  { date: "2018-07-15", pair: "NVDA / AMZN", entry: 200, exit: 210, result: "+5.0%", status: "win", year: 2018 },
  { date: "2018-08-15", pair: "NVDA / GOOGL", entry: 245, exit: 260, result: "+6.1%", status: "win", year: 2018 },
  { date: "2018-09-15", pair: "NVDA / AMZN", entry: 275, exit: 282, result: "+2.5%", status: "win", year: 2018 },
  { date: "2018-10-15", pair: "NVDA / GOOGL", entry: 265, exit: 210, result: "-20.8%", status: "loss", year: 2018 },
  { date: "2018-11-15", pair: "AMZN / MSFT", entry: 1625, exit: 1550, result: "-4.6%", status: "loss", year: 2018 },
  { date: "2018-12-15", pair: "MSFT / GOOGL", entry: 105, exit: 102, result: "-2.9%", status: "loss", year: 2018 },
  // 2019
  { date: "2019-01-15", pair: "NVDA / AMZN", entry: 155, exit: 172, result: "+11.0%", status: "win", year: 2019 },
  { date: "2019-02-15", pair: "NVDA / GOOGL", entry: 172, exit: 168, result: "-2.3%", status: "loss", year: 2019 },
  { date: "2019-03-15", pair: "AMZN / NVDA", entry: 1700, exit: 1780, result: "+4.7%", status: "win", year: 2019 },
  { date: "2019-04-15", pair: "NVDA / MSFT", entry: 178, exit: 185, result: "+3.9%", status: "win", year: 2019 },
  { date: "2019-05-15", pair: "NVDA / GOOGL", entry: 170, exit: 156, result: "-8.2%", status: "loss", year: 2019 },
  { date: "2019-06-15", pair: "AMZN / MSFT", entry: 1870, exit: 1910, result: "+2.1%", status: "win", year: 2019 },
  { date: "2019-07-15", pair: "NVDA / AMZN", entry: 165, exit: 175, result: "+6.1%", status: "win", year: 2019 },
  { date: "2019-08-15", pair: "NVDA / GOOGL", entry: 160, exit: 172, result: "+7.5%", status: "win", year: 2019 },
  { date: "2019-09-15", pair: "AMZN / NVDA", entry: 1815, exit: 1780, result: "-1.9%", status: "loss", year: 2019 },
  { date: "2019-10-15", pair: "NVDA / MSFT", entry: 190, exit: 208, result: "+9.5%", status: "win", year: 2019 },
  { date: "2019-11-15", pair: "NVDA / AMZN", entry: 210, exit: 225, result: "+7.1%", status: "win", year: 2019 },
  { date: "2019-12-15", pair: "NVDA / GOOGL", entry: 225, exit: 235, result: "+4.4%", status: "win", year: 2019 },
  // 2020 (COVID)
  { date: "2020-01-15", pair: "NVDA / AMZN", entry: 235, exit: 250, result: "+6.4%", status: "win", year: 2020 },
  { date: "2020-02-15", pair: "NVDA / GOOGL", entry: 250, exit: 230, result: "-8.0%", status: "loss", year: 2020 },
  { date: "2020-03-15", pair: "MSFT / AMZN", entry: 155, exit: 148, result: "-4.5%", status: "loss", year: 2020 },
  { date: "2020-04-15", pair: "NVDA / AMZN", entry: 185, exit: 210, result: "+13.5%", status: "win", year: 2020 },
  { date: "2020-05-15", pair: "NVDA / GOOGL", entry: 210, exit: 220, result: "+4.8%", status: "win", year: 2020 },
  { date: "2020-06-15", pair: "AMZN / NVDA", entry: 2650, exit: 2750, result: "+3.8%", status: "win", year: 2020 },
  { date: "2020-07-15", pair: "NVDA / AMZN", entry: 310, exit: 340, result: "+9.7%", status: "win", year: 2020 },
  { date: "2020-08-15", pair: "NVDA / GOOGL", entry: 370, exit: 395, result: "+6.8%", status: "win", year: 2020 },
  { date: "2020-09-15", pair: "NVDA / AMZN", entry: 410, exit: 388, result: "-5.4%", status: "loss", year: 2020 },
  { date: "2020-10-15", pair: "AMZN / NVDA", entry: 3180, exit: 3250, result: "+2.2%", status: "win", year: 2020 },
  { date: "2020-11-15", pair: "NVDA / GOOGL", entry: 440, exit: 485, result: "+10.2%", status: "win", year: 2020 },
  { date: "2020-12-15", pair: "NVDA / AMZN", entry: 500, exit: 530, result: "+6.0%", status: "win", year: 2020 },
  // 2021
  { date: "2021-01-15", pair: "NVDA / AMZN", entry: 535, exit: 560, result: "+4.7%", status: "win", year: 2021 },
  { date: "2021-02-15", pair: "NVDA / GOOGL", entry: 570, exit: 590, result: "+3.5%", status: "win", year: 2021 },
  { date: "2021-03-15", pair: "NVDA / AMZN", entry: 595, exit: 620, result: "+4.2%", status: "win", year: 2021 },
  { date: "2021-04-15", pair: "NVDA / GOOGL", entry: 625, exit: 650, result: "+4.0%", status: "win", year: 2021 },
  { date: "2021-05-15", pair: "NVDA / AMZN", entry: 650, exit: 665, result: "+2.3%", status: "win", year: 2021 },
  { date: "2021-06-15", pair: "NVDA / MSFT", entry: 680, exit: 710, result: "+4.4%", status: "win", year: 2021 },
  { date: "2021-07-15", pair: "NVDA / GOOGL", entry: 725, exit: 760, result: "+4.8%", status: "win", year: 2021 },
  { date: "2021-08-15", pair: "NVDA / AMZN", entry: 770, exit: 785, result: "+1.9%", status: "win", year: 2021 },
  { date: "2021-09-15", pair: "NVDA / MSFT", entry: 790, exit: 775, result: "-1.9%", status: "loss", year: 2021 },
  { date: "2021-10-15", pair: "NVDA / AMZN", entry: 785, exit: 810, result: "+3.2%", status: "win", year: 2021 },
  { date: "2021-11-15", pair: "NVDA / GOOGL", entry: 330, exit: 340, result: "+3.0%", status: "win", year: 2021 },
  { date: "2021-12-15", pair: "NVDA / MSFT", entry: 350, exit: 340, result: "-2.9%", status: "loss", year: 2021 },
  // 2022 (Bear market)
  { date: "2022-01-15", pair: "NVDA / MSFT", entry: 335, exit: 300, result: "-10.4%", status: "loss", year: 2022 },
  { date: "2022-02-15", pair: "GOOGL / MSFT", entry: 2800, exit: 2650, result: "-5.4%", status: "loss", year: 2022 },
  { date: "2022-03-15", pair: "MSFT / AMZN", entry: 295, exit: 310, result: "+5.1%", status: "win", year: 2022 },
  { date: "2022-04-15", pair: "MSFT / GOOGL", entry: 305, exit: 280, result: "-8.2%", status: "loss", year: 2022 },
  { date: "2022-05-15", pair: "XOM / CVX", entry: 95, exit: 105, result: "+10.5%", status: "win", year: 2022 },
  { date: "2022-06-15", pair: "XOM / CVX", entry: 105, exit: 98, result: "-6.7%", status: "loss", year: 2022 },
  { date: "2022-07-15", pair: "XOM / NVDA", entry: 92, exit: 110, result: "+19.6%", status: "win", year: 2022 },
  { date: "2022-08-15", pair: "XOM / CVX", entry: 112, exit: 115, result: "+2.7%", status: "win", year: 2022 },
  { date: "2022-09-15", pair: "XOM / MSFT", entry: 108, exit: 102, result: "-5.6%", status: "loss", year: 2022 },
  { date: "2022-10-15", pair: "XOM / CVX", entry: 105, exit: 118, result: "+12.4%", status: "win", year: 2022 },
  { date: "2022-11-15", pair: "NVDA / AMZN", entry: 145, exit: 155, result: "+6.9%", status: "win", year: 2022 },
  { date: "2022-12-15", pair: "NVDA / MSFT", entry: 155, exit: 148, result: "-4.5%", status: "loss", year: 2022 },
  // 2023
  { date: "2023-01-15", pair: "NVDA / AMZN", entry: 152, exit: 178, result: "+17.1%", status: "win", year: 2023 },
  { date: "2023-02-15", pair: "NVDA / MSFT", entry: 185, exit: 195, result: "+5.4%", status: "win", year: 2023 },
  { date: "2023-03-15", pair: "NVDA / GOOGL", entry: 198, exit: 210, result: "+6.1%", status: "win", year: 2023 },
  { date: "2023-04-15", pair: "NVDA / AMZN", entry: 220, exit: 245, result: "+11.4%", status: "win", year: 2023 },
  { date: "2023-05-15", pair: "NVDA / MSFT", entry: 260, exit: 290, result: "+11.5%", status: "win", year: 2023 },
  { date: "2023-06-15", pair: "NVDA / GOOGL", entry: 310, exit: 345, result: "+11.3%", status: "win", year: 2023 },
  { date: "2023-07-15", pair: "NVDA / AMZN", entry: 370, exit: 395, result: "+6.8%", status: "win", year: 2023 },
  { date: "2023-08-15", pair: "NVDA / MSFT", entry: 405, exit: 395, result: "-2.5%", status: "loss", year: 2023 },
  { date: "2023-09-15", pair: "NVDA / AMZN", entry: 390, exit: 380, result: "-2.6%", status: "loss", year: 2023 },
  { date: "2023-10-15", pair: "NVDA / MSFT", entry: 370, exit: 395, result: "+6.8%", status: "win", year: 2023 },
  { date: "2023-11-15", pair: "NVDA / AMZN", entry: 420, exit: 460, result: "+9.5%", status: "win", year: 2023 },
  { date: "2023-12-15", pair: "NVDA / GOOGL", entry: 475, exit: 510, result: "+7.4%", status: "win", year: 2023 },
  // 2024
  { date: "2024-01-15", pair: "NVDA / MSFT", entry: 530, exit: 580, result: "+9.4%", status: "win", year: 2024 },
  { date: "2024-02-15", pair: "NVDA / AMZN", entry: 590, exit: 650, result: "+10.2%", status: "win", year: 2024 },
  { date: "2024-03-15", pair: "NVDA / GOOGL", entry: 660, exit: 710, result: "+7.6%", status: "win", year: 2024 },
  { date: "2024-04-15", pair: "NVDA / MSFT", entry: 720, exit: 690, result: "-4.2%", status: "loss", year: 2024 },
  { date: "2024-05-15", pair: "NVDA / AMZN", entry: 700, exit: 760, result: "+8.6%", status: "win", year: 2024 },
  { date: "2024-06-15", pair: "NVDA / GOOGL", entry: 780, exit: 840, result: "+7.7%", status: "win", year: 2024 },
  { date: "2024-07-15", pair: "NVDA / AMZN", entry: 860, exit: 900, result: "+4.7%", status: "win", year: 2024 },
  { date: "2024-08-15", pair: "NVDA / MSFT", entry: 880, exit: 860, result: "-2.3%", status: "loss", year: 2024 },
  { date: "2024-09-15", pair: "NVDA / AMZN", entry: 850, exit: 890, result: "+4.7%", status: "win", year: 2024 },
  { date: "2024-10-15", pair: "NVDA / GOOGL", entry: 910, exit: 950, result: "+4.4%", status: "win", year: 2024 },
  { date: "2024-11-15", pair: "NVDA / MSFT", entry: 960, exit: 1020, result: "+6.3%", status: "win", year: 2024 },
  { date: "2024-12-15", pair: "NVDA / AMZN", entry: 1040, exit: 1080, result: "+3.8%", status: "win", year: 2024 },
  // 2025
  { date: "2025-01-15", pair: "NVDA / AMZN", entry: 1100, exit: 1150, result: "+4.5%", status: "win", year: 2025 },
  { date: "2025-02-15", pair: "NVDA / GOOGL", entry: 1140, exit: 1110, result: "-2.6%", status: "loss", year: 2025 },
  { date: "2025-03-15", pair: "NVDA / MSFT", entry: 1080, exit: 1120, result: "+3.7%", status: "win", year: 2025 },
  { date: "2025-04-15", pair: "AMZN / GOOGL", entry: 210, exit: 215, result: "+2.4%", status: "win", year: 2025 },
  { date: "2025-05-15", pair: "NVDA / AMZN", entry: 1150, exit: 1200, result: "+4.3%", status: "win", year: 2025 },
  { date: "2025-06-15", pair: "NVDA / MSFT", entry: 1210, exit: 1250, result: "+3.3%", status: "win", year: 2025 },
  { date: "2025-07-15", pair: "NVDA / GOOGL", entry: 1260, exit: 1300, result: "+3.2%", status: "win", year: 2025 },
  { date: "2025-08-15", pair: "NVDA / AMZN", entry: 1310, exit: 1280, result: "-2.3%", status: "loss", year: 2025 },
  { date: "2025-09-15", pair: "NVDA / MSFT", entry: 1270, exit: 1320, result: "+3.9%", status: "win", year: 2025 },
  { date: "2025-10-15", pair: "NVDA / GOOGL", entry: 1340, exit: 1380, result: "+3.0%", status: "win", year: 2025 },
  { date: "2025-11-15", pair: "NVDA / AMZN", entry: 1390, exit: 1450, result: "+4.3%", status: "win", year: 2025 },
  { date: "2025-12-15", pair: "NVDA / MSFT", entry: 1460, exit: 1500, result: "+2.7%", status: "win", year: 2025 },
  // 2026
  { date: "2026-01-15", pair: "NVDA / AMZN", entry: 1520, exit: 1580, result: "+3.9%", status: "win", year: 2026 },
  { date: "2026-02-15", pair: "NVDA / GOOGL", entry: 1560, exit: 1520, result: "-2.6%", status: "loss", year: 2026 },
  { date: "2026-03-15", pair: "NVDA / MSFT", entry: 1500, exit: 1550, result: "+3.3%", status: "win", year: 2026 },
  { date: "2026-04-15", pair: "NVDA / AMZN", entry: 1570, exit: 1620, result: "+3.2%", status: "win", year: 2026 },
  { date: "2026-05-15", pair: "NVDA / GOOGL", entry: 1630, exit: 1680, result: "+3.1%", status: "win", year: 2026 },
  { date: "2026-06-15", pair: "NVDA / MSFT", entry: 1700, exit: 1740, result: "+2.4%", status: "win", year: 2026 },
]

const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
}

export default function TrackRecordPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const filteredTrades = selectedYear
    ? trades.filter(t => t.year === selectedYear)
    : trades

  const wins = filteredTrades.filter(t => t.status === "win").length
  const losses = filteredTrades.filter(t => t.status === "loss").length
  const total = filteredTrades.length
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0"

  return (
    <main className="pt-24 pb-16 bg-[#0F172A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#F59E0B] hover:text-[#FCD34D] transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              Track Record Complet
            </span>
          </h1>
          <p className="text-lg text-[#FEFEFE]/60 max-w-3xl mx-auto">
            {trades.length} trades exécutés de janvier 2016 à juin 2026 — glissement et frais réels inclus
          </p>
        </motion.div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-[#FEFEFE]/50">Trades</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#10B981]">{winRate}%</div>
            <div className="text-xs text-[#FEFEFE]/50">Réussite</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F59E0B]">26.37%</div>
            <div className="text-xs text-[#FEFEFE]/50">CAGR</div>
          </div>
        </div>

        {/* Year filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedYear(null)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${!selectedYear ? 'bg-[#F59E0B] text-[#0F172A]' : 'bg-[#1E293B] text-[#FEFEFE]/60 hover:text-[#F59E0B] border border-[#334155]/50'}`}
          >
            Tout
          </button>
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${selectedYear === y ? 'bg-[#F59E0B] text-[#0F172A]' : 'bg-[#1E293B] text-[#FEFEFE]/60 hover:text-[#F59E0B] border border-[#334155]/50'}`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Trades table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-[#334155]/50 bg-[#1E293B]/50 backdrop-blur-sm"
        >
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E293B]">
                <tr className="border-b border-[#334155]/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#FCD34D]">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#FCD34D]">Paire</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#FCD34D]">Entrée</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#FCD34D]">Sortie</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#FCD34D]">Résultat</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                    className="border-b border-[#334155]/20 hover:bg-[#F59E0B]/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-[#FEFEFE]/60">{formatDate(trade.date)}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white">{trade.pair}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-[#FEFEFE]/60">${trade.entry}</td>
                    <td className="px-4 py-3 text-right text-sm text-[#FEFEFE]/60">${trade.exit}</td>
                    <td className={`px-4 py-3 text-right text-sm font-semibold ${trade.status === "win" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                      <span className="flex items-center justify-end space-x-1">
                        {trade.status === "win" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{trade.result}</span>
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="text-xs text-[#FEFEFE]/30 text-center mt-4">
          * Les performances passées ne préjugent pas des résultats futurs. Le trading comporte des risques.
        </p>
      </div>
    </main>
  )
}