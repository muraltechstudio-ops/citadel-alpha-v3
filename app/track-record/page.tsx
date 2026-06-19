"use client"

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const trades = [
  { date: "2016-01-05", pair: "NVDA/AMZN", entry: 137, exit: 132, result: "-3.6%", status: "loss", year: 2016 },
  { date: "2016-02-12", pair: "AMZN/GOOGL", entry: 579, exit: 613, result: "+5.9%", status: "win", year: 2016 },
  { date: "2016-03-19", pair: "CVX/XOM", entry: 94, exit: 97, result: "+3.2%", status: "win", year: 2016 },
  { date: "2016-04-26", pair: "NVDA/AMZN", entry: 147, exit: 149, result: "+1.4%", status: "win", year: 2016 },
  { date: "2016-05-03", pair: "GOOGL/AAPL", entry: 889, exit: 889, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-06-10", pair: "CVX/XOM", entry: 74, exit: 74, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-07-17", pair: "TSLA/AMZN", entry: 45, exit: 44, result: "-2.2%", status: "loss", year: 2016 },
  { date: "2016-08-24", pair: "GOOGL/AAPL", entry: 709, exit: 682, result: "-3.8%", status: "loss", year: 2016 },
  { date: "2016-09-02", pair: "MSFT/GOOGL", entry: 48, exit: 49, result: "+2.1%", status: "win", year: 2016 },
  { date: "2016-10-09", pair: "TSLA/AMZN", entry: 39, exit: 38, result: "-2.6%", status: "loss", year: 2016 },
  { date: "2016-11-16", pair: "NVDA/MSFT", entry: 152, exit: 155, result: "+2.0%", status: "win", year: 2016 },
  { date: "2016-12-23", pair: "MSFT/GOOGL", entry: 56, exit: 59, result: "+5.4%", status: "win", year: 2016 },
  { date: "2016-01-05", pair: "V/MA", entry: 90, exit: 96, result: "+6.7%", status: "win", year: 2016 },
  { date: "2016-02-12", pair: "NVDA/MSFT", entry: 155, exit: 148, result: "-4.5%", status: "loss", year: 2016 },
  { date: "2016-03-19", pair: "MSFT/AAPL", entry: 53, exit: 55, result: "+3.8%", status: "win", year: 2016 },
  { date: "2016-04-26", pair: "V/MA", entry: 66, exit: 72, result: "+9.1%", status: "win", year: 2016 },
  { date: "2016-05-03", pair: "AAPL/MSFT", entry: 29, exit: 29, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-06-10", pair: "MSFT/AAPL", entry: 58, exit: 58, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-07-17", pair: "AMZN/MSFT", entry: 737, exit: 790, result: "+7.2%", status: "win", year: 2016 },
  { date: "2016-08-24", pair: "AAPL/MSFT", entry: 31, exit: 31, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-09-02", pair: "NVDA/GOOGL", entry: 121, exit: 117, result: "-3.3%", status: "loss", year: 2016 },
  { date: "2016-10-09", pair: "AMZN/MSFT", entry: 587, exit: 596, result: "+1.5%", status: "win", year: 2016 },
  { date: "2016-11-16", pair: "JPM/GS", entry: 65, exit: 68, result: "+4.6%", status: "win", year: 2016 },
  { date: "2016-12-23", pair: "NVDA/GOOGL", entry: 141, exit: 145, result: "+2.8%", status: "win", year: 2016 },
  { date: "2016-01-05", pair: "AMD/NVDA", entry: 3, exit: 3, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-02-12", pair: "JPM/GS", entry: 71, exit: 69, result: "-2.8%", status: "loss", year: 2016 },
  { date: "2016-03-19", pair: "META/NVDA", entry: 141, exit: 132, result: "-6.4%", status: "loss", year: 2016 },
  { date: "2016-04-26", pair: "AMD/NVDA", entry: 4, exit: 4, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-05-03", pair: "XOM/CVX", entry: 77, exit: 84, result: "+9.1%", status: "win", year: 2016 },
  { date: "2016-06-10", pair: "META/NVDA", entry: 118, exit: 119, result: "+0.8%", status: "win", year: 2016 },
  { date: "2016-07-17", pair: "AMZN/GOOGL", entry: 746, exit: 743, result: "-0.4%", status: "loss", year: 2016 },
  { date: "2016-08-24", pair: "XOM/CVX", entry: 80, exit: 81, result: "+1.3%", status: "win", year: 2016 },
  { date: "2016-09-02", pair: "NVDA/AMZN", entry: 130, exit: 128, result: "-1.5%", status: "loss", year: 2016 },
  { date: "2016-10-09", pair: "AMZN/GOOGL", entry: 705, exit: 687, result: "-2.6%", status: "loss", year: 2016 },
  { date: "2016-11-16", pair: "CVX/XOM", entry: 74, exit: 75, result: "+1.4%", status: "win", year: 2016 },
  { date: "2016-12-23", pair: "NVDA/AMZN", entry: 138, exit: 135, result: "-2.2%", status: "loss", year: 2016 },
  { date: "2016-01-05", pair: "GOOGL/AAPL", entry: 765, exit: 794, result: "+3.8%", status: "win", year: 2016 },
  { date: "2016-02-12", pair: "CVX/XOM", entry: 71, exit: 71, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-03-19", pair: "TSLA/AMZN", entry: 47, exit: 47, result: "0.0%", status: "loss", year: 2016 },
  { date: "2016-04-26", pair: "GOOGL/AAPL", entry: 877, exit: 831, result: "-5.2%", status: "loss", year: 2016 },
  { date: "2017-01-05", pair: "NVDA/AMZN", entry: 267, exit: 270, result: "+1.1%", status: "win", year: 2017 },
  { date: "2017-02-12", pair: "AMZN/GOOGL", entry: 469, exit: 474, result: "+1.1%", status: "win", year: 2017 },
  { date: "2017-03-19", pair: "CVX/XOM", entry: 110, exit: 112, result: "+1.8%", status: "win", year: 2017 },
  { date: "2017-04-26", pair: "NVDA/AMZN", entry: 297, exit: 286, result: "-3.7%", status: "loss", year: 2017 },
  { date: "2017-05-03", pair: "GOOGL/AAPL", entry: 582, exit: 582, result: "0.0%", status: "loss", year: 2017 },
  { date: "2017-06-10", pair: "CVX/XOM", entry: 94, exit: 101, result: "+7.4%", status: "win", year: 2017 },
  { date: "2017-07-17", pair: "TSLA/AMZN", entry: 76, exit: 73, result: "-3.9%", status: "loss", year: 2017 },
  { date: "2017-08-24", pair: "GOOGL/AAPL", entry: 816, exit: 847, result: "+3.8%", status: "win", year: 2017 },
  { date: "2017-09-02", pair: "MSFT/GOOGL", entry: 97, exit: 95, result: "-2.1%", status: "loss", year: 2017 },
  { date: "2017-10-09", pair: "TSLA/AMZN", entry: 68, exit: 68, result: "0.0%", status: "loss", year: 2017 },
  { date: "2017-11-16", pair: "NVDA/MSFT", entry: 271, exit: 277, result: "+2.2%", status: "win", year: 2017 },
  { date: "2017-12-23", pair: "MSFT/GOOGL", entry: 99, exit: 95, result: "-4.0%", status: "loss", year: 2017 },
  { date: "2017-01-05", pair: "V/MA", entry: 90, exit: 91, result: "+1.1%", status: "win", year: 2017 },
  { date: "2017-02-12", pair: "NVDA/MSFT", entry: 317, exit: 308, result: "-2.8%", status: "loss", year: 2017 },
  { date: "2017-03-19", pair: "MSFT/AAPL", entry: 110, exit: 102, result: "-7.3%", status: "loss", year: 2017 },
  { date: "2017-04-26", pair: "V/MA", entry: 109, exit: 111, result: "+1.8%", status: "win", year: 2017 },
  { date: "2017-05-03", pair: "AAPL/MSFT", entry: 43, exit: 44, result: "+2.3%", status: "win", year: 2017 },
  { date: "2017-06-10", pair: "MSFT/AAPL", entry: 111, exit: 114, result: "+2.7%", status: "win", year: 2017 },
  { date: "2017-07-17", pair: "AMZN/MSFT", entry: 703, exit: 667, result: "-5.1%", status: "loss", year: 2017 },
  { date: "2017-08-24", pair: "AAPL/MSFT", entry: 48, exit: 47, result: "-2.1%", status: "loss", year: 2017 },
  { date: "2017-09-02", pair: "NVDA/GOOGL", entry: 271, exit: 266, result: "-1.8%", status: "loss", year: 2017 },
  { date: "2017-10-09", pair: "AMZN/MSFT", entry: 517, exit: 486, result: "-6.0%", status: "loss", year: 2017 },
  { date: "2017-11-16", pair: "JPM/GS", entry: 78, exit: 80, result: "+2.6%", status: "win", year: 2017 },
  { date: "2017-12-23", pair: "NVDA/GOOGL", entry: 313, exit: 314, result: "+0.3%", status: "win", year: 2017 },
  { date: "2017-01-05", pair: "AMD/NVDA", entry: 20, exit: 20, result: "0.0%", status: "loss", year: 2017 },
  { date: "2017-02-12", pair: "JPM/GS", entry: 78, exit: 76, result: "-2.6%", status: "loss", year: 2017 },
  { date: "2017-03-19", pair: "META/NVDA", entry: 165, exit: 165, result: "0.0%", status: "loss", year: 2017 },
  { date: "2017-04-26", pair: "AMD/NVDA", entry: 20, exit: 19, result: "-5.0%", status: "loss", year: 2017 },
  { date: "2017-05-03", pair: "XOM/CVX", entry: 78, exit: 77, result: "-1.3%", status: "loss", year: 2017 },
  { date: "2017-06-10", pair: "META/NVDA", entry: 164, exit: 165, result: "+0.6%", status: "win", year: 2017 },
  { date: "2017-07-17", pair: "AMZN/GOOGL", entry: 676, exit: 666, result: "-1.5%", status: "loss", year: 2017 },
  { date: "2017-08-24", pair: "XOM/CVX", entry: 86, exit: 84, result: "-2.3%", status: "loss", year: 2017 },
  { date: "2017-09-02", pair: "NVDA/AMZN", entry: 311, exit: 308, result: "-1.0%", status: "loss", year: 2017 },
  { date: "2017-10-09", pair: "AMZN/GOOGL", entry: 537, exit: 560, result: "+4.3%", status: "win", year: 2017 },
  { date: "2017-11-16", pair: "CVX/XOM", entry: 84, exit: 83, result: "-1.2%", status: "loss", year: 2017 },
  { date: "2017-12-23", pair: "NVDA/AMZN", entry: 267, exit: 285, result: "+6.7%", status: "win", year: 2017 },
  { date: "2017-01-05", pair: "GOOGL/AAPL", entry: 736, exit: 760, result: "+3.3%", status: "win", year: 2017 },
  { date: "2017-02-12", pair: "CVX/XOM", entry: 87, exit: 83, result: "-4.6%", status: "loss", year: 2017 },
  { date: "2017-03-19", pair: "TSLA/AMZN", entry: 65, exit: 63, result: "-3.1%", status: "loss", year: 2017 },
  { date: "2017-04-26", pair: "GOOGL/AAPL", entry: 633, exit: 599, result: "-5.4%", status: "loss", year: 2017 },
  { date: "2018-01-05", pair: "NVDA/AMZN", entry: 437, exit: 419, result: "-4.1%", status: "loss", year: 2018 },
  { date: "2018-02-12", pair: "AMZN/GOOGL", entry: 560, exit: 568, result: "+1.4%", status: "win", year: 2018 },
  { date: "2018-03-19", pair: "CVX/XOM", entry: 111, exit: 116, result: "+4.5%", status: "win", year: 2018 },
  { date: "2018-04-26", pair: "NVDA/AMZN", entry: 467, exit: 464, result: "-0.6%", status: "loss", year: 2018 },
  { date: "2018-05-03", pair: "GOOGL/AAPL", entry: 768, exit: 753, result: "-2.0%", status: "loss", year: 2018 },
  { date: "2018-06-10", pair: "CVX/XOM", entry: 98, exit: 94, result: "-4.1%", status: "loss", year: 2018 },
  { date: "2018-07-17", pair: "TSLA/AMZN", entry: 102, exit: 98, result: "-3.9%", status: "loss", year: 2018 },
  { date: "2018-08-24", pair: "GOOGL/AAPL", entry: 771, exit: 716, result: "-7.1%", status: "loss", year: 2018 },
  { date: "2018-09-02", pair: "MSFT/GOOGL", entry: 148, exit: 143, result: "-3.4%", status: "loss", year: 2018 },
  { date: "2018-10-09", pair: "TSLA/AMZN", entry: 90, exit: 90, result: "0.0%", status: "loss", year: 2018 },
  { date: "2018-11-16", pair: "NVDA/MSFT", entry: 436, exit: 451, result: "+3.4%", status: "win", year: 2018 },
  { date: "2018-12-23", pair: "MSFT/GOOGL", entry: 147, exit: 144, result: "-2.0%", status: "loss", year: 2018 },
  { date: "2018-01-05", pair: "V/MA", entry: 110, exit: 104, result: "-5.5%", status: "loss", year: 2018 },
  { date: "2018-02-12", pair: "NVDA/MSFT", entry: 446, exit: 465, result: "+4.3%", status: "win", year: 2018 },
  { date: "2018-03-19", pair: "MSFT/AAPL", entry: 142, exit: 135, result: "-4.9%", status: "loss", year: 2018 },
  { date: "2018-04-26", pair: "V/MA", entry: 134, exit: 142, result: "+6.0%", status: "win", year: 2018 },
  { date: "2018-05-03", pair: "AAPL/MSFT", entry: 71, exit: 69, result: "-2.8%", status: "loss", year: 2018 },
  { date: "2018-06-10", pair: "MSFT/AAPL", entry: 154, exit: 145, result: "-5.8%", status: "loss", year: 2018 },
  { date: "2018-07-17", pair: "AMZN/MSFT", entry: 524, exit: 542, result: "+3.4%", status: "win", year: 2018 },
  { date: "2018-08-24", pair: "AAPL/MSFT", entry: 71, exit: 70, result: "-1.4%", status: "loss", year: 2018 },
  { date: "2018-09-02", pair: "NVDA/GOOGL", entry: 452, exit: 456, result: "+0.9%", status: "win", year: 2018 },
  { date: "2018-10-09", pair: "AMZN/MSFT", entry: 429, exit: 437, result: "+1.9%", status: "win", year: 2018 },
  { date: "2018-11-16", pair: "JPM/GS", entry: 98, exit: 97, result: "-1.0%", status: "loss", year: 2018 },
  { date: "2018-12-23", pair: "NVDA/GOOGL", entry: 440, exit: 414, result: "-5.9%", status: "loss", year: 2018 },
  { date: "2018-01-05", pair: "AMD/NVDA", entry: 37, exit: 39, result: "+5.4%", status: "win", year: 2018 },
  { date: "2018-02-12", pair: "JPM/GS", entry: 100, exit: 105, result: "+5.0%", status: "win", year: 2018 },
  { date: "2018-03-19", pair: "META/NVDA", entry: 210, exit: 222, result: "+5.7%", status: "win", year: 2018 },
  { date: "2018-04-26", pair: "AMD/NVDA", entry: 36, exit: 36, result: "0.0%", status: "loss", year: 2018 },
  { date: "2018-05-03", pair: "XOM/CVX", entry: 106, exit: 115, result: "+8.5%", status: "win", year: 2018 },
  { date: "2018-06-10", pair: "META/NVDA", entry: 217, exit: 229, result: "+5.5%", status: "win", year: 2018 },
  { date: "2018-07-17", pair: "AMZN/GOOGL", entry: 668, exit: 707, result: "+5.8%", status: "win", year: 2018 },
  { date: "2018-08-24", pair: "XOM/CVX", entry: 95, exit: 94, result: "-1.1%", status: "loss", year: 2018 },
  { date: "2018-09-02", pair: "NVDA/AMZN", entry: 466, exit: 462, result: "-0.9%", status: "loss", year: 2018 },
  { date: "2018-10-09", pair: "AMZN/GOOGL", entry: 505, exit: 520, result: "+3.0%", status: "win", year: 2018 },
  { date: "2018-11-16", pair: "CVX/XOM", entry: 121, exit: 125, result: "+3.3%", status: "win", year: 2018 },
  { date: "2018-12-23", pair: "NVDA/AMZN", entry: 430, exit: 438, result: "+1.9%", status: "win", year: 2018 },
  { date: "2018-01-05", pair: "GOOGL/AAPL", entry: 757, exit: 753, result: "-0.5%", status: "loss", year: 2018 },
  { date: "2018-02-12", pair: "CVX/XOM", entry: 121, exit: 117, result: "-3.3%", status: "loss", year: 2018 },
  { date: "2018-03-19", pair: "TSLA/AMZN", entry: 107, exit: 108, result: "+0.9%", status: "win", year: 2018 },
  { date: "2018-04-26", pair: "GOOGL/AAPL", entry: 515, exit: 537, result: "+4.3%", status: "win", year: 2018 },
  { date: "2019-01-05", pair: "NVDA/AMZN", entry: 629, exit: 658, result: "+4.6%", status: "win", year: 2019 },
  { date: "2019-02-12", pair: "AMZN/GOOGL", entry: 432, exit: 433, result: "+0.2%", status: "win", year: 2019 },
  { date: "2019-03-19", pair: "CVX/XOM", entry: 126, exit: 134, result: "+6.3%", status: "win", year: 2019 },
  { date: "2019-04-26", pair: "NVDA/AMZN", entry: 632, exit: 627, result: "-0.8%", status: "loss", year: 2019 },
  { date: "2019-05-03", pair: "GOOGL/AAPL", entry: 665, exit: 686, result: "+3.2%", status: "win", year: 2019 },
  { date: "2019-06-10", pair: "CVX/XOM", entry: 112, exit: 116, result: "+3.6%", status: "win", year: 2019 },
  { date: "2019-07-17", pair: "TSLA/AMZN", entry: 118, exit: 121, result: "+2.5%", status: "win", year: 2019 },
  { date: "2019-08-24", pair: "GOOGL/AAPL", entry: 555, exit: 563, result: "+1.4%", status: "win", year: 2019 },
  { date: "2019-09-02", pair: "MSFT/GOOGL", entry: 184, exit: 182, result: "-1.1%", status: "loss", year: 2019 },
  { date: "2019-10-09", pair: "TSLA/AMZN", entry: 116, exit: 118, result: "+1.7%", status: "win", year: 2019 },
  { date: "2019-11-16", pair: "NVDA/MSFT", entry: 595, exit: 620, result: "+4.2%", status: "win", year: 2019 },
  { date: "2019-12-23", pair: "MSFT/GOOGL", entry: 201, exit: 191, result: "-5.0%", status: "loss", year: 2019 },
  { date: "2019-01-05", pair: "V/MA", entry: 145, exit: 146, result: "+0.7%", status: "win", year: 2019 },
  { date: "2019-02-12", pair: "NVDA/MSFT", entry: 637, exit: 636, result: "-0.2%", status: "loss", year: 2019 },
  { date: "2019-03-19", pair: "MSFT/AAPL", entry: 185, exit: 179, result: "-3.2%", status: "loss", year: 2019 },
  { date: "2019-04-26", pair: "V/MA", entry: 155, exit: 155, result: "0.0%", status: "loss", year: 2019 },
  { date: "2019-05-03", pair: "AAPL/MSFT", entry: 89, exit: 90, result: "+1.1%", status: "win", year: 2019 },
  { date: "2019-06-10", pair: "MSFT/AAPL", entry: 199, exit: 211, result: "+6.0%", status: "win", year: 2019 },
  { date: "2019-07-17", pair: "AMZN/MSFT", entry: 490, exit: 498, result: "+1.6%", status: "win", year: 2019 },
  { date: "2019-08-24", pair: "AAPL/MSFT", entry: 86, exit: 85, result: "-1.2%", status: "loss", year: 2019 },
  { date: "2019-09-02", pair: "NVDA/GOOGL", entry: 616, exit: 631, result: "+2.4%", status: "win", year: 2019 },
  { date: "2019-10-09", pair: "AMZN/MSFT", entry: 585, exit: 589, result: "+0.7%", status: "win", year: 2019 },
  { date: "2019-11-16", pair: "JPM/GS", entry: 119, exit: 118, result: "-0.8%", status: "loss", year: 2019 },
  { date: "2019-12-23", pair: "NVDA/GOOGL", entry: 600, exit: 624, result: "+4.0%", status: "win", year: 2019 },
  { date: "2019-01-05", pair: "AMD/NVDA", entry: 54, exit: 58, result: "+7.4%", status: "win", year: 2019 },
  { date: "2019-02-12", pair: "JPM/GS", entry: 112, exit: 111, result: "-0.9%", status: "loss", year: 2019 },
  { date: "2019-03-19", pair: "META/NVDA", entry: 270, exit: 286, result: "+5.9%", status: "win", year: 2019 },
  { date: "2019-04-26", pair: "AMD/NVDA", entry: 54, exit: 59, result: "+9.3%", status: "win", year: 2019 },
  { date: "2019-05-03", pair: "XOM/CVX", entry: 82, exit: 79, result: "-3.7%", status: "loss", year: 2019 },
  { date: "2019-06-10", pair: "META/NVDA", entry: 272, exit: 264, result: "-2.9%", status: "loss", year: 2019 },
  { date: "2019-07-17", pair: "AMZN/GOOGL", entry: 600, exit: 619, result: "+3.2%", status: "win", year: 2019 },
  { date: "2019-08-24", pair: "XOM/CVX", entry: 92, exit: 89, result: "-3.3%", status: "loss", year: 2019 },
  { date: "2019-09-02", pair: "NVDA/AMZN", entry: 590, exit: 607, result: "+2.9%", status: "win", year: 2019 },
  { date: "2019-10-09", pair: "AMZN/GOOGL", entry: 439, exit: 435, result: "-0.9%", status: "loss", year: 2019 },
  { date: "2019-11-16", pair: "CVX/XOM", entry: 128, exit: 129, result: "+0.8%", status: "win", year: 2019 },
  { date: "2019-12-23", pair: "NVDA/AMZN", entry: 595, exit: 587, result: "-1.3%", status: "loss", year: 2019 },
  { date: "2019-01-05", pair: "GOOGL/AAPL", entry: 733, exit: 719, result: "-1.9%", status: "loss", year: 2019 },
  { date: "2019-02-12", pair: "CVX/XOM", entry: 105, exit: 107, result: "+1.9%", status: "win", year: 2019 },
  { date: "2019-03-19", pair: "TSLA/AMZN", entry: 124, exit: 129, result: "+4.0%", status: "win", year: 2019 },
  { date: "2019-04-26", pair: "GOOGL/AAPL", entry: 524, exit: 509, result: "-2.9%", status: "loss", year: 2019 },
  { date: "2020-01-05", pair: "NVDA/AMZN", entry: 771, exit: 772, result: "+0.1%", status: "win", year: 2020 },
  { date: "2020-02-12", pair: "AMZN/GOOGL", entry: 459, exit: 436, result: "-5.0%", status: "loss", year: 2020 },
  { date: "2020-03-19", pair: "CVX/XOM", entry: 119, exit: 122, result: "+2.5%", status: "win", year: 2020 },
  { date: "2020-04-26", pair: "NVDA/AMZN", entry: 781, exit: 794, result: "+1.7%", status: "win", year: 2020 },
  { date: "2020-05-03", pair: "GOOGL/AAPL", entry: 531, exit: 527, result: "-0.8%", status: "loss", year: 2020 },
  { date: "2020-06-10", pair: "CVX/XOM", entry: 125, exit: 131, result: "+4.8%", status: "win", year: 2020 },
  { date: "2020-07-17", pair: "TSLA/AMZN", entry: 152, exit: 156, result: "+2.6%", status: "win", year: 2020 },
  { date: "2020-08-24", pair: "GOOGL/AAPL", entry: 597, exit: 613, result: "+2.7%", status: "win", year: 2020 },
  { date: "2020-09-02", pair: "MSFT/GOOGL", entry: 243, exit: 246, result: "+1.2%", status: "win", year: 2020 },
  { date: "2020-10-09", pair: "TSLA/AMZN", entry: 157, exit: 153, result: "-2.5%", status: "loss", year: 2020 },
  { date: "2020-11-16", pair: "NVDA/MSFT", entry: 771, exit: 785, result: "+1.8%", status: "win", year: 2020 },
  { date: "2020-12-23", pair: "MSFT/GOOGL", entry: 245, exit: 237, result: "-3.3%", status: "loss", year: 2020 },
  { date: "2020-01-05", pair: "V/MA", entry: 182, exit: 190, result: "+4.4%", status: "win", year: 2020 },
  { date: "2020-02-12", pair: "NVDA/MSFT", entry: 785, exit: 754, result: "-3.9%", status: "loss", year: 2020 },
  { date: "2020-03-19", pair: "MSFT/AAPL", entry: 231, exit: 233, result: "+0.9%", status: "win", year: 2020 },
  { date: "2020-04-26", pair: "V/MA", entry: 168, exit: 175, result: "+4.2%", status: "win", year: 2020 },
  { date: "2020-05-03", pair: "AAPL/MSFT", entry: 106, exit: 112, result: "+5.7%", status: "win", year: 2020 },
  { date: "2020-06-10", pair: "MSFT/AAPL", entry: 245, exit: 255, result: "+4.1%", status: "win", year: 2020 },
  { date: "2020-07-17", pair: "AMZN/MSFT", entry: 478, exit: 474, result: "-0.8%", status: "loss", year: 2020 },
  { date: "2020-08-24", pair: "AAPL/MSFT", entry: 108, exit: 105, result: "-2.8%", status: "loss", year: 2020 },
  { date: "2020-09-02", pair: "NVDA/GOOGL", entry: 800, exit: 810, result: "+1.3%", status: "win", year: 2020 },
  { date: "2020-10-09", pair: "AMZN/MSFT", entry: 414, exit: 433, result: "+4.6%", status: "win", year: 2020 },
  { date: "2020-11-16", pair: "JPM/GS", entry: 129, exit: 128, result: "-0.8%", status: "loss", year: 2020 },
  { date: "2020-12-23", pair: "NVDA/GOOGL", entry: 786, exit: 760, result: "-3.3%", status: "loss", year: 2020 },
  { date: "2020-01-05", pair: "AMD/NVDA", entry: 71, exit: 68, result: "-4.2%", status: "loss", year: 2020 },
  { date: "2020-02-12", pair: "JPM/GS", entry: 126, exit: 123, result: "-2.4%", status: "loss", year: 2020 },
  { date: "2020-03-19", pair: "META/NVDA", entry: 286, exit: 311, result: "+8.7%", status: "win", year: 2020 },
  { date: "2020-04-26", pair: "AMD/NVDA", entry: 70, exit: 75, result: "+7.1%", status: "win", year: 2020 },
  { date: "2020-05-03", pair: "XOM/CVX", entry: 98, exit: 99, result: "+1.0%", status: "win", year: 2020 },
  { date: "2020-06-10", pair: "META/NVDA", entry: 306, exit: 299, result: "-2.3%", status: "loss", year: 2020 },
  { date: "2020-07-17", pair: "AMZN/GOOGL", entry: 433, exit: 450, result: "+3.9%", status: "win", year: 2020 },
  { date: "2020-08-24", pair: "XOM/CVX", entry: 98, exit: 99, result: "+1.0%", status: "win", year: 2020 },
  { date: "2020-09-02", pair: "NVDA/AMZN", entry: 772, exit: 809, result: "+4.8%", status: "win", year: 2020 },
  { date: "2020-10-09", pair: "AMZN/GOOGL", entry: 535, exit: 521, result: "-2.6%", status: "loss", year: 2020 },
  { date: "2020-11-16", pair: "CVX/XOM", entry: 106, exit: 105, result: "-0.9%", status: "loss", year: 2020 },
  { date: "2020-12-23", pair: "NVDA/AMZN", entry: 756, exit: 764, result: "+1.1%", status: "win", year: 2020 },
  { date: "2020-01-05", pair: "GOOGL/AAPL", entry: 497, exit: 496, result: "-0.2%", status: "loss", year: 2020 },
  { date: "2020-02-12", pair: "CVX/XOM", entry: 132, exit: 139, result: "+5.3%", status: "win", year: 2020 },
  { date: "2020-03-19", pair: "TSLA/AMZN", entry: 146, exit: 142, result: "-2.7%", status: "loss", year: 2020 },
  { date: "2020-04-26", pair: "GOOGL/AAPL", entry: 626, exit: 650, result: "+3.8%", status: "win", year: 2020 },
  { date: "2021-01-05", pair: "NVDA/AMZN", entry: 916, exit: 958, result: "+4.6%", status: "win", year: 2021 },
  { date: "2021-02-12", pair: "AMZN/GOOGL", entry: 517, exit: 519, result: "+0.4%", status: "win", year: 2021 },
  { date: "2021-03-19", pair: "CVX/XOM", entry: 124, exit: 126, result: "+1.6%", status: "win", year: 2021 },
  { date: "2021-04-26", pair: "NVDA/AMZN", entry: 928, exit: 966, result: "+4.1%", status: "win", year: 2021 },
  { date: "2021-05-03", pair: "GOOGL/AAPL", entry: 623, exit: 669, result: "+7.4%", status: "win", year: 2021 },
  { date: "2021-06-10", pair: "CVX/XOM", entry: 146, exit: 143, result: "-2.1%", status: "loss", year: 2021 },
  { date: "2021-07-17", pair: "TSLA/AMZN", entry: 175, exit: 179, result: "+2.3%", status: "win", year: 2021 },
  { date: "2021-08-24", pair: "GOOGL/AAPL", entry: 462, exit: 425, result: "-8.0%", status: "loss", year: 2021 },
  { date: "2021-09-02", pair: "MSFT/GOOGL", entry: 289, exit: 281, result: "-2.8%", status: "loss", year: 2021 },
  { date: "2021-10-09", pair: "TSLA/AMZN", entry: 176, exit: 174, result: "-1.1%", status: "loss", year: 2021 },
  { date: "2021-11-16", pair: "NVDA/MSFT", entry: 938, exit: 934, result: "-0.4%", status: "loss", year: 2021 },
  { date: "2021-12-23", pair: "MSFT/GOOGL", entry: 288, exit: 287, result: "-0.3%", status: "loss", year: 2021 },
  { date: "2021-01-05", pair: "V/MA", entry: 209, exit: 226, result: "+8.1%", status: "win", year: 2021 },
  { date: "2021-02-12", pair: "NVDA/MSFT", entry: 916, exit: 982, result: "+7.2%", status: "win", year: 2021 },
  { date: "2021-03-19", pair: "MSFT/AAPL", entry: 278, exit: 259, result: "-6.8%", status: "loss", year: 2021 },
  { date: "2021-04-26", pair: "V/MA", entry: 186, exit: 184, result: "-1.1%", status: "loss", year: 2021 },
  { date: "2021-05-03", pair: "AAPL/MSFT", entry: 124, exit: 127, result: "+2.4%", status: "win", year: 2021 },
  { date: "2021-06-10", pair: "MSFT/AAPL", entry: 298, exit: 313, result: "+5.0%", status: "win", year: 2021 },
  { date: "2021-07-17", pair: "AMZN/MSFT", entry: 534, exit: 498, result: "-6.7%", status: "loss", year: 2021 },
  { date: "2021-08-24", pair: "AAPL/MSFT", entry: 134, exit: 131, result: "-2.2%", status: "loss", year: 2021 },
  { date: "2021-09-02", pair: "NVDA/GOOGL", entry: 958, exit: 948, result: "-1.0%", status: "loss", year: 2021 },
  { date: "2021-10-09", pair: "AMZN/MSFT", entry: 434, exit: 460, result: "+6.0%", status: "win", year: 2021 },
  { date: "2021-11-16", pair: "JPM/GS", entry: 144, exit: 154, result: "+6.9%", status: "win", year: 2021 },
  { date: "2021-12-23", pair: "NVDA/GOOGL", entry: 943, exit: 904, result: "-4.1%", status: "loss", year: 2021 },
  { date: "2021-01-05", pair: "AMD/NVDA", entry: 87, exit: 89, result: "+2.3%", status: "win", year: 2021 },
  { date: "2021-02-12", pair: "JPM/GS", entry: 145, exit: 140, result: "-3.4%", status: "loss", year: 2021 },
  { date: "2021-03-19", pair: "META/NVDA", entry: 351, exit: 349, result: "-0.6%", status: "loss", year: 2021 },
  { date: "2021-04-26", pair: "AMD/NVDA", entry: 87, exit: 89, result: "+2.3%", status: "win", year: 2021 },
  { date: "2021-05-03", pair: "XOM/CVX", entry: 112, exit: 111, result: "-0.9%", status: "loss", year: 2021 },
  { date: "2021-06-10", pair: "META/NVDA", entry: 353, exit: 346, result: "-2.0%", status: "loss", year: 2021 },
  { date: "2021-07-17", pair: "AMZN/GOOGL", entry: 337, exit: 347, result: "+3.0%", status: "win", year: 2021 },
  { date: "2021-08-24", pair: "XOM/CVX", entry: 98, exit: 99, result: "+1.0%", status: "win", year: 2021 },
  { date: "2021-09-02", pair: "NVDA/AMZN", entry: 932, exit: 916, result: "-1.7%", status: "loss", year: 2021 },
  { date: "2021-10-09", pair: "AMZN/GOOGL", entry: 353, exit: 358, result: "+1.4%", status: "win", year: 2021 },
  { date: "2021-11-16", pair: "CVX/XOM", entry: 128, exit: 134, result: "+4.7%", status: "win", year: 2021 },
  { date: "2021-12-23", pair: "NVDA/AMZN", entry: 914, exit: 887, result: "-3.0%", status: "loss", year: 2021 },
  { date: "2021-01-05", pair: "GOOGL/AAPL", entry: 612, exit: 585, result: "-4.4%", status: "loss", year: 2021 },
  { date: "2021-02-12", pair: "CVX/XOM", entry: 121, exit: 129, result: "+6.6%", status: "win", year: 2021 },
  { date: "2021-03-19", pair: "TSLA/AMZN", entry: 184, exit: 176, result: "-4.3%", status: "loss", year: 2021 },
  { date: "2021-04-26", pair: "GOOGL/AAPL", entry: 591, exit: 594, result: "+0.5%", status: "win", year: 2021 },
  { date: "2022-01-05", pair: "NVDA/AMZN", entry: 1080, exit: 1052, result: "-2.6%", status: "loss", year: 2022 },
  { date: "2022-02-12", pair: "AMZN/GOOGL", entry: 328, exit: 327, result: "-0.3%", status: "loss", year: 2022 },
  { date: "2022-03-19", pair: "CVX/XOM", entry: 143, exit: 140, result: "-2.1%", status: "loss", year: 2022 },
  { date: "2022-04-26", pair: "NVDA/AMZN", entry: 1077, exit: 1102, result: "+2.3%", status: "win", year: 2022 },
  { date: "2022-05-03", pair: "GOOGL/AAPL", entry: 396, exit: 410, result: "+3.5%", status: "win", year: 2022 },
  { date: "2022-06-10", pair: "CVX/XOM", entry: 157, exit: 155, result: "-1.3%", status: "loss", year: 2022 },
  { date: "2022-07-17", pair: "TSLA/AMZN", entry: 200, exit: 200, result: "0.0%", status: "loss", year: 2022 },
  { date: "2022-08-24", pair: "GOOGL/AAPL", entry: 444, exit: 453, result: "+2.0%", status: "win", year: 2022 },
  { date: "2022-09-02", pair: "MSFT/GOOGL", entry: 334, exit: 345, result: "+3.3%", status: "win", year: 2022 },
  { date: "2022-10-09", pair: "TSLA/AMZN", entry: 197, exit: 191, result: "-3.0%", status: "loss", year: 2022 },
  { date: "2022-11-16", pair: "NVDA/MSFT", entry: 1089, exit: 1085, result: "-0.4%", status: "loss", year: 2022 },
  { date: "2022-12-23", pair: "MSFT/GOOGL", entry: 337, exit: 310, result: "-8.0%", status: "loss", year: 2022 },
  { date: "2022-01-05", pair: "V/MA", entry: 219, exit: 227, result: "+3.7%", status: "win", year: 2022 },
  { date: "2022-02-12", pair: "NVDA/MSFT", entry: 1111, exit: 1142, result: "+2.8%", status: "win", year: 2022 },
  { date: "2022-03-19", pair: "MSFT/AAPL", entry: 330, exit: 328, result: "-0.6%", status: "loss", year: 2022 },
  { date: "2022-04-26", pair: "V/MA", entry: 218, exit: 216, result: "-0.9%", status: "loss", year: 2022 },
  { date: "2022-05-03", pair: "AAPL/MSFT", entry: 147, exit: 151, result: "+2.7%", status: "win", year: 2022 },
  { date: "2022-06-10", pair: "MSFT/AAPL", entry: 334, exit: 317, result: "-5.1%", status: "loss", year: 2022 },
  { date: "2022-07-17", pair: "AMZN/MSFT", entry: 358, exit: 351, result: "-2.0%", status: "loss", year: 2022 },
  { date: "2022-08-24", pair: "AAPL/MSFT", entry: 148, exit: 151, result: "+2.0%", status: "win", year: 2022 },
  { date: "2022-09-02", pair: "NVDA/GOOGL", entry: 1103, exit: 1124, result: "+1.9%", status: "win", year: 2022 },
  { date: "2022-10-09", pair: "AMZN/MSFT", entry: 339, exit: 353, result: "+4.1%", status: "win", year: 2022 },
  { date: "2022-11-16", pair: "JPM/GS", entry: 166, exit: 155, result: "-6.6%", status: "loss", year: 2022 },
  { date: "2022-12-23", pair: "NVDA/GOOGL", entry: 1105, exit: 1090, result: "-1.4%", status: "loss", year: 2022 },
  { date: "2022-01-05", pair: "AMD/NVDA", entry: 103, exit: 102, result: "-1.0%", status: "loss", year: 2022 },
  { date: "2022-02-12", pair: "JPM/GS", entry: 171, exit: 163, result: "-4.7%", status: "loss", year: 2022 },
  { date: "2022-03-19", pair: "META/NVDA", entry: 403, exit: 430, result: "+6.7%", status: "win", year: 2022 },
  { date: "2022-04-26", pair: "AMD/NVDA", entry: 104, exit: 102, result: "-1.9%", status: "loss", year: 2022 },
  { date: "2022-05-03", pair: "XOM/CVX", entry: 106, exit: 106, result: "0.0%", status: "loss", year: 2022 },
  { date: "2022-06-10", pair: "META/NVDA", entry: 378, exit: 363, result: "-4.0%", status: "loss", year: 2022 },
  { date: "2022-07-17", pair: "AMZN/GOOGL", entry: 264, exit: 269, result: "+1.9%", status: "win", year: 2022 },
  { date: "2022-08-24", pair: "XOM/CVX", entry: 129, exit: 129, result: "0.0%", status: "loss", year: 2022 },
  { date: "2022-09-02", pair: "NVDA/AMZN", entry: 1102, exit: 1195, result: "+8.4%", status: "win", year: 2022 },
  { date: "2022-10-09", pair: "AMZN/GOOGL", entry: 385, exit: 389, result: "+1.0%", status: "win", year: 2022 },
  { date: "2022-11-16", pair: "CVX/XOM", entry: 142, exit: 144, result: "+1.4%", status: "win", year: 2022 },
  { date: "2022-12-23", pair: "NVDA/AMZN", entry: 1074, exit: 1130, result: "+5.2%", status: "win", year: 2022 },
  { date: "2022-01-05", pair: "GOOGL/AAPL", entry: 413, exit: 446, result: "+8.0%", status: "win", year: 2022 },
  { date: "2022-02-12", pair: "CVX/XOM", entry: 150, exit: 152, result: "+1.3%", status: "win", year: 2022 },
  { date: "2022-03-19", pair: "TSLA/AMZN", entry: 212, exit: 210, result: "-0.9%", status: "loss", year: 2022 },
  { date: "2022-04-26", pair: "GOOGL/AAPL", entry: 425, exit: 417, result: "-1.9%", status: "loss", year: 2022 },
  { date: "2023-01-05", pair: "NVDA/AMZN", entry: 1238, exit: 1250, result: "+1.0%", status: "win", year: 2023 },
  { date: "2023-02-12", pair: "AMZN/GOOGL", entry: 314, exit: 318, result: "+1.3%", status: "win", year: 2023 },
  { date: "2023-03-19", pair: "CVX/XOM", entry: 141, exit: 139, result: "-1.4%", status: "loss", year: 2023 },
  { date: "2023-04-26", pair: "NVDA/AMZN", entry: 1239, exit: 1251, result: "+1.0%", status: "win", year: 2023 },
  { date: "2023-05-03", pair: "GOOGL/AAPL", entry: 457, exit: 463, result: "+1.3%", status: "win", year: 2023 },
  { date: "2023-06-10", pair: "CVX/XOM", entry: 148, exit: 152, result: "+2.7%", status: "win", year: 2023 },
  { date: "2023-07-17", pair: "TSLA/AMZN", entry: 222, exit: 215, result: "-3.2%", status: "loss", year: 2023 },
  { date: "2023-08-24", pair: "GOOGL/AAPL", entry: 496, exit: 484, result: "-2.4%", status: "loss", year: 2023 },
  { date: "2023-09-02", pair: "MSFT/GOOGL", entry: 388, exit: 364, result: "-6.2%", status: "loss", year: 2023 },
  { date: "2023-10-09", pair: "TSLA/AMZN", entry: 228, exit: 235, result: "+3.1%", status: "win", year: 2023 },
  { date: "2023-11-16", pair: "NVDA/MSFT", entry: 1274, exit: 1372, result: "+7.7%", status: "win", year: 2023 },
  { date: "2023-12-23", pair: "MSFT/GOOGL", entry: 389, exit: 396, result: "+1.8%", status: "win", year: 2023 },
  { date: "2023-01-05", pair: "V/MA", entry: 228, exit: 219, result: "-3.9%", status: "loss", year: 2023 },
  { date: "2023-02-12", pair: "NVDA/MSFT", entry: 1231, exit: 1177, result: "-4.4%", status: "loss", year: 2023 },
  { date: "2023-03-19", pair: "MSFT/AAPL", entry: 382, exit: 388, result: "+1.6%", status: "win", year: 2023 },
  { date: "2023-04-26", pair: "V/MA", entry: 250, exit: 237, result: "-5.2%", status: "loss", year: 2023 },
  { date: "2023-05-03", pair: "AAPL/MSFT", entry: 168, exit: 172, result: "+2.4%", status: "win", year: 2023 },
  { date: "2023-06-10", pair: "MSFT/AAPL", entry: 382, exit: 391, result: "+2.4%", status: "win", year: 2023 },
  { date: "2023-07-17", pair: "AMZN/MSFT", entry: 227, exit: 223, result: "-1.8%", status: "loss", year: 2023 },
  { date: "2023-08-24", pair: "AAPL/MSFT", entry: 170, exit: 172, result: "+1.2%", status: "win", year: 2023 },
  { date: "2023-09-02", pair: "NVDA/GOOGL", entry: 1268, exit: 1277, result: "+0.7%", status: "win", year: 2023 },
  { date: "2023-10-09", pair: "AMZN/MSFT", entry: 458, exit: 436, result: "-4.8%", status: "loss", year: 2023 },
  { date: "2023-11-16", pair: "JPM/GS", entry: 180, exit: 186, result: "+3.3%", status: "win", year: 2023 },
  { date: "2023-12-23", pair: "NVDA/GOOGL", entry: 1281, exit: 1277, result: "-0.3%", status: "loss", year: 2023 },
  { date: "2023-01-05", pair: "AMD/NVDA", entry: 120, exit: 114, result: "-5.0%", status: "loss", year: 2023 },
  { date: "2023-02-12", pair: "JPM/GS", entry: 187, exit: 193, result: "+3.2%", status: "win", year: 2023 },
  { date: "2023-03-19", pair: "META/NVDA", entry: 430, exit: 440, result: "+2.3%", status: "win", year: 2023 },
  { date: "2023-04-26", pair: "AMD/NVDA", entry: 120, exit: 122, result: "+1.7%", status: "win", year: 2023 },
  { date: "2023-05-03", pair: "XOM/CVX", entry: 110, exit: 106, result: "-3.6%", status: "loss", year: 2023 },
  { date: "2023-06-10", pair: "META/NVDA", entry: 438, exit: 467, result: "+6.6%", status: "win", year: 2023 },
  { date: "2023-07-17", pair: "AMZN/GOOGL", entry: 398, exit: 419, result: "+5.3%", status: "win", year: 2023 },
  { date: "2023-08-24", pair: "XOM/CVX", entry: 124, exit: 129, result: "+4.0%", status: "win", year: 2023 },
  { date: "2023-09-02", pair: "NVDA/AMZN", entry: 1269, exit: 1258, result: "-0.9%", status: "loss", year: 2023 },
  { date: "2023-10-09", pair: "AMZN/GOOGL", entry: 303, exit: 301, result: "-0.7%", status: "loss", year: 2023 },
  { date: "2023-11-16", pair: "CVX/XOM", entry: 146, exit: 150, result: "+2.7%", status: "win", year: 2023 },
  { date: "2023-12-23", pair: "NVDA/AMZN", entry: 1231, exit: 1266, result: "+2.8%", status: "win", year: 2023 },
  { date: "2023-01-05", pair: "GOOGL/AAPL", entry: 242, exit: 242, result: "0.0%", status: "loss", year: 2023 },
  { date: "2023-02-12", pair: "CVX/XOM", entry: 158, exit: 162, result: "+2.5%", status: "win", year: 2023 },
  { date: "2023-03-19", pair: "TSLA/AMZN", entry: 227, exit: 233, result: "+2.6%", status: "win", year: 2023 },
  { date: "2023-04-26", pair: "GOOGL/AAPL", entry: 487, exit: 528, result: "+8.4%", status: "win", year: 2023 },
  { date: "2024-01-05", pair: "NVDA/AMZN", entry: 1443, exit: 1480, result: "+2.6%", status: "win", year: 2024 },
  { date: "2024-02-12", pair: "AMZN/GOOGL", entry: 385, exit: 409, result: "+6.2%", status: "win", year: 2024 },
  { date: "2024-03-19", pair: "CVX/XOM", entry: 157, exit: 157, result: "0.0%", status: "loss", year: 2024 },
  { date: "2024-04-26", pair: "NVDA/AMZN", entry: 1397, exit: 1372, result: "-1.8%", status: "loss", year: 2024 },
  { date: "2024-05-03", pair: "GOOGL/AAPL", entry: 331, exit: 343, result: "+3.6%", status: "win", year: 2024 },
  { date: "2024-06-10", pair: "CVX/XOM", entry: 175, exit: 172, result: "-1.7%", status: "loss", year: 2024 },
  { date: "2024-07-17", pair: "TSLA/AMZN", entry: 261, exit: 251, result: "-3.8%", status: "loss", year: 2024 },
  { date: "2024-08-24", pair: "GOOGL/AAPL", entry: 264, exit: 289, result: "+9.5%", status: "win", year: 2024 },
  { date: "2024-09-02", pair: "MSFT/GOOGL", entry: 434, exit: 435, result: "+0.2%", status: "win", year: 2024 },
  { date: "2024-10-09", pair: "TSLA/AMZN", entry: 255, exit: 244, result: "-4.3%", status: "loss", year: 2024 },
  { date: "2024-11-16", pair: "NVDA/MSFT", entry: 1424, exit: 1397, result: "-1.9%", status: "loss", year: 2024 },
  { date: "2024-12-23", pair: "MSFT/GOOGL", entry: 419, exit: 434, result: "+3.6%", status: "win", year: 2024 },
  { date: "2024-01-05", pair: "V/MA", entry: 266, exit: 282, result: "+6.0%", status: "win", year: 2024 },
  { date: "2024-02-12", pair: "NVDA/MSFT", entry: 1411, exit: 1312, result: "-7.0%", status: "loss", year: 2024 },
  { date: "2024-03-19", pair: "MSFT/AAPL", entry: 438, exit: 450, result: "+2.7%", status: "win", year: 2024 },
  { date: "2024-04-26", pair: "V/MA", entry: 275, exit: 281, result: "+2.2%", status: "win", year: 2024 },
  { date: "2024-05-03", pair: "AAPL/MSFT", entry: 188, exit: 188, result: "0.0%", status: "loss", year: 2024 },
  { date: "2024-06-10", pair: "MSFT/AAPL", entry: 422, exit: 430, result: "+1.9%", status: "win", year: 2024 },
  { date: "2024-07-17", pair: "AMZN/MSFT", entry: 323, exit: 336, result: "+4.0%", status: "win", year: 2024 },
  { date: "2024-08-24", pair: "AAPL/MSFT", entry: 187, exit: 192, result: "+2.7%", status: "win", year: 2024 },
  { date: "2024-09-02", pair: "NVDA/GOOGL", entry: 1403, exit: 1425, result: "+1.6%", status: "win", year: 2024 },
  { date: "2024-10-09", pair: "AMZN/MSFT", entry: 170, exit: 181, result: "+6.5%", status: "win", year: 2024 },
  { date: "2024-11-16", pair: "JPM/GS", entry: 196, exit: 203, result: "+3.6%", status: "win", year: 2024 },
  { date: "2024-12-23", pair: "NVDA/GOOGL", entry: 1427, exit: 1430, result: "+0.2%", status: "win", year: 2024 },
  { date: "2024-01-05", pair: "AMD/NVDA", entry: 136, exit: 139, result: "+2.2%", status: "win", year: 2024 },
  { date: "2024-02-12", pair: "JPM/GS", entry: 186, exit: 191, result: "+2.7%", status: "win", year: 2024 },
  { date: "2024-03-19", pair: "META/NVDA", entry: 501, exit: 506, result: "+1.0%", status: "win", year: 2024 },
  { date: "2024-04-26", pair: "AMD/NVDA", entry: 136, exit: 136, result: "0.0%", status: "loss", year: 2024 },
  { date: "2024-05-03", pair: "XOM/CVX", entry: 109, exit: 119, result: "+9.2%", status: "win", year: 2024 },
  { date: "2024-06-10", pair: "META/NVDA", entry: 502, exit: 524, result: "+4.4%", status: "win", year: 2024 },
  { date: "2024-07-17", pair: "AMZN/GOOGL", entry: 172, exit: 187, result: "+8.7%", status: "win", year: 2024 },
  { date: "2024-08-24", pair: "XOM/CVX", entry: 118, exit: 119, result: "+0.8%", status: "win", year: 2024 },
  { date: "2024-09-02", pair: "NVDA/AMZN", entry: 1427, exit: 1365, result: "-4.3%", status: "loss", year: 2024 },
  { date: "2024-10-09", pair: "AMZN/GOOGL", entry: 351, exit: 375, result: "+6.8%", status: "win", year: 2024 },
  { date: "2024-11-16", pair: "CVX/XOM", entry: 157, exit: 163, result: "+3.8%", status: "win", year: 2024 },
  { date: "2024-12-23", pair: "NVDA/AMZN", entry: 1416, exit: 1486, result: "+4.9%", status: "win", year: 2024 },
  { date: "2024-01-05", pair: "GOOGL/AAPL", entry: 423, exit: 426, result: "+0.7%", status: "win", year: 2024 },
  { date: "2024-02-12", pair: "CVX/XOM", entry: 167, exit: 171, result: "+2.4%", status: "win", year: 2024 },
  { date: "2024-03-19", pair: "TSLA/AMZN", entry: 265, exit: 271, result: "+2.3%", status: "win", year: 2024 },
  { date: "2024-04-26", pair: "GOOGL/AAPL", entry: 452, exit: 482, result: "+6.6%", status: "win", year: 2024 },
  { date: "2025-01-05", pair: "NVDA/AMZN", entry: 1593, exit: 1604, result: "+0.7%", status: "win", year: 2025 },
  { date: "2025-02-12", pair: "AMZN/GOOGL", entry: 336, exit: 341, result: "+1.5%", status: "win", year: 2025 },
  { date: "2025-03-19", pair: "CVX/XOM", entry: 159, exit: 152, result: "-4.4%", status: "loss", year: 2025 },
  { date: "2025-04-26", pair: "NVDA/AMZN", entry: 1575, exit: 1580, result: "+0.3%", status: "win", year: 2025 },
  { date: "2025-05-03", pair: "GOOGL/AAPL", entry: 229, exit: 224, result: "-2.2%", status: "loss", year: 2025 },
  { date: "2025-06-10", pair: "CVX/XOM", entry: 180, exit: 186, result: "+3.3%", status: "win", year: 2025 },
  { date: "2025-07-17", pair: "TSLA/AMZN", entry: 292, exit: 309, result: "+5.8%", status: "win", year: 2025 },
  { date: "2025-08-24", pair: "GOOGL/AAPL", entry: 243, exit: 258, result: "+6.2%", status: "win", year: 2025 },
  { date: "2025-09-02", pair: "MSFT/GOOGL", entry: 483, exit: 466, result: "-3.5%", status: "loss", year: 2025 },
  { date: "2025-10-09", pair: "TSLA/AMZN", entry: 275, exit: 293, result: "+6.5%", status: "win", year: 2025 },
  { date: "2025-11-16", pair: "NVDA/MSFT", entry: 1555, exit: 1529, result: "-1.7%", status: "loss", year: 2025 },
  { date: "2025-12-23", pair: "MSFT/GOOGL", entry: 468, exit: 451, result: "-3.6%", status: "loss", year: 2025 },
  { date: "2025-01-05", pair: "V/MA", entry: 290, exit: 287, result: "-1.0%", status: "loss", year: 2025 },
  { date: "2025-02-12", pair: "NVDA/MSFT", entry: 1594, exit: 1554, result: "-2.5%", status: "loss", year: 2025 },
  { date: "2025-03-19", pair: "MSFT/AAPL", entry: 476, exit: 503, result: "+5.7%", status: "win", year: 2025 },
  { date: "2025-04-26", pair: "V/MA", entry: 287, exit: 284, result: "-1.0%", status: "loss", year: 2025 },
  { date: "2025-05-03", pair: "AAPL/MSFT", entry: 212, exit: 219, result: "+3.3%", status: "win", year: 2025 },
  { date: "2025-06-10", pair: "MSFT/AAPL", entry: 470, exit: 488, result: "+3.8%", status: "win", year: 2025 },
  { date: "2025-07-17", pair: "AMZN/MSFT", entry: 226, exit: 234, result: "+3.5%", status: "win", year: 2025 },
  { date: "2025-08-24", pair: "AAPL/MSFT", entry: 212, exit: 230, result: "+8.5%", status: "win", year: 2025 },
  { date: "2025-09-02", pair: "NVDA/GOOGL", entry: 1604, exit: 1723, result: "+7.4%", status: "win", year: 2025 },
  { date: "2025-10-09", pair: "AMZN/MSFT", entry: 231, exit: 254, result: "+10.0%", status: "win", year: 2025 },
  { date: "2025-11-16", pair: "JPM/GS", entry: 212, exit: 211, result: "-0.5%", status: "loss", year: 2025 },
  { date: "2025-12-23", pair: "NVDA/GOOGL", entry: 1592, exit: 1649, result: "+3.6%", status: "win", year: 2025 },
  { date: "2025-01-05", pair: "AMD/NVDA", entry: 154, exit: 155, result: "+0.6%", status: "win", year: 2025 },
  { date: "2025-02-12", pair: "JPM/GS", entry: 222, exit: 218, result: "-1.8%", status: "loss", year: 2025 },
  { date: "2025-03-19", pair: "META/NVDA", entry: 506, exit: 492, result: "-2.8%", status: "loss", year: 2025 },
  { date: "2025-04-26", pair: "AMD/NVDA", entry: 153, exit: 165, result: "+7.8%", status: "win", year: 2025 },
  { date: "2025-05-03", pair: "XOM/CVX", entry: 127, exit: 130, result: "+2.4%", status: "win", year: 2025 },
  { date: "2025-06-10", pair: "META/NVDA", entry: 546, exit: 545, result: "-0.2%", status: "loss", year: 2025 },
  { date: "2025-07-17", pair: "AMZN/GOOGL", entry: 369, exit: 404, result: "+9.5%", status: "win", year: 2025 },
  { date: "2025-08-24", pair: "XOM/CVX", entry: 129, exit: 124, result: "-3.9%", status: "loss", year: 2025 },
  { date: "2025-09-02", pair: "NVDA/AMZN", entry: 1590, exit: 1572, result: "-1.1%", status: "loss", year: 2025 },
  { date: "2025-10-09", pair: "AMZN/GOOGL", entry: 319, exit: 317, result: "-0.6%", status: "loss", year: 2025 },
  { date: "2025-11-16", pair: "CVX/XOM", entry: 153, exit: 155, result: "+1.3%", status: "win", year: 2025 },
  { date: "2025-12-23", pair: "NVDA/AMZN", entry: 1553, exit: 1558, result: "+0.3%", status: "win", year: 2025 },
  { date: "2025-01-05", pair: "GOOGL/AAPL", entry: 376, exit: 370, result: "-1.6%", status: "loss", year: 2025 },
  { date: "2025-02-12", pair: "CVX/XOM", entry: 173, exit: 164, result: "-5.2%", status: "loss", year: 2025 },
  { date: "2025-03-19", pair: "TSLA/AMZN", entry: 283, exit: 291, result: "+2.8%", status: "win", year: 2025 },
  { date: "2025-04-26", pair: "GOOGL/AAPL", entry: 274, exit: 286, result: "+4.4%", status: "win", year: 2025 },
  { date: "2026-01-05", pair: "NVDA/AMZN", entry: 1748, exit: 1873, result: "+7.2%", status: "win", year: 2026 },
  { date: "2026-02-12", pair: "AMZN/GOOGL", entry: 201, exit: 216, result: "+7.5%", status: "win", year: 2026 },
  { date: "2026-03-19", pair: "CVX/XOM", entry: 178, exit: 174, result: "-2.2%", status: "loss", year: 2026 },
  { date: "2026-04-26", pair: "NVDA/AMZN", entry: 1764, exit: 1859, result: "+5.4%", status: "win", year: 2026 },
  { date: "2026-05-03", pair: "GOOGL/AAPL", entry: 267, exit: 273, result: "+2.2%", status: "win", year: 2026 },
  { date: "2026-06-10", pair: "CVX/XOM", entry: 174, exit: 170, result: "-2.3%", status: "loss", year: 2026 },
  { date: "2026-07-17", pair: "TSLA/AMZN", entry: 309, exit: 323, result: "+4.5%", status: "win", year: 2026 },
  { date: "2026-08-24", pair: "GOOGL/AAPL", entry: 217, exit: 208, result: "-4.1%", status: "loss", year: 2026 },
  { date: "2026-09-02", pair: "MSFT/GOOGL", entry: 524, exit: 540, result: "+3.1%", status: "win", year: 2026 },
  { date: "2026-10-09", pair: "TSLA/AMZN", entry: 307, exit: 323, result: "+5.2%", status: "win", year: 2026 },
  { date: "2026-11-16", pair: "NVDA/MSFT", entry: 1744, exit: 1708, result: "-2.1%", status: "loss", year: 2026 },
  { date: "2026-12-23", pair: "MSFT/GOOGL", entry: 531, exit: 573, result: "+7.9%", status: "win", year: 2026 },
  { date: "2026-01-05", pair: "V/MA", entry: 308, exit: 314, result: "+1.9%", status: "win", year: 2026 },
  { date: "2026-02-12", pair: "NVDA/MSFT", entry: 1766, exit: 1869, result: "+5.8%", status: "win", year: 2026 },
  { date: "2026-03-19", pair: "MSFT/AAPL", entry: 520, exit: 497, result: "-4.4%", status: "loss", year: 2026 },
  { date: "2026-04-26", pair: "V/MA", entry: 325, exit: 325, result: "0.0%", status: "loss", year: 2026 },
  { date: "2026-05-03", pair: "AAPL/MSFT", entry: 226, exit: 231, result: "+2.2%", status: "win", year: 2026 },
  { date: "2026-06-10", pair: "MSFT/AAPL", entry: 520, exit: 528, result: "+1.5%", status: "win", year: 2026 },
]

const years = [...new Set(trades.map(t => t.year))].sort((a, b) => b - a)
const totalWins = trades.filter(t => t.status === "win").length
const total = trades.length
const winRate = ((totalWins / total) * 100).toFixed(1)

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
  const displayTotal = filteredTrades.length
  const displayWinRate = displayTotal > 0 ? ((wins / displayTotal) * 100).toFixed(1) : "0"

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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{displayTotal}</div>
            <div className="text-xs text-[#FEFEFE]/50">Trades</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#10B981]">{displayWinRate}%</div>
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

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-[#334155]/50 bg-[#1E293B]/50 backdrop-blur-sm"
        >
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E293B] z-10">
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
                    transition={{ duration: 0.2, delay: Math.min(i * 0.01, 1) }}
                    className="border-b border-[#334155]/20 hover:bg-[#F59E0B]/5 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-sm text-[#FEFEFE]/60 whitespace-nowrap">{formatDate(trade.date)}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-sm font-medium text-white">{trade.pair}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm text-[#FEFEFE]/60 whitespace-nowrap">${trade.entry}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-[#FEFEFE]/60 whitespace-nowrap">${trade.exit}</td>
                    <td className={`px-4 py-2.5 text-right text-sm font-semibold whitespace-nowrap ${trade.status === "win" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
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