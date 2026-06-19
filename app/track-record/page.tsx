"use client"

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const trades = [
  {t:"SE",d:"2020-01-02",ex:"2020-02-03",ra:"REBALANCE_ADJUST",pe:40.08,ps:46.42,pp:15.81,me:599.99,peur:94.86,ca:3000,cap:3094.86,s:"win",y:2020},
  {t:"LRCX",d:"2020-01-02",ex:"2020-02-03",ra:"REBALANCE_ADJUST",pe:27.74,ps:28.73,pp:3.54,me:618.97,peur:21.91,ca:3094.86,cap:3116.77,s:"win",y:2020},
  {t:"KLAC",d:"2020-01-02",ex:"2020-02-03",ra:"REBALANCE_ADJUST",pe:16.97,ps:15.79,pp:-6.92,me:623.36,peur:-43.14,ca:3116.77,cap:3073.63,s:"loss",y:2020},
  {t:"CMG",d:"2020-01-02",ex:"2020-02-03",ra:"DROPPED_FROM_TOP",pe:17.18,ps:17.33,pp:0.86,me:614.72,peur:5.29,ca:3073.63,cap:3078.92,s:"win",y:2020},
  {t:"KLAC",d:"2020-02-03",ex:"2020-03-02",ra:"DROPPED_FROM_TOP",pe:15.79,ps:14.79,pp:-6.31,me:615.79,peur:-38.86,ca:3078.92,cap:3040.06,s:"loss",y:2020},
  {t:"LRCX",d:"2020-02-03",ex:"2020-03-02",ra:"REBALANCE_ADJUST",pe:28.73,ps:27.97,pp:-2.63,me:608.01,peur:-15.99,ca:3040.06,cap:3024.07,s:"loss",y:2020},
  {t:"SE",d:"2020-02-03",ex:"2020-03-02",ra:"REBALANCE_ADJUST",pe:46.42,ps:48.09,pp:3.6,me:604.82,peur:21.77,ca:3024.07,cap:3045.85,s:"win",y:2020},
  {t:"TGT",d:"2020-02-03",ex:"2020-03-02",ra:"DROPPED_FROM_TOP",pe:94.22,ps:91.67,pp:-2.71,me:609.18,peur:-16.51,ca:3045.85,cap:3029.34,s:"loss",y:2020},
  {t:"QCOM",d:"2020-03-02",ex:"2020-04-01",ra:"DROPPED_FROM_TOP",pe:69.89,ps:57.51,pp:-17.71,me:605.86,peur:-107.3,ca:3029.34,cap:2922.04,s:"loss",y:2020},
  {t:"NVDA",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:6.88,ps:6.05,pp:-12.07,me:584.41,peur:-70.54,ca:2922.04,cap:2851.5,s:"loss",y:2020},
  {t:"SE",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:48.09,ps:43.21,pp:-10.14,me:570.29,peur:-57.83,ca:2851.5,cap:2793.67,s:"loss",y:2020},
  {t:"AAPL",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:72.21,ps:58.21,pp:-19.38,me:558.73,peur:-108.28,ca:2793.67,cap:2685.39,s:"loss",y:2020},
  {t:"LRCX",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:27.97,ps:20.92,pp:-25.19,me:268.54,peur:-53.71,ca:2685.39,cap:2631.68,s:"loss",y:2020},
  {t:"NVDA",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:6.05,ps:7.03,pp:16.1,me:263.17,peur:42.37,ca:2631.68,cap:2674.05,s:"win",y:2020},
  {t:"SE",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:43.21,ps:54.73,pp:26.64,me:534.81,peur:142.47,ca:2674.05,cap:2816.53,s:"win",y:2020},
  {t:"AAPL",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:58.21,ps:69.71,pp:19.75,me:563.31,peur:111.25,ca:2816.53,cap:2927.78,s:"win",y:2020},
  {t:"LRCX",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:20.92,ps:21.98,pp:5.02,me:585.54,peur:29.39,ca:2927.78,cap:2957.18,s:"win",y:2020},
  {t:"SE",d:"2020-06-01",ex:"2020-07-01",ra:"REBALANCE_ADJUST",pe:82.55,ps:114.57,pp:38.79,me:591.43,peur:229.42,ca:2957.18,cap:3186.59,s:"win",y:2020},
  {t:"REGN",d:"2020-06-01",ex:"2020-07-01",ra:"REBALANCE_ADJUST",pe:595.15,ps:604.78,pp:1.62,me:637.31,peur:10.32,ca:3186.59,cap:3196.92,s:"win",y:2020},
  {t:"HUM",d:"2020-06-01",ex:"2020-07-01",ra:"DROPPED_FROM_TOP",pe:380.15,ps:370.6,pp:-2.51,me:639.38,peur:-16.05,ca:3196.92,cap:3180.87,s:"loss",y:2020},
  {t:"NEM",d:"2020-06-01",ex:"2020-07-01",ra:"DROPPED_FROM_TOP",pe:50.73,ps:51.58,pp:1.67,me:636.17,peur:10.62,ca:3180.87,cap:3191.49,s:"win",y:2020},
  {t:"NVDA",d:"2020-06-01",ex:"2020-07-01",ra:"REBALANCE_ADJUST",pe:8.77,ps:9.5,pp:8.27,me:638.31,peur:52.79,ca:3191.49,cap:3244.28,s:"win",y:2020},
  {t:"AAPL",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:88.22,ps:105.58,pp:19.68,me:648.87,peur:127.7,ca:3244.28,cap:3371.98,s:"win",y:2020},
  {t:"BBBY",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:30.1,ps:83.04,pp:175.89,me:674.39,peur:1186.18,ca:3371.98,cap:4558.16,s:"win",y:2020},
  {t:"NVDA",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:9.5,ps:10.97,pp:15.53,me:911.65,peur:141.58,ca:4558.16,cap:4699.74,s:"win",y:2020},
  {t:"REGN",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:604.78,ps:640.53,pp:5.91,me:939.98,peur:55.55,ca:4699.74,cap:4755.29,s:"win",y:2020},
  {t:"SE",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:114.57,ps:132.88,pp:15.98,me:951.06,peur:151.98,ca:4755.29,cap:4907.27,s:"win",y:2020},
  {t:"AAPL",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:105.58,ps:130.28,pp:23.39,me:981.45,peur:229.56,ca:4907.27,cap:5136.83,s:"win",y:2020},
  {t:"BBBY",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:83.04,ps:88.52,pp:6.59,me:1027.36,peur:67.7,ca:5136.83,cap:5204.54,s:"win",y:2020},
  {t:"NVDA",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:10.97,ps:13.78,pp:25.57,me:1040.9,peur:266.16,ca:5204.54,cap:5470.69,s:"win",y:2020},
  {t:"REGN",d:"2020-08-03",ex:"2020-09-01",ra:"DROPPED_FROM_TOP",pe:640.53,ps:587.24,pp:-8.32,me:1094.13,peur:-91.03,ca:5470.69,cap:5379.66,s:"loss",y:2020},
  {t:"SE",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:132.88,ps:161.96,pp:21.88,me:1075.91,peur:235.41,ca:5379.66,cap:5615.07,s:"win",y:2020},
  {t:"SE",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:161.96,ps:160.16,pp:-1.11,me:1123,peur:-12.47,ca:5615.07,cap:5602.61,s:"loss",y:2020},
  {t:"NVDA",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:13.78,ps:13.57,pp:-1.49,me:1120.53,peur:-16.7,ca:5602.61,cap:5585.91,s:"loss",y:2020},
  {t:"BBBY",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:88.52,ps:83.95,pp:-5.16,me:1117.17,peur:-57.65,ca:5585.91,cap:5528.26,s:"loss",y:2020},
  {t:"AAPL",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:130.28,ps:113.4,pp:-12.96,me:1105.65,peur:-143.29,ca:5528.26,cap:5384.97,s:"loss",y:2020},
  {t:"AAPL",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:113.4,ps:105.61,pp:-6.87,me:1077,peur:-73.99,ca:5384.97,cap:5310.98,s:"loss",y:2020},
  {t:"ADT",d:"2020-10-01",ex:"2020-11-02",ra:"DROPPED_FROM_TOP",pe:7.14,ps:5.86,pp:-17.93,me:531.1,peur:-95.23,ca:5310.98,cap:5215.76,s:"loss",y:2020},
  {t:"BBBY",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:83.95,ps:58.44,pp:-30.39,me:521.57,peur:-104.31,ca:5215.76,cap:5111.44,s:"loss",y:2020},
  {t:"NVDA",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:13.57,ps:12.54,pp:-7.59,me:511.15,peur:-38.8,ca:5111.44,cap:5072.65,s:"loss",y:2020},
  {t:"SE",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:160.16,ps:159.83,pp:-0.21,me:507.26,peur:-1.07,ca:5072.65,cap:5071.58,s:"loss",y:2020},
  {t:"AAPL",d:"2020-11-02",ex:"2020-12-01",ra:"DROPPED_FROM_TOP",pe:105.61,ps:119.12,pp:12.79,me:507.16,peur:64.87,ca:5071.58,cap:5136.45,s:"win",y:2020},
  {t:"BBBY",d:"2020-11-02",ex:"2020-12-01",ra:"REBALANCE_ADJUST",pe:58.44,ps:63.2,pp:8.15,me:1027.3,peur:83.72,ca:5136.45,cap:5220.17,s:"win",y:2020},
  {t:"NVDA",d:"2020-11-02",ex:"2020-12-01",ra:"REBALANCE_ADJUST",pe:12.54,ps:13.35,pp:6.43,me:1044.03,peur:67.13,ca:5220.17,cap:5287.3,s:"win",y:2020},
  {t:"SE",d:"2020-11-02",ex:"2020-12-01",ra:"REBALANCE_ADJUST",pe:159.83,ps:177.56,pp:11.09,me:1057.48,peur:117.27,ca:5287.3,cap:5404.58,s:"win",y:2020},
  {t:"SE",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:177.56,ps:196.26,pp:10.53,me:1080.91,peur:113.82,ca:5404.58,cap:5518.4,s:"win",y:2020},
  {t:"NVDA",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:13.35,ps:13.07,pp:-2.04,me:1103.67,peur:-22.51,ca:5518.4,cap:5495.88,s:"loss",y:2020},
  {t:"BBBY",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:63.2,ps:49.51,pp:-21.67,me:1099.18,peur:-219.84,ca:5495.88,cap:5276.05,s:"loss",y:2020},
  {t:"GME",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:3.95,ps:4.32,pp:9.18,me:1055.19,peur:96.87,ca:5276.05,cap:5372.91,s:"win",y:2020},
  {t:"BBBY",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:49.51,ps:79.6,pp:60.78,me:1074.58,peur:653.13,ca:5372.91,cap:6026.04,s:"win",y:2021},
  {t:"GME",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:4.32,ps:56.31,pp:1204.35,me:1205.21,peur:14514.92,ca:6026.04,cap:20540.96,s:"win",y:2021},
  {t:"NVDA",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:13.07,ps:13.2,pp:0.94,me:4108.22,peur:38.62,ca:20540.96,cap:20579.58,s:"win",y:2021},
  {t:"SE",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:196.26,ps:233.76,pp:19.11,me:4115.98,peur:786.56,ca:20579.58,cap:21366.14,s:"win",y:2021},
  {t:"SE",d:"2021-02-01",ex:"2021-03-01",ra:"REBALANCE_ADJUST",pe:233.76,ps:248.76,pp:6.41,me:4273.21,peur:273.91,ca:21366.14,cap:21640.06,s:"win",y:2021},
  {t:"BBBY",d:"2021-02-01",ex:"2021-03-01",ra:"REBALANCE_ADJUST",pe:79.6,ps:73.1,pp:-8.16,me:4328.01,peur:-353.17,ca:21640.06,cap:21286.89,s:"loss",y:2021},
  {t:"GME",d:"2021-02-01",ex:"2021-03-01",ra:"REBALANCE_ADJUST",pe:56.31,ps:30.13,pp:-46.49,me:4257.4,peur:-851.48,ca:21286.89,cap:20435.41,s:"loss",y:2021},
  {t:"NVDA",d:"2021-02-01",ex:"2021-03-01",ra:"DROPPED_FROM_TOP",pe:13.2,ps:13.77,pp:4.36,me:4087.05,peur:178.2,ca:20435.41,cap:20613.61,s:"win",y:2021},
  {t:"PYPL",d:"2021-02-01",ex:"2021-03-01",ra:"DROPPED_FROM_TOP",pe:240.01,ps:271.01,pp:12.91,me:4122.8,peur:532.25,ca:20613.61,cap:21145.86,s:"win",y:2021},
  {t:"SE",d:"2021-03-01",ex:"2021-04-01",ra:"REBALANCE_ADJUST",pe:248.76,ps:236.69,pp:-4.85,me:4229.17,peur:-205.11,ca:21145.86,cap:20940.75,s:"loss",y:2021},
  {t:"GME",d:"2021-03-01",ex:"2021-04-01",ra:"REBALANCE_ADJUST",pe:30.13,ps:47.91,pp:59.01,me:4188.16,peur:2471.43,ca:20940.75,cap:23412.18,s:"win",y:2021},
  {t:"EQT",d:"2021-03-01",ex:"2021-04-01",ra:"DROPPED_FROM_TOP",pe:17.24,ps:17.69,pp:2.61,me:4682.43,peur:122.21,ca:23412.18,cap:23534.39,s:"win",y:2021},
  {t:"BBBY",d:"2021-03-01",ex:"2021-04-01",ra:"REBALANCE_ADJUST",pe:73.1,ps:68.77,pp:-5.93,me:4706.85,peur:-279.12,ca:23534.39,cap:23255.27,s:"loss",y:2021},
  {t:"SE",d:"2021-04-01",ex:"2021-05-03",ra:"REBALANCE_ADJUST",pe:236.69,ps:254.87,pp:7.68,me:4651.04,peur:357.2,ca:23255.27,cap:23612.47,s:"win",y:2021},
  {t:"BBBY",d:"2021-04-01",ex:"2021-05-03",ra:"REBALANCE_ADJUST",pe:68.77,ps:82.58,pp:20.09,me:4722.47,peur:948.74,ca:23612.47,cap:24561.22,s:"win",y:2021},
  {t:"FOSL",d:"2021-04-01",ex:"2021-05-03",ra:"DROPPED_FROM_TOP",pe:12.49,ps:13.11,pp:4.92,me:4912.26,peur:241.68,ca:24561.22,cap:24802.9,s:"win",y:2021},
  {t:"GME",d:"2021-04-01",ex:"2021-05-03",ra:"REBALANCE_ADJUST",pe:47.91,ps:40.59,pp:-15.28,me:4960.56,peur:-757.97,ca:24802.9,cap:24044.93,s:"loss",y:2021},
  {t:"RRC",d:"2021-04-01",ex:"2021-05-03",ra:"DROPPED_FROM_TOP",pe:10.62,ps:10.39,pp:-2.18,me:4809.01,peur:-104.84,ca:24044.93,cap:23940.09,s:"loss",y:2021},
  {t:"GME",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:40.59,ps:62.32,pp:53.53,me:4788.02,peur:2563.03,ca:23940.09,cap:26503.11,s:"win",y:2021},
  {t:"SE",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:254.87,ps:257.8,pp:1.15,me:5300.61,peur:60.96,ca:26503.11,cap:26564.07,s:"win",y:2021},
  {t:"BBBY",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:82.58,ps:85.75,pp:3.83,me:5312.79,peur:203.48,ca:26564.07,cap:26767.55,s:"win",y:2021},
  {t:"CPRI",d:"2021-05-03",ex:"2021-06-01",ra:"DROPPED_FROM_TOP",pe:57.47,ps:56.21,pp:-2.18,me:5353.54,peur:-116.71,ca:26767.55,cap:26650.84,s:"loss",y:2021},
  {t:"SIG",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:59.45,ps:59.53,pp:0.14,me:5330.17,peur:7.46,ca:26650.84,cap:26658.31,s:"win",y:2021},
  {t:"SIG",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:59.53,ps:75.36,pp:26.59,me:5331.68,peur:1417.69,ca:26658.31,cap:28076,s:"win",y:2021},
  {t:"SE",d:"2021-06-01",ex:"2021-07-01",ra:"DROPPED_FROM_TOP",pe:257.8,ps:272.04,pp:5.52,me:5615.17,peur:309.96,ca:28076,cap:28385.96,s:"win",y:2021},
  {t:"FCX",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:41.32,ps:34.66,pp:-16.1,me:5677.17,peur:-914.03,ca:28385.96,cap:27471.93,s:"loss",y:2021},
  {t:"GME",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:62.32,ps:51.14,pp:-17.93,me:5494.37,peur:-985.14,ca:27471.93,cap:26486.79,s:"loss",y:2021},
  {t:"BBBY",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:85.75,ps:90.37,pp:5.39,me:5297.31,peur:285.53,ca:26486.79,cap:26772.32,s:"win",y:2021},
  {t:"BBBY",d:"2021-07-01",ex:"2021-08-02",ra:"DROPPED_FROM_TOP",pe:90.37,ps:67.68,pp:-25.11,me:5354.46,peur:-1070.89,ca:26772.32,cap:25701.43,s:"loss",y:2021},
  {t:"FCX",d:"2021-07-01",ex:"2021-08-02",ra:"DROPPED_FROM_TOP",pe:34.66,ps:34.23,pp:-1.26,me:5140.27,peur:-64.77,ca:25701.43,cap:25636.66,s:"loss",y:2021},
  {t:"FOSL",d:"2021-07-01",ex:"2021-08-02",ra:"DROPPED_FROM_TOP",pe:14.51,ps:12.57,pp:-13.41,me:5127.33,peur:-687.58,ca:25636.66,cap:24949.08,s:"loss",y:2021},
  {t:"GME",d:"2021-07-01",ex:"2021-08-02",ra:"REBALANCE_ADJUST",pe:51.14,ps:39.45,pp:-22.86,me:4989.83,peur:-997.97,ca:24949.08,cap:23951.12,s:"loss",y:2021},
  {t:"SIG",d:"2021-07-01",ex:"2021-08-02",ra:"REBALANCE_ADJUST",pe:75.36,ps:61.93,pp:-17.82,me:4790.21,peur:-853.61,ca:23951.12,cap:23097.5,s:"loss",y:2021},
  {t:"CPRI",d:"2021-08-02",ex:"2021-09-01",ra:"REBALANCE_ADJUST",pe:57.24,ps:57.21,pp:-0.05,me:2309.74,peur:-1.15,ca:23097.5,cap:23096.35,s:"loss",y:2021},
  {t:"GME",d:"2021-08-02",ex:"2021-09-01",ra:"REBALANCE_ADJUST",pe:39.45,ps:53.3,pp:35.09,me:2309.63,peur:810.45,ca:23096.35,cap:23906.8,s:"win",y:2021},
  {t:"PBI",d:"2021-08-02",ex:"2021-09-01",ra:"DROPPED_FROM_TOP",pe:6.59,ps:6.18,pp:-6.16,me:4781.35,peur:-294.53,ca:23906.8,cap:23612.27,s:"loss",y:2021},
  {t:"SIG",d:"2021-08-02",ex:"2021-09-01",ra:"REBALANCE_ADJUST",pe:61.93,ps:76.38,pp:23.33,me:4722.45,peur:1101.75,ca:23612.27,cap:24714.02,s:"win",y:2021},
  {t:"THC",d:"2021-08-02",ex:"2021-09-01",ra:"DROPPED_FROM_TOP",pe:71.28,ps:74.92,pp:5.1,me:4942.78,peur:252.08,ca:24714.02,cap:24966.1,s:"win",y:2021},
  {t:"TPR",d:"2021-09-01",ex:"2021-10-01",ra:"DROPPED_FROM_TOP",pe:35.65,ps:33.57,pp:-5.82,me:4993.22,peur:-290.61,ca:24966.1,cap:24675.49,s:"loss",y:2021},
  {t:"SIG",d:"2021-09-01",ex:"2021-10-01",ra:"REBALANCE_ADJUST",pe:76.38,ps:77.21,pp:1.09,me:4935.1,peur:53.79,ca:24675.49,cap:24729.28,s:"win",y:2021},
  {t:"GME",d:"2021-09-01",ex:"2021-10-01",ra:"REBALANCE_ADJUST",pe:53.3,ps:44.27,pp:-16.93,me:4945.84,peur:-837.33,ca:24729.28,cap:23891.95,s:"loss",y:2021},
  {t:"FOSL",d:"2021-09-01",ex:"2021-10-01",ra:"DROPPED_FROM_TOP",pe:13.92,ps:11.98,pp:-13.98,me:4778.41,peur:-668.02,ca:23891.95,cap:23223.93,s:"loss",y:2021},
  {t:"CPRI",d:"2021-09-01",ex:"2021-10-01",ra:"REBALANCE_ADJUST",pe:57.21,ps:49.88,pp:-12.81,me:4644.77,peur:-594.99,ca:23223.93,cap:22628.94,s:"loss",y:2021},
  {t:"BBT",d:"2021-10-01",ex:"2021-11-01",ra:"DROPPED_FROM_TOP",pe:23.6,ps:24.69,pp:4.63,me:4525.79,peur:209.54,ca:22628.94,cap:22838.48,s:"win",y:2021},
  {t:"CPRI",d:"2021-10-01",ex:"2021-11-01",ra:"DROPPED_FROM_TOP",pe:49.88,ps:55.5,pp:11.28,me:4567.71,peur:515.24,ca:22838.48,cap:23353.72,s:"win",y:2021},
  {t:"GME",d:"2021-10-01",ex:"2021-11-01",ra:"REBALANCE_ADJUST",pe:44.27,ps:50.07,pp:13.1,me:4670.74,peur:611.87,ca:23353.72,cap:23965.59,s:"win",y:2021},
  {t:"M",d:"2021-10-01",ex:"2021-11-01",ra:"REBALANCE_ADJUST",pe:19.18,ps:23.82,pp:24.16,me:4793.15,peur:1158.02,ca:23965.59,cap:25123.61,s:"win",y:2021},
  {t:"SIG",d:"2021-10-01",ex:"2021-11-01",ra:"REBALANCE_ADJUST",pe:77.21,ps:91.47,pp:18.46,me:5024.76,peur:927.57,ca:25123.61,cap:26051.18,s:"win",y:2021},
  {t:"DVN",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:33.63,ps:32.71,pp:-2.74,me:5210.23,peur:-142.76,ca:26051.18,cap:25908.42,s:"loss",y:2021},
  {t:"GME",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:50.07,ps:45,pp:-10.12,me:5181.66,peur:-524.38,ca:25908.42,cap:25384.04,s:"loss",y:2021},
  {t:"M",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:23.82,ps:22.78,pp:-4.36,me:5076.79,peur:-221.35,ca:25384.04,cap:25162.69,s:"loss",y:2021},
  {t:"RIG",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:3.76,ps:2.92,pp:-22.34,me:5032.5,peur:-1006.5,ca:25162.69,cap:24156.19,s:"loss",y:2021},
  {t:"SIG",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:91.47,ps:88.19,pp:-3.58,me:4831.28,peur:-172.96,ca:24156.19,cap:23983.23,s:"loss",y:2021},
  {t:"SIG",d:"2021-12-01",ex:"2022-01-03",ra:"REBALANCE_ADJUST",pe:88.19,ps:88.27,pp:0.09,me:2398.32,peur:2.16,ca:23983.23,cap:23985.39,s:"win",y:2021},
  {t:"RIG",d:"2021-12-01",ex:"2022-01-03",ra:"DROPPED_FROM_TOP",pe:2.92,ps:3.12,pp:6.64,me:4797.07,peur:318.53,ca:23985.39,cap:24303.91,s:"win",y:2021},
  {t:"DVN",d:"2021-12-01",ex:"2022-01-03",ra:"REBALANCE_ADJUST",pe:32.71,ps:37.19,pp:13.71,me:4860.79,peur:666.41,ca:24303.91,cap:24970.33,s:"win",y:2021},
  {t:"GME",d:"2021-12-01",ex:"2022-01-03",ra:"REBALANCE_ADJUST",pe:45,ps:38.25,pp:-15.01,me:4994.08,peur:-749.61,ca:24970.33,cap:24220.72,s:"loss",y:2021},
  {t:"M",d:"2021-12-01",ex:"2022-01-03",ra:"DROPPED_FROM_TOP",pe:22.78,ps:23.04,pp:1.14,me:4844.13,peur:55.22,ca:24220.72,cap:24275.94,s:"win",y:2021},
  {t:"DVN",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:37.19,ps:42.89,pp:15.34,me:4855.21,peur:744.79,ca:24275.94,cap:25020.73,s:"win",y:2022},
  {t:"GME",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:38.25,ps:28.18,pp:-26.33,me:5004.15,peur:-1000.83,ca:25020.73,cap:24019.9,s:"loss",y:2022},
  {t:"HAR",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:14214.2,ps:8208.2,pp:-42.25,me:4804.01,peur:-960.8,ca:24019.9,cap:23059.1,s:"loss",y:2022},
  {t:"SIG",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:88.27,ps:82.25,pp:-6.82,me:4611.79,peur:-314.52,ca:23059.1,cap:22744.57,s:"loss",y:2022},
  {t:"DVN",d:"2022-02-01",ex:"2022-03-01",ra:"REBALANCE_ADJUST",pe:42.89,ps:48.35,pp:12.73,me:4548.93,peur:579.08,ca:22744.57,cap:23323.65,s:"win",y:2022},
  {t:"GME",d:"2022-02-01",ex:"2022-03-01",ra:"DROPPED_FROM_TOP",pe:28.18,ps:29.73,pp:5.49,me:4664.74,peur:256.09,ca:23323.65,cap:23579.75,s:"win",y:2022},
  {t:"HAR",d:"2022-02-01",ex:"2022-03-01",ra:"DROPPED_FROM_TOP",pe:8208.2,ps:10389.6,pp:26.58,me:4715.93,peur:1253.49,ca:23579.75,cap:24833.24,s:"win",y:2022},
  {t:"SIG",d:"2022-02-01",ex:"2022-03-01",ra:"DROPPED_FROM_TOP",pe:82.25,ps:63.55,pp:-22.74,me:4966.62,peur:-993.32,ca:24833.24,cap:23839.92,s:"loss",y:2022},
  {t:"MUR",d:"2022-03-01",ex:"2022-04-01",ra:"DROPPED_FROM_TOP",pe:30.44,ps:35.7,pp:17.3,me:4767.99,peur:824.86,ca:23839.92,cap:24664.78,s:"win",y:2022},
  {t:"EOG",d:"2022-03-01",ex:"2022-04-01",ra:"DROPPED_FROM_TOP",pe:95.99,ps:99.88,pp:4.05,me:4932.93,peur:199.78,ca:24664.78,cap:24864.56,s:"win",y:2022},
  {t:"COP",d:"2022-03-01",ex:"2022-04-01",ra:"DROPPED_FROM_TOP",pe:82.96,ps:86.14,pp:3.84,me:4972.9,peur:190.96,ca:24864.56,cap:25055.52,s:"win",y:2022},
  {t:"DVN",d:"2022-03-01",ex:"2022-04-01",ra:"REBALANCE_ADJUST",pe:48.35,ps:50.08,pp:3.57,me:5011.12,peur:178.9,ca:25055.52,cap:25234.42,s:"win",y:2022},
  {t:"CF",d:"2022-04-01",ex:"2022-05-02",ra:"REBALANCE_ADJUST",pe:91.2,ps:88.13,pp:-3.36,me:5046.9,peur:-169.58,ca:25234.42,cap:25064.84,s:"loss",y:2022},
  {t:"DVN",d:"2022-04-01",ex:"2022-05-02",ra:"REBALANCE_ADJUST",pe:50.08,ps:48.42,pp:-3.31,me:5012.97,peur:-165.93,ca:25064.84,cap:24898.91,s:"loss",y:2022},
  {t:"HAR",d:"2022-04-01",ex:"2022-05-02",ra:"DROPPED_FROM_TOP",pe:10160.15,ps:10139.85,pp:-0.2,me:4979.79,peur:-9.96,ca:24898.91,cap:24888.95,s:"loss",y:2022},
  {t:"RRC",d:"2022-04-01",ex:"2022-05-02",ra:"REBALANCE_ADJUST",pe:30.31,ps:28.67,pp:-5.39,me:4977.76,peur:-268.3,ca:24888.95,cap:24620.65,s:"loss",y:2022},
  {t:"APA",d:"2022-05-02",ex:"2022-06-01",ra:"DROPPED_FROM_TOP",pe:35.5,ps:41.55,pp:17.03,me:4924.12,peur:838.58,ca:24620.65,cap:25459.23,s:"win",y:2022},
  {t:"CF",d:"2022-05-02",ex:"2022-06-01",ra:"DROPPED_FROM_TOP",pe:88.13,ps:87.46,pp:-0.76,me:5091.87,peur:-38.7,ca:25459.23,cap:25420.53,s:"loss",y:2022},
  {t:"DVN",d:"2022-05-02",ex:"2022-06-01",ra:"REBALANCE_ADJUST",pe:48.42,ps:63.46,pp:31.07,me:5084.13,peur:1579.64,ca:25420.53,cap:27000.17,s:"win",y:2022},
  {t:"MUR",d:"2022-05-02",ex:"2022-06-01",ra:"REBALANCE_ADJUST",pe:32.21,ps:37.34,pp:15.95,me:5400.02,peur:861.3,ca:27000.17,cap:27861.48,s:"win",y:2022},
  {t:"RRC",d:"2022-05-02",ex:"2022-06-01",ra:"REBALANCE_ADJUST",pe:28.67,ps:33.85,pp:18.06,me:5572.27,peur:1006.35,ca:27861.48,cap:28867.83,s:"win",y:2022},
  {t:"RRC",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:33.85,ps:24.33,pp:-28.12,me:5773.58,peur:-1154.72,ca:28867.83,cap:27713.11,s:"loss",y:2022},
  {t:"MUR",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:37.34,ps:26.33,pp:-29.5,me:5542.65,peur:-1108.53,ca:27713.11,cap:26604.58,s:"loss",y:2022},
  {t:"EQT",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:46.99,ps:32.27,pp:-31.32,me:5320.89,peur:-1064.18,ca:26604.58,cap:25540.4,s:"loss",y:2022},
  {t:"DVN",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:63.46,ps:46.4,pp:-26.89,me:5108.1,peur:-1021.62,ca:25540.4,cap:24518.78,s:"loss",y:2022},
  {t:"FSLR",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:208.95,ps:191.58,pp:-8.31,me:4903.77,peur:-407.5,ca:24518.78,cap:24111.28,s:"loss",y:2023},
  {t:"FTI",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:13.75,ps:16.46,pp:19.69,me:2411.13,peur:474.75,ca:24111.28,cap:24586.03,s:"win",y:2023},
  {t:"GE",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:82.31,ps:85.15,pp:3.45,me:4917.21,peur:169.64,ca:24586.03,cap:24755.68,s:"win",y:2023},
  {t:"NFLX",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:40.35,ps:44.19,pp:9.5,me:4951.14,peur:470.36,ca:24755.68,cap:25226.03,s:"win",y:2023},
  {t:"OI",d:"2023-06-01",ex:"2023-07-03",ra:"DROPPED_FROM_TOP",pe:20.86,ps:21.89,pp:4.92,me:5045.21,peur:248.22,ca:25226.03,cap:25474.26,s:"win",y:2023},
  {t:"FSLR",d:"2023-07-03",ex:"2023-08-01",ra:"REBALANCE_ADJUST",pe:191.58,ps:202.88,pp:5.9,me:5094.85,peur:300.6,ca:25474.26,cap:25774.85,s:"win",y:2023},
  {t:"FTI",d:"2023-07-03",ex:"2023-08-01",ra:"REBALANCE_ADJUST",pe:16.46,ps:17.56,pp:6.67,me:5154.95,peur:343.84,ca:25774.85,cap:26118.69,s:"win",y:2023},
  {t:"GE",d:"2023-07-03",ex:"2023-08-01",ra:"DROPPED_FROM_TOP",pe:85.15,ps:88.92,pp:4.43,me:5223.69,peur:231.41,ca:26118.69,cap:26350.1,s:"win",y:2023},
  {t:"NFLX",d:"2023-07-03",ex:"2023-08-01",ra:"REBALANCE_ADJUST",pe:44.19,ps:43.91,pp:-0.64,me:5269.99,peur:-33.73,ca:26350.1,cap:26316.37,s:"loss",y:2023},
  {t:"NVDA",d:"2023-08-01",ex:"2023-09-01",ra:"REBALANCE_ADJUST",pe:46.46,ps:48.46,pp:4.3,me:5263.26,peur:226.32,ca:26316.37,cap:26542.69,s:"win",y:2023},
  {t:"NFLX",d:"2023-08-01",ex:"2023-09-01",ra:"DROPPED_FROM_TOP",pe:43.91,ps:43.94,pp:0.09,me:5308.54,peur:4.78,ca:26542.69,cap:26547.47,s:"win",y:2023},
  {t:"FSLR",d:"2023-08-01",ex:"2023-09-01",ra:"DROPPED_FROM_TOP",pe:202.88,ps:186.18,pp:-8.23,me:5309.5,peur:-436.97,ca:26547.47,cap:26110.5,s:"loss",y:2023},
  {t:"FTI",d:"2023-08-01",ex:"2023-09-01",ra:"REBALANCE_ADJUST",pe:17.56,ps:19.23,pp:9.52,me:5222.1,peur:497.14,ca:26110.5,cap:26607.64,s:"win",y:2023},
  {t:"FTI",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:19.23,ps:19.67,pp:2.3,me:5321.54,peur:122.4,ca:26607.64,cap:26730.04,s:"win",y:2023},
  {t:"NVDA",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:48.46,ps:44.74,pp:-7.68,me:5346.01,peur:-410.57,ca:26730.04,cap:26319.46,s:"loss",y:2023},
  {t:"PHM",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:81,ps:71.92,pp:-11.21,me:5263.91,peur:-590.08,ca:26319.46,cap:25729.38,s:"loss",y:2023},
  {t:"RCL",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:95.11,ps:89.27,pp:-6.14,me:5145.88,peur:-315.96,ca:25729.38,cap:25413.42,s:"loss",y:2023},
  {t:"RIG",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:8.47,ps:7.89,pp:-6.86,me:5082.71,peur:-348.67,ca:25413.42,cap:25064.75,s:"loss",y:2023},
  {t:"FTI",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:19.67,ps:21.52,pp:9.4,me:5012.95,peur:471.22,ca:25064.75,cap:25535.97,s:"win",y:2023},
  {t:"NVDA",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:44.74,ps:42.29,pp:-5.49,me:5107.17,peur:-280.38,ca:25535.97,cap:25255.58,s:"loss",y:2023},
  {t:"PHM",d:"2023-10-02",ex:"2023-11-01",ra:"DROPPED_FROM_TOP",pe:71.92,ps:75.71,pp:5.27,me:5051.09,peur:266.19,ca:25255.58,cap:25521.77,s:"win",y:2023},
  {t:"RCL",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:89.27,ps:83.01,pp:-7.01,me:5104.38,peur:-357.82,ca:25521.77,cap:25163.96,s:"loss",y:2023},
  {t:"RIG",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:7.89,ps:6.66,pp:-15.61,me:5032.77,peur:-785.62,ca:25163.96,cap:24378.34,s:"loss",y:2023},
  {t:"RIG",d:"2023-11-01",ex:"2023-12-01",ra:"REBALANCE_ADJUST",pe:6.66,ps:6.57,pp:-1.35,me:4875.68,peur:-65.82,ca:24378.34,cap:24312.52,s:"loss",y:2023},
  {t:"RCL",d:"2023-11-01",ex:"2023-12-01",ra:"DROPPED_FROM_TOP",pe:83.01,ps:107.58,pp:29.6,me:4862.51,peur:1439.3,ca:24312.52,cap:25751.82,s:"win",y:2023},
  {t:"NVDA",d:"2023-11-01",ex:"2023-12-01",ra:"REBALANCE_ADJUST",pe:42.29,ps:46.72,pp:10.49,me:5150.34,peur:540.27,ca:25751.82,cap:26292.09,s:"win",y:2023},
  {t:"GE",d:"2023-11-01",ex:"2023-12-01",ra:"DROPPED_FROM_TOP",pe:84.46,ps:96.28,pp:13.99,me:5258.45,peur:735.66,ca:26292.09,cap:27027.75,s:"win",y:2023},
  {t:"FTI",d:"2023-11-01",ex:"2023-12-01",ra:"REBALANCE_ADJUST",pe:21.52,ps:20.39,pp:-5.25,me:5405.53,peur:-283.79,ca:27027.75,cap:26743.96,s:"loss",y:2023},
  {t:"AVGO",d:"2023-12-01",ex:"2024-01-02",ra:"REBALANCE_ADJUST",pe:90.43,ps:106.02,pp:17.24,me:5348.79,peur:922.13,ca:26743.96,cap:27666.09,s:"win",y:2023},
  {t:"FTI",d:"2023-12-01",ex:"2024-01-02",ra:"DROPPED_FROM_TOP",pe:20.39,ps:19.73,pp:-3.24,me:5533.22,peur:-179.28,ca:27666.09,cap:27486.82,s:"loss",y:2023},
  {t:"NVDA",d:"2023-12-01",ex:"2024-01-02",ra:"REBALANCE_ADJUST",pe:46.72,ps:48.13,pp:3.01,me:5497.36,peur:165.47,ca:27486.82,cap:27652.29,s:"win",y:2023},
  {t:"PHM",d:"2023-12-01",ex:"2024-01-02",ra:"REBALANCE_ADJUST",pe:89.41,ps:99.95,pp:11.79,me:5530.49,peur:652.04,ca:27652.29,cap:28304.33,s:"win",y:2023},
  {t:"RIG",d:"2023-12-01",ex:"2024-01-02",ra:"DROPPED_FROM_TOP",pe:6.57,ps:6.24,pp:-4.92,me:5660.91,peur:-278.52,ca:28304.33,cap:28025.82,s:"loss",y:2023},
  {t:"ADBE",d:"2024-01-02",ex:"2024-02-01",ra:"DROPPED_FROM_TOP",pe:580.65,ps:627.28,pp:8.03,me:5605.16,peur:450.09,ca:28025.82,cap:28475.91,s:"win",y:2024},
  {t:"AVGO",d:"2024-01-02",ex:"2024-02-01",ra:"REBALANCE_ADJUST",pe:106.02,ps:117.22,pp:10.56,me:5695.19,peur:601.41,ca:28475.91,cap:29077.32,s:"win",y:2024},
  {t:"GE",d:"2024-01-02",ex:"2024-02-01",ra:"DROPPED_FROM_TOP",pe:99.25,ps:106.49,pp:7.3,me:5815.45,peur:424.53,ca:29077.32,cap:29501.85,s:"win",y:2024},
  {t:"NVDA",d:"2024-01-02",ex:"2024-02-01",ra:"REBALANCE_ADJUST",pe:48.13,ps:62.98,pp:30.85,me:5900.35,peur:1820.26,ca:29501.85,cap:31322.11,s:"win",y:2024},
  {t:"PHM",d:"2024-01-02",ex:"2024-02-01",ra:"REBALANCE_ADJUST",pe:99.95,ps:105.05,pp:5.1,me:6264.42,peur:319.49,ca:31322.11,cap:31641.59,s:"win",y:2024},
  {t:"RCL",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:123.59,ps:120.96,pp:-2.13,me:6328.3,peur:-134.79,ca:31641.59,cap:31506.8,s:"loss",y:2024},
  {t:"PHM",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:105.05,ps:109.46,pp:4.2,me:6301.38,peur:264.66,ca:31506.8,cap:31771.46,s:"win",y:2024},
  {t:"CCL",d:"2024-02-01",ex:"2024-03-01",ra:"DROPPED_FROM_TOP",pe:16.64,ps:15.81,pp:-4.95,me:6354.32,peur:-314.54,ca:31771.46,cap:31456.92,s:"loss",y:2024},
  {t:"AVGO",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:117.22,ps:136.67,pp:16.6,me:6291.38,peur:1044.37,ca:31456.92,cap:32501.29,s:"win",y:2024},
  {t:"NVDA",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:62.98,ps:82.22,pp:30.55,me:6500.21,peur:1985.81,ca:32501.29,cap:34487.11,s:"win",y:2024},
  {t:"AVGO",d:"2024-03-01",ex:"2024-04-01",ra:"REBALANCE_ADJUST",pe:136.67,ps:132.46,pp:-3.08,me:6897.4,peur:-212.44,ca:34487.11,cap:34274.67,s:"loss",y:2024},
  {t:"NVDA",d:"2024-03-01",ex:"2024-04-01",ra:"REBALANCE_ADJUST",pe:82.22,ps:90.3,pp:9.83,me:6854.91,peur:673.84,ca:34274.67,cap:34948.5,s:"win",y:2024},
  {t:"PHM",d:"2024-03-01",ex:"2024-04-01",ra:"REBALANCE_ADJUST",pe:109.46,ps:116.77,pp:6.68,me:6989.73,peur:466.91,ca:34948.5,cap:35415.42,s:"win",y:2024},
  {t:"RCL",d:"2024-03-01",ex:"2024-04-01",ra:"DROPPED_FROM_TOP",pe:120.96,ps:136.56,pp:12.89,me:7083.1,peur:913.01,ca:35415.42,cap:36328.43,s:"win",y:2024},
  {t:"AVGO",d:"2024-04-01",ex:"2024-05-01",ra:"REBALANCE_ADJUST",pe:132.46,ps:121.92,pp:-7.95,me:7265.71,peur:-577.62,ca:36328.43,cap:35750.81,s:"loss",y:2024},
  {t:"LLY",d:"2024-04-01",ex:"2024-05-01",ra:"REBALANCE_ADJUST",pe:749.55,ps:765.51,pp:2.13,me:7150.16,peur:152.3,ca:35750.81,cap:35903.1,s:"win",y:2024},
  {t:"NVDA",d:"2024-04-01",ex:"2024-05-01",ra:"REBALANCE_ADJUST",pe:90.3,ps:82.98,pp:-8.1,me:7180.62,peur:-581.63,ca:35903.1,cap:35321.47,s:"loss",y:2024},
  {t:"PHM",d:"2024-04-01",ex:"2024-05-01",ra:"DROPPED_FROM_TOP",pe:116.77,ps:110.03,pp:-5.77,me:7064.33,peur:-407.61,ca:35321.47,cap:34913.86,s:"loss",y:2024},
  {t:"SLG",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:45.08,ps:48.37,pp:7.28,me:6982.75,peur:508.34,ca:34913.86,cap:35422.21,s:"win",y:2024},
  {t:"NVDA",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:82.98,ps:114.92,pp:38.49,me:7084.47,peur:2726.81,ca:35422.21,cap:38149.02,s:"win",y:2024},
  {t:"NRG",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:71.58,ps:76.13,pp:6.35,me:7629.8,peur:484.49,ca:38149.02,cap:38633.51,s:"win",y:2024},
  {t:"LLY",d:"2024-05-01",ex:"2024-06-03",ra:"DROPPED_FROM_TOP",pe:765.51,ps:818.99,pp:6.99,me:7726.68,peur:540.1,ca:38633.51,cap:39173.6,s:"win",y:2024},
  {t:"AVGO",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:121.92,ps:129.67,pp:6.36,me:7834.69,peur:498.29,ca:39173.6,cap:39671.89,s:"win",y:2024},
  {t:"AVGO",d:"2024-06-03",ex:"2024-07-01",ra:"DROPPED_FROM_TOP",pe:129.67,ps:161.14,pp:24.27,me:7934.37,peur:1925.67,ca:39671.89,cap:41597.56,s:"win",y:2024},
  {t:"NRG",d:"2024-06-03",ex:"2024-07-01",ra:"REBALANCE_ADJUST",pe:76.13,ps:75.65,pp:-0.63,me:8319.53,peur:-52.41,ca:41597.56,cap:41545.15,s:"loss",y:2024},
  {t:"NVDA",d:"2024-06-03",ex:"2024-07-01",ra:"REBALANCE_ADJUST",pe:114.92,ps:124.22,pp:8.1,me:8309.01,peur:673.03,ca:41545.15,cap:42218.18,s:"win",y:2024},
  {t:"SLG",d:"2024-06-03",ex:"2024-07-01",ra:"REBALANCE_ADJUST",pe:48.37,ps:50.38,pp:4.16,me:8443.61,peur:351.25,ca:42218.18,cap:42569.43,s:"win",y:2024},
  {t:"WDC",d:"2024-06-03",ex:"2024-07-01",ra:"DROPPED_FROM_TOP",pe:56.47,ps:57.41,pp:1.66,me:8513.92,peur:141.33,ca:42569.43,cap:42710.76,s:"win",y:2024},
  {t:"GE",d:"2024-07-01",ex:"2024-08-01",ra:"DROPPED_FROM_TOP",pe:157.24,ps:167.85,pp:6.75,me:8542.14,peur:576.59,ca:42710.76,cap:43287.36,s:"win",y:2024},
  {t:"NRG",d:"2024-07-01",ex:"2024-08-01",ra:"REBALANCE_ADJUST",pe:75.65,ps:71.81,pp:-5.07,me:8657.44,peur:-438.93,ca:43287.36,cap:42848.43,s:"loss",y:2024},
  {t:"NVDA",d:"2024-07-01",ex:"2024-08-01",ra:"REBALANCE_ADJUST",pe:124.22,ps:109.14,pp:-12.14,me:8569.69,peur:-1040.36,ca:42848.43,cap:41808.07,s:"loss",y:2024},
  {t:"SLG",d:"2024-07-01",ex:"2024-08-01",ra:"REBALANCE_ADJUST",pe:50.38,ps:61.05,pp:21.18,me:8361.57,peur:1770.98,ca:41808.07,cap:43579.05,s:"win",y:2024},
  {t:"URI",d:"2024-07-01",ex:"2024-08-01",ra:"DROPPED_FROM_TOP",pe:630.4,ps:703.41,pp:11.58,me:8715.81,peur:1009.29,ca:43579.05,cap:44588.34,s:"win",y:2024},
  {t:"SLG",d:"2024-08-01",ex:"2024-09-03",ra:"REBALANCE_ADJUST",pe:61.05,ps:59.41,pp:-2.69,me:8917.69,peur:-239.89,ca:44588.34,cap:44348.45,s:"loss",y:2024},
  {t:"NVDA",d:"2024-08-01",ex:"2024-09-03",ra:"REBALANCE_ADJUST",pe:109.14,ps:107.93,pp:-1.11,me:8869.72,peur:-98.45,ca:44348.45,cap:44250,s:"loss",y:2024},
  {t:"NRG",d:"2024-08-01",ex:"2024-09-03",ra:"REBALANCE_ADJUST",pe:71.81,ps:77.92,pp:8.5,me:8849.96,peur:752.25,ca:44250,cap:45002.24,s:"win",y:2024},
  {t:"MU",d:"2024-08-01",ex:"2024-09-03",ra:"DROPPED_FROM_TOP",pe:100.99,ps:87.95,pp:-12.91,me:9000.5,peur:-1161.96,ca:45002.24,cap:43840.28,s:"loss",y:2024},
  {t:"GE",d:"2024-09-03",ex:"2024-10-01",ra:"DROPPED_FROM_TOP",pe:162.7,ps:184.49,pp:13.39,me:8768.04,peur:1174.04,ca:43840.28,cap:45014.32,s:"win",y:2024},
  {t:"NRG",d:"2024-09-03",ex:"2024-10-01",ra:"REBALANCE_ADJUST",pe:77.92,ps:90.52,pp:16.18,me:9002.84,peur:1456.66,ca:45014.32,cap:46470.98,s:"win",y:2024},
  {t:"NVDA",d:"2024-09-03",ex:"2024-10-01",ra:"REBALANCE_ADJUST",pe:107.93,ps:116.93,pp:8.34,me:9294.16,peur:775.13,ca:46470.98,cap:47246.11,s:"win",y:2024},
  {t:"SLG",d:"2024-09-03",ex:"2024-10-01",ra:"DROPPED_FROM_TOP",pe:59.41,ps:64.31,pp:8.25,me:9449.27,peur:779.56,ca:47246.11,cap:48025.68,s:"win",y:2024},
  {t:"THC",d:"2024-09-03",ex:"2024-10-01",ra:"REBALANCE_ADJUST",pe:161.81,ps:163.03,pp:0.75,me:9605.16,peur:72.04,ca:48025.68,cap:48097.72,s:"win",y:2024},
  {t:"NRG",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:90.52,ps:85.11,pp:-5.98,me:9619.52,peur:-575.25,ca:48097.72,cap:47522.47,s:"loss",y:2024},
  {t:"NVDA",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:116.93,ps:135.32,pp:15.73,me:9504.48,peur:1495.05,ca:47522.47,cap:49017.52,s:"win",y:2024},
  {t:"PBI",d:"2024-10-01",ex:"2024-11-01",ra:"DROPPED_FROM_TOP",pe:6.52,ps:6.83,pp:4.75,me:9803.53,peur:465.67,ca:49017.52,cap:49483.19,s:"win",y:2024},
  {t:"SE",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:97.59,ps:95.48,pp:-2.16,me:9896.67,peur:-213.77,ca:49483.19,cap:49269.42,s:"loss",y:2024},
  {t:"THC",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:163.03,ps:156.29,pp:-4.14,me:9853.85,peur:-407.95,ca:49269.42,cap:48861.47,s:"loss",y:2024},
  {t:"THC",d:"2024-11-01",ex:"2024-12-02",ra:"REBALANCE_ADJUST",pe:156.29,ps:142.17,pp:-9.03,me:9772.28,peur:-882.44,ca:48861.47,cap:47979.04,s:"loss",y:2024},
  {t:"SE",d:"2024-11-01",ex:"2024-12-02",ra:"DROPPED_FROM_TOP",pe:95.48,ps:113.13,pp:18.49,me:9595.78,peur:1774.26,ca:47979.04,cap:49753.3,s:"win",y:2024},
  {t:"NRG",d:"2024-11-01",ex:"2024-12-02",ra:"DROPPED_FROM_TOP",pe:85.11,ps:97.36,pp:14.39,me:9950.62,peur:1431.89,ca:49753.3,cap:51185.19,s:"win",y:2024},
  {t:"GE",d:"2024-11-01",ex:"2024-12-02",ra:"DROPPED_FROM_TOP",pe:170.37,ps:178.69,pp:4.88,me:10236.99,peur:499.57,ca:51185.19,cap:51684.76,s:"win",y:2024},
  {t:"NVDA",d:"2024-11-01",ex:"2024-12-02",ra:"REBALANCE_ADJUST",pe:135.32,ps:138.55,pp:2.39,me:10337.01,peur:247.05,ca:51684.76,cap:51931.81,s:"win",y:2024},
  {t:"NVDA",d:"2024-12-02",ex:"2025-01-02",ra:"REBALANCE_ADJUST",pe:138.55,ps:138.24,pp:-0.22,me:10386.34,peur:-22.85,ca:51931.81,cap:51908.96,s:"loss",y:2024},
  {t:"PBI",d:"2024-12-02",ex:"2025-01-02",ra:"DROPPED_FROM_TOP",pe:7.71,ps:6.9,pp:-10.49,me:10381.83,peur:-1089.05,ca:51908.96,cap:50819.91,s:"loss",y:2024},
  {t:"RCL",d:"2024-12-02",ex:"2025-01-02",ra:"REBALANCE_ADJUST",pe:240.43,ps:223.98,pp:-6.84,me:10163.94,peur:-695.21,ca:50819.91,cap:50124.69,s:"loss",y:2024},
  {t:"THC",d:"2024-12-02",ex:"2025-01-02",ra:"DROPPED_FROM_TOP",pe:142.17,ps:125.09,pp:-12.01,me:10024.96,peur:-1204,ca:50124.69,cap:48920.7,s:"loss",y:2024},
  {t:"JEF",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:75.82,ps:71.55,pp:-5.63,me:9784.16,peur:-550.85,ca:48920.7,cap:48369.85,s:"loss",y:2025},
  {t:"NVDA",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:138.24,ps:116.6,pp:-15.65,me:4836.99,peur:-756.99,ca:48369.85,cap:47612.86,s:"loss",y:2025},
  {t:"RCL",d:"2025-01-02",ex:"2025-02-03",ra:"DROPPED_FROM_TOP",pe:223.98,ps:254.61,pp:13.68,me:4761.3,peur:651.35,ca:47612.86,cap:48264.2,s:"win",y:2025},
  {t:"SE",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:104.97,ps:122.02,pp:16.24,me:9652.88,peur:1567.63,ca:48264.2,cap:49831.83,s:"win",y:2025},
  {t:"UAL",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:95.53,ps:104.93,pp:9.85,me:9966.31,peur:981.68,ca:49831.83,cap:50813.51,s:"win",y:2025},
  {t:"NVDA",d:"2025-02-03",ex:"2025-03-03",ra:"REBALANCE_ADJUST",pe:116.6,ps:114,pp:-2.23,me:10162.72,peur:-226.63,ca:50813.51,cap:50586.89,s:"loss",y:2025},
  {t:"UAL",d:"2025-02-03",ex:"2025-03-03",ra:"REBALANCE_ADJUST",pe:104.93,ps:91.76,pp:-12.55,me:10117.36,peur:-1269.73,ca:50586.89,cap:49317.16,s:"loss",y:2025},
  {t:"JEF",d:"2025-02-03",ex:"2025-03-03",ra:"DROPPED_FROM_TOP",pe:71.55,ps:61.41,pp:-14.17,me:9863.39,peur:-1397.64,ca:49317.16,cap:47919.51,s:"loss",y:2025},
  {t:"SE",d:"2025-02-03",ex:"2025-03-03",ra:"REBALANCE_ADJUST",pe:122.02,ps:123.61,pp:1.3,me:9583.85,peur:124.59,ca:47919.51,cap:48044.1,s:"win",y:2025},
  {t:"NVDA",d:"2025-03-03",ex:"2025-04-01",ra:"DROPPED_FROM_TOP",pe:114,ps:109.89,pp:-3.61,me:9608.83,peur:-346.88,ca:48044.1,cap:47697.23,s:"loss",y:2025},
  {t:"PBI",d:"2025-03-03",ex:"2025-04-01",ra:"REBALANCE_ADJUST",pe:10.22,ps:8.7,pp:-14.88,me:9539.45,peur:-1419.47,ca:47697.23,cap:46277.76,s:"loss",y:2025},
  {t:"RCL",d:"2025-03-03",ex:"2025-04-01",ra:"DROPPED_FROM_TOP",pe:235.81,ps:203.84,pp:-13.56,me:9255.58,peur:-1255.06,ca:46277.76,cap:45022.7,s:"loss",y:2025},
  {t:"SE",d:"2025-03-03",ex:"2025-04-01",ra:"REBALANCE_ADJUST",pe:123.61,ps:132.59,pp:7.26,me:9004.56,peur:653.73,ca:45022.7,cap:45676.43,s:"win",y:2025},
  {t:"UAL",d:"2025-03-03",ex:"2025-04-01",ra:"REBALANCE_ADJUST",pe:91.76,ps:68.27,pp:-25.6,me:9135.31,peur:-1827.06,ca:45676.43,cap:43849.37,s:"loss",y:2025},
  {t:"SE",d:"2025-04-01",ex:"2025-05-01",ra:"REBALANCE_ADJUST",pe:132.59,ps:137.45,pp:3.66,me:8769.85,peur:320.98,ca:43849.37,cap:44170.34,s:"win",y:2025},
  {t:"MMM",d:"2025-04-01",ex:"2025-05-01",ra:"DROPPED_FROM_TOP",pe:144.4,ps:134.57,pp:-6.8,me:8834.05,peur:-600.72,ca:44170.34,cap:43569.63,s:"loss",y:2025},
  {t:"PBI",d:"2025-04-01",ex:"2025-05-01",ra:"REBALANCE_ADJUST",pe:8.7,ps:8.42,pp:-3.21,me:8713.89,peur:-279.72,ca:43569.63,cap:43289.91,s:"loss",y:2025},
  {t:"UAL",d:"2025-04-01",ex:"2025-05-01",ra:"DROPPED_FROM_TOP",pe:68.27,ps:69.09,pp:1.21,me:8658.03,peur:104.76,ca:43289.91,cap:43394.68,s:"win",y:2025},
  {t:"SE",d:"2025-05-01",ex:"2025-06-02",ra:"REBALANCE_ADJUST",pe:137.45,ps:165.27,pp:20.24,me:8678.96,peur:1756.62,ca:43394.68,cap:45151.3,s:"win",y:2025},
  {t:"PBI",d:"2025-05-01",ex:"2025-06-02",ra:"REBALANCE_ADJUST",pe:8.42,ps:9.96,pp:18.25,me:9030.27,peur:1648.02,ca:45151.3,cap:46799.32,s:"win",y:2025},
  {t:"GME",d:"2025-05-01",ex:"2025-06-02",ra:"REBALANCE_ADJUST",pe:27.46,ps:30.67,pp:11.7,me:9359.83,peur:1095.1,ca:46799.32,cap:47894.42,s:"win",y:2025},
  {t:"FOX",d:"2025-05-01",ex:"2025-06-02",ra:"DROPPED_FROM_TOP",pe:45.44,ps:50.01,pp:10.05,me:9578.86,peur:962.68,ca:47894.42,cap:48857.1,s:"win",y:2025},
  {t:"GME",d:"2025-06-02",ex:"2025-07-01",ra:"DROPPED_FROM_TOP",pe:30.67,ps:23.66,pp:-22.87,me:9771.41,peur:-1954.28,ca:48857.1,cap:46902.82,s:"loss",y:2025},
  {t:"NFLX",d:"2025-06-02",ex:"2025-07-01",ra:"DROPPED_FROM_TOP",pe:122.02,ps:129.23,pp:5.91,me:9380.55,peur:554.39,ca:46902.82,cap:47457.21,s:"win",y:2025},
  {t:"PBI",d:"2025-06-02",ex:"2025-07-01",ra:"REBALANCE_ADJUST",pe:9.96,ps:10.88,pp:9.25,me:9491.48,peur:877.96,ca:47457.21,cap:48335.17,s:"win",y:2025},
  {t:"SE",d:"2025-06-02",ex:"2025-07-01",ra:"REBALANCE_ADJUST",pe:165.27,ps:150.65,pp:-8.84,me:9666.98,peur:-854.56,ca:48335.17,cap:47480.61,s:"loss",y:2025},
  {t:"NRG",d:"2025-07-01",ex:"2025-08-01",ra:"DROPPED_FROM_TOP",pe:154.35,ps:166.01,pp:7.55,me:9496.13,peur:716.96,ca:47480.61,cap:48197.56,s:"win",y:2025},
  {t:"PBI",d:"2025-07-01",ex:"2025-08-01",ra:"REBALANCE_ADJUST",pe:10.88,ps:10.91,pp:0.27,me:9639.51,peur:26.03,ca:48197.56,cap:48223.59,s:"win",y:2025},
  {t:"PM",d:"2025-07-01",ex:"2025-08-01",ra:"DROPPED_FROM_TOP",pe:172.92,ps:158.41,pp:-8.39,me:9644.68,peur:-809.19,ca:48223.59,cap:47414.4,s:"loss",y:2025},
  {t:"SE",d:"2025-07-01",ex:"2025-08-01",ra:"REBALANCE_ADJUST",pe:150.65,ps:154.36,pp:2.47,me:9482.92,peur:234.23,ca:47414.4,cap:47648.63,s:"win",y:2025},
  {t:"TPR",d:"2025-07-01",ex:"2025-08-01",ra:"REBALANCE_ADJUST",pe:85.92,ps:105.06,pp:22.28,me:9529.75,peur:2123.23,ca:47648.63,cap:49771.86,s:"win",y:2025},
  {t:"TPR",d:"2025-08-01",ex:"2025-09-02",ra:"REBALANCE_ADJUST",pe:105.06,ps:101.58,pp:-3.31,me:9954.34,peur:-329.49,ca:49771.86,cap:49442.37,s:"loss",y:2025},
  {t:"RCL",d:"2025-08-01",ex:"2025-09-02",ra:"REBALANCE_ADJUST",pe:309.28,ps:348.48,pp:12.67,me:9888.51,peur:1252.87,ca:49442.37,cap:50695.24,s:"win",y:2025},
  {t:"SE",d:"2025-08-01",ex:"2025-09-02",ra:"REBALANCE_ADJUST",pe:154.36,ps:178.96,pp:15.93,me:10139.05,peur:1615.15,ca:50695.24,cap:52310.39,s:"win",y:2025},
  {t:"LB",d:"2025-08-01",ex:"2025-09-02",ra:"DROPPED_FROM_TOP",pe:55.07,ps:54.66,pp:-0.76,me:10462.14,peur:-79.51,ca:52310.39,cap:52230.88,s:"loss",y:2025},
  {t:"PBI",d:"2025-08-01",ex:"2025-09-02",ra:"DROPPED_FROM_TOP",pe:10.91,ps:11.71,pp:7.31,me:10446.14,peur:763.61,ca:52230.88,cap:52994.49,s:"win",y:2025},
  {t:"AVGO",d:"2025-09-02",ex:"2025-10-01",ra:"DROPPED_FROM_TOP",pe:296.84,ps:331.72,pp:11.75,me:10598.89,peur:1245.37,ca:52994.49,cap:54239.86,s:"win",y:2025},
  {t:"NRG",d:"2025-09-02",ex:"2025-10-01",ra:"DROPPED_FROM_TOP",pe:143.99,ps:160.34,pp:11.35,me:10847.96,peur:1231.24,ca:54239.86,cap:55471.11,s:"win",y:2025},
  {t:"RCL",d:"2025-09-02",ex:"2025-10-01",ra:"REBALANCE_ADJUST",pe:348.48,ps:311.97,pp:-10.48,me:11094.26,peur:-1162.68,ca:55471.11,cap:54308.43,s:"loss",y:2025},
  {t:"SE",d:"2025-09-02",ex:"2025-10-01",ra:"REBALANCE_ADJUST",pe:178.96,ps:182.19,pp:1.81,me:10861.69,peur:196.6,ca:54308.43,cap:54505.02,s:"win",y:2025},
  {t:"TPR",d:"2025-09-02",ex:"2025-10-01",ra:"REBALANCE_ADJUST",pe:101.58,ps:112.92,pp:11.16,me:10900.94,peur:1216.55,ca:54505.02,cap:55721.57,s:"win",y:2025},
  {t:"FOSL",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:2.57,ps:2.06,pp:-20,me:11144.3,peur:-2228.86,ca:55721.57,cap:53492.71,s:"loss",y:2025},
  {t:"RCL",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:311.97,ps:273.69,pp:-12.27,me:10698.58,peur:-1312.72,ca:53492.71,cap:52179.99,s:"loss",y:2025},
  {t:"SE",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:182.19,ps:157.25,pp:-13.69,me:10435.98,peur:-1428.69,ca:52179.99,cap:50751.31,s:"loss",y:2025},
  {t:"TPR",d:"2025-10-01",ex:"2025-11-03",ra:"REBALANCE_ADJUST",pe:112.92,ps:105.48,pp:-6.59,me:10150.26,peur:-668.9,ca:50751.31,cap:50082.41,s:"loss",y:2025},
  {t:"UAL",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:93.24,ps:96.01,pp:2.97,me:10016.48,peur:297.49,ca:50082.41,cap:50379.9,s:"win",y:2025},
  {t:"WDC",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:157.93,ps:163.45,pp:3.49,me:10075.97,peur:351.65,ca:50379.9,cap:50731.55,s:"win",y:2025},
  {t:"TPR",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:105.48,ps:111.21,pp:5.43,me:10146.32,peur:550.95,ca:50731.55,cap:51282.49,s:"win",y:2025},
  {t:"STX",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:264.66,ps:269.19,pp:1.71,me:10256.46,peur:175.39,ca:51282.49,cap:51457.88,s:"win",y:2025},
  {t:"AVGO",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:361.46,ps:384.92,pp:6.49,me:10291.58,peur:667.92,ca:51457.88,cap:52125.8,s:"win",y:2025},
  {t:"AVGO",d:"2025-12-01",ex:"2026-01-02",ra:"REBALANCE_ADJUST",pe:384.92,ps:347.24,pp:-9.79,me:10425.17,peur:-1020.62,ca:52125.8,cap:51105.18,s:"loss",y:2025},
  {t:"STX",d:"2025-12-01",ex:"2026-01-02",ra:"REBALANCE_ADJUST",pe:269.19,ps:287.33,pp:6.74,me:10221.07,peur:688.9,ca:51105.18,cap:51794.08,s:"win",y:2025},
  {t:"TE",d:"2025-12-01",ex:"2026-01-02",ra:"DROPPED_FROM_TOP",pe:4.47,ps:7.83,pp:75.04,me:10358.84,peur:7773.27,ca:51794.08,cap:59567.35,s:"win",y:2025},
  {t:"TPR",d:"2025-12-01",ex:"2026-01-02",ra:"DROPPED_FROM_TOP",pe:111.21,ps:128.23,pp:15.31,me:11913.5,peur:1823.96,ca:59567.35,cap:61391.3,s:"win",y:2025},
  {t:"WDC",d:"2025-12-01",ex:"2026-01-02",ra:"REBALANCE_ADJUST",pe:163.45,ps:187.75,pp:14.87,me:12278.33,peur:1825.79,ca:61391.3,cap:63217.09,s:"win",y:2025},
  {t:"AVGO",d:"2026-01-02",ex:"2026-02-02",ra:"DROPPED_FROM_TOP",pe:347.24,ps:330.09,pp:-4.94,me:12643.43,peur:-624.59,ca:63217.09,cap:62592.51,s:"loss",y:2026},
  {t:"FOSL",d:"2026-01-02",ex:"2026-02-02",ra:"DROPPED_FROM_TOP",pe:3.82,ps:3.55,pp:-7.25,me:12518.46,peur:-907.59,ca:62592.51,cap:61684.92,s:"loss",y:2026},
  {t:"MU",d:"2026-01-02",ex:"2026-02-02",ra:"REBALANCE_ADJUST",pe:315.6,ps:438.05,pp:38.8,me:12336.94,peur:4786.73,ca:61684.92,cap:66471.65,s:"win",y:2026},
  {t:"STX",d:"2026-01-02",ex:"2026-02-02",ra:"REBALANCE_ADJUST",pe:287.33,ps:432.63,pp:50.57,me:13294.3,peur:6722.93,ca:66471.65,cap:73194.58,s:"win",y:2026},
  {t:"WDC",d:"2026-01-02",ex:"2026-02-02",ra:"REBALANCE_ADJUST",pe:187.75,ps:270.3,pp:43.97,me:14638.92,peur:6436.73,ca:73194.58,cap:79631.31,s:"win",y:2026},
  {t:"WDC",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:270.3,ps:270.15,pp:-0.06,me:15926.3,peur:-9.56,ca:79631.31,cap:79621.75,s:"loss",y:2026},
  {t:"STX",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:432.63,ps:379.24,pp:-12.34,me:15924.31,peur:-1965.06,ca:79621.75,cap:77656.69,s:"loss",y:2026},
  {t:"MU",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:438.05,ps:412.91,pp:-5.74,me:15531.36,peur:-891.5,ca:77656.69,cap:76765.19,s:"loss",y:2026},
  {t:"LRCX",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:237.45,ps:230.95,pp:-2.74,me:15353.01,peur:-420.67,ca:76765.19,cap:76344.52,s:"loss",y:2026},
  {t:"NEM",d:"2026-02-02",ex:"2026-03-02",ra:"DROPPED_FROM_TOP",pe:112.47,ps:128.04,pp:13.84,me:15268.86,peur:2113.21,ca:76344.52,cap:78457.73,s:"win",y:2026},
  {t:"LRCX",d:"2026-03-02",ex:"2026-04-01",ra:"DROPPED_FROM_TOP",pe:230.95,ps:221.79,pp:-3.97,me:15691.58,peur:-622.96,ca:78457.73,cap:77834.77,s:"loss",y:2026},
  {t:"MU",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:412.91,ps:368.22,pp:-10.82,me:15566.91,peur:-1684.34,ca:77834.77,cap:76150.43,s:"loss",y:2026},
  {t:"STX",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:379.24,ps:423.54,pp:11.68,me:15230.11,peur:1778.88,ca:76150.43,cap:77929.31,s:"win",y:2026},
  {t:"TE",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:6.85,ps:4.48,pp:-34.5,me:15585.8,peur:-3117.16,ca:77929.31,cap:74812.15,s:"loss",y:2026},
  {t:"WDC",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:270.15,ps:297.95,pp:10.29,me:14962.47,peur:1539.64,ca:74812.15,cap:76351.79,s:"win",y:2026},
  {t:"WDC",d:"2026-04-01",ex:"2026-05-01",ra:"REBALANCE_ADJUST",pe:297.95,ps:431.84,pp:44.94,me:15270.34,peur:6862.49,ca:76351.79,cap:83214.28,s:"win",y:2026},
  {t:"MU",d:"2026-04-01",ex:"2026-05-01",ra:"REBALANCE_ADJUST",pe:368.22,ps:542.75,pp:47.4,me:16642.86,peur:7888.71,ca:83214.28,cap:91102.99,s:"win",y:2026},
  {t:"STX",d:"2026-04-01",ex:"2026-05-01",ra:"REBALANCE_ADJUST",pe:423.54,ps:727.66,pp:71.8,me:18220.54,peur:13082.34,ca:91102.99,cap:104185.34,s:"win",y:2026},
  {t:"TE",d:"2026-04-01",ex:"2026-05-01",ra:"DROPPED_FROM_TOP",pe:4.48,ps:5.14,pp:14.73,me:20837.11,peur:3069.31,ca:104185.34,cap:107254.65,s:"win",y:2026},
  {t:"MU",d:"2026-05-01",ex:"2026-06-01",ra:"REBALANCE_ADJUST",pe:542.75,ps:1036.54,pp:90.98,me:21450.93,peur:19516.06,ca:107254.65,cap:126770.7,s:"win",y:2026},
  {t:"STX",d:"2026-05-01",ex:"2026-06-01",ra:"REBALANCE_ADJUST",pe:727.66,ps:922.18,pp:26.73,me:25354.11,peur:6777.15,ca:126770.7,cap:133547.85,s:"win",y:2026},
  {t:"FOSL",d:"2026-05-01",ex:"2026-06-01",ra:"DROPPED_FROM_TOP",pe:4.32,ps:4.13,pp:-4.59,me:26709.66,peur:-1225.97,ca:133547.85,cap:132321.88,s:"loss",y:2026},
  {t:"WDC",d:"2026-05-01",ex:"2026-06-01",ra:"REBALANCE_ADJUST",pe:431.84,ps:546.6,pp:26.58,me:26464.27,peur:7034.2,ca:132321.88,cap:139356.08,s:"win",y:2026},
];

const years = [...new Set(trades.map(t => t.y))].sort((a, b) => b - a)
function fmt(n: number) { return n > 0 ? '+' + n.toFixed(2) : n.toFixed(2); }

export default function TrackRecordPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const filteredTrades = selectedYear
    ? trades.filter(t => t.y === selectedYear)
    : trades

  const wins = filteredTrades.filter(t => t.s === "win").length
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
            {trades.length} trades de janvier 2020 à juin 2026 — glissement et frais réels inclus
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{displayTotal}</div>
            <div className="text-xs text-[#FEFEFE]/50">Trades</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#10B981]">{displayWinRate}%</div>
            <div className="text-xs text-[#FEFEFE]/50">Réussite</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F59E0B]">73.2%</div>
            <div className="text-xs text-[#FEFEFE]/50">CAGR</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#3B82F6]">{trades.length > 0 ? Math.round(trades[trades.length-1].cap) : 0}€</div>
            <div className="text-xs text-[#FEFEFE]/50">Capital Final</div>
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

        {/* Table with ALL CSV columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-[#334155]/50 bg-[#1E293B]/50 backdrop-blur-sm"
        >
          <div className="overflow-x-auto max-h-[700px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E293B] z-10">
                <tr className="border-b border-[#334155]/50">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Ticker</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Entrée</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Sortie</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#FCD34D]">Raison</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Px Entrée</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Px Sortie</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Pnl%</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Mise €</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Pnl €</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Cap Avant</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Cap Après</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#FCD34D]">Capital</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: Math.min(i * 0.005, 0.8) }}
                    className="border-b border-[#334155]/20 hover:bg-[#F59E0B]/5 transition-colors"
                  >
                    <td className="px-3 py-2 text-sm font-medium text-white">{trade.t}</td>
                    <td className="px-3 py-2 text-sm text-[#FEFEFE]/60 whitespace-nowrap">{trade.d}</td>
                    <td className="px-3 py-2 text-sm text-[#FEFEFE]/60 whitespace-nowrap">{trade.ex}</td>
                    <td className="px-3 py-2 text-xs text-[#FEFEFE]/50 max-w-[120px] truncate">{trade.ra}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.pe.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.ps.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right text-sm font-semibold ${trade.s === 'win' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      <span className="flex items-center justify-end space-x-1">
                        {trade.s === 'win' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        <span>{fmt(trade.pp)}%</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.me.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right text-sm font-semibold ${trade.peur > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{fmt(trade.peur)}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.ca.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/70">{trade.cap.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-sm text-[#FEFEFE]/50">{trade.cap.toFixed(2)}</td>
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