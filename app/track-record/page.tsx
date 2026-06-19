"use client"

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const trades = [
  {t:"SE",d:"2020-01-02",ex:"2020-02-03",ra:"REBALANCE_ADJUST",pe:40.08,ps:46.42,pp:15.81,me:750,peur:118.58,ca:3000,s:"win",y:2020},
  {t:"LRCX",d:"2020-01-02",ex:"2020-02-03",ra:"REBALANCE_ADJUST",pe:27.74,ps:28.73,pp:3.54,me:750,peur:26.55,ca:3000,s:"win",y:2020},
  {t:"KLAC",d:"2020-01-02",ex:"2020-02-03",ra:"REBALANCE_ADJUST",pe:16.97,ps:15.79,pp:-6.92,me:750,peur:-51.9,ca:3000,s:"loss",y:2020},
  {t:"CMG",d:"2020-01-02",ex:"2020-02-03",ra:"DROPPED_FROM_TOP",pe:17.18,ps:17.33,pp:0.86,me:750,peur:6.45,ca:3000,s:"win",y:2020},
  {t:"KLAC",d:"2020-02-03",ex:"2020-03-02",ra:"DROPPED_FROM_TOP",pe:15.79,ps:14.79,pp:-6.31,me:774.92,peur:-48.9,ca:3099.68,s:"loss",y:2020},
  {t:"LRCX",d:"2020-02-03",ex:"2020-03-02",ra:"REBALANCE_ADJUST",pe:28.73,ps:27.97,pp:-2.63,me:774.92,peur:-20.38,ca:3099.68,s:"loss",y:2020},
  {t:"SE",d:"2020-02-03",ex:"2020-03-02",ra:"REBALANCE_ADJUST",pe:46.42,ps:48.09,pp:3.6,me:774.92,peur:27.9,ca:3099.68,s:"win",y:2020},
  {t:"TGT",d:"2020-02-03",ex:"2020-03-02",ra:"DROPPED_FROM_TOP",pe:94.22,ps:91.67,pp:-2.71,me:774.92,peur:-21,ca:3099.68,s:"loss",y:2020},
  {t:"QCOM",d:"2020-03-02",ex:"2020-04-01",ra:"DROPPED_FROM_TOP",pe:69.89,ps:57.51,pp:-17.71,me:607.46,peur:-107.58,ca:3037.29,s:"loss",y:2020},
  {t:"NVDA",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:6.88,ps:6.05,pp:-12.07,me:607.46,peur:-73.32,ca:3037.29,s:"loss",y:2020},
  {t:"SE",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:48.09,ps:43.21,pp:-10.14,me:607.46,peur:-61.6,ca:3037.29,s:"loss",y:2020},
  {t:"AAPL",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:72.21,ps:58.21,pp:-19.38,me:607.46,peur:-117.73,ca:3037.29,s:"loss",y:2020},
  {t:"LRCX",d:"2020-03-02",ex:"2020-04-01",ra:"REBALANCE_ADJUST",pe:27.97,ps:20.92,pp:-25.19,me:607.46,peur:-121.49,ca:3037.29,s:"loss",y:2020},
  {t:"NVDA",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:6.05,ps:7.03,pp:16.1,me:638.89,peur:102.86,ca:2555.58,s:"win",y:2020},
  {t:"SE",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:43.21,ps:54.73,pp:26.64,me:638.89,peur:170.2,ca:2555.58,s:"win",y:2020},
  {t:"AAPL",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:58.21,ps:69.71,pp:19.75,me:638.89,peur:126.18,ca:2555.58,s:"win",y:2020},
  {t:"LRCX",d:"2020-04-01",ex:"2020-05-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:20.92,ps:21.98,pp:5.02,me:638.89,peur:32.07,ca:2555.58,s:"win",y:2020},
  {t:"SE",d:"2020-06-01",ex:"2020-07-01",ra:"REBALANCE_ADJUST",pe:82.55,ps:114.57,pp:38.79,me:597.38,peur:231.72,ca:2986.9,s:"win",y:2020},
  {t:"REGN",d:"2020-06-01",ex:"2020-07-01",ra:"REBALANCE_ADJUST",pe:595.15,ps:604.78,pp:1.62,me:597.38,peur:9.68,ca:2986.9,s:"win",y:2020},
  {t:"HUM",d:"2020-06-01",ex:"2020-07-01",ra:"DROPPED_FROM_TOP",pe:380.15,ps:370.6,pp:-2.51,me:597.38,peur:-14.99,ca:2986.9,s:"loss",y:2020},
  {t:"NEM",d:"2020-06-01",ex:"2020-07-01",ra:"DROPPED_FROM_TOP",pe:50.73,ps:51.58,pp:1.67,me:597.38,peur:9.98,ca:2986.9,s:"win",y:2020},
  {t:"NVDA",d:"2020-06-01",ex:"2020-07-01",ra:"REBALANCE_ADJUST",pe:8.77,ps:9.5,pp:8.27,me:597.38,peur:49.4,ca:2986.9,s:"win",y:2020},
  {t:"AAPL",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:88.22,ps:105.58,pp:19.68,me:654.54,peur:128.81,ca:3272.68,s:"win",y:2020},
  {t:"BBBY",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:30.1,ps:83.04,pp:175.89,me:654.54,peur:1151.26,ca:3272.68,s:"win",y:2020},
  {t:"NVDA",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:9.5,ps:10.97,pp:15.53,me:654.54,peur:101.65,ca:3272.68,s:"win",y:2020},
  {t:"REGN",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:604.78,ps:640.53,pp:5.91,me:654.54,peur:38.68,ca:3272.68,s:"win",y:2020},
  {t:"SE",d:"2020-07-01",ex:"2020-08-03",ra:"REBALANCE_ADJUST",pe:114.57,ps:132.88,pp:15.98,me:654.54,peur:104.59,ca:3272.68,s:"win",y:2020},
  {t:"AAPL",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:105.58,ps:130.28,pp:23.39,me:959.54,peur:224.44,ca:4797.69,s:"win",y:2020},
  {t:"BBBY",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:83.04,ps:88.52,pp:6.59,me:959.54,peur:63.23,ca:4797.69,s:"win",y:2020},
  {t:"NVDA",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:10.97,ps:13.78,pp:25.57,me:959.54,peur:245.35,ca:4797.69,s:"win",y:2020},
  {t:"REGN",d:"2020-08-03",ex:"2020-09-01",ra:"DROPPED_FROM_TOP",pe:640.53,ps:587.24,pp:-8.32,me:959.54,peur:-79.83,ca:4797.69,s:"loss",y:2020},
  {t:"SE",d:"2020-08-03",ex:"2020-09-01",ra:"REBALANCE_ADJUST",pe:132.88,ps:161.96,pp:21.88,me:959.54,peur:209.95,ca:4797.69,s:"win",y:2020},
  {t:"SE",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:161.96,ps:160.16,pp:-1.11,me:1365.21,peur:-15.15,ca:5460.82,s:"loss",y:2020},
  {t:"NVDA",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:13.78,ps:13.57,pp:-1.49,me:1365.21,peur:-20.34,ca:5460.82,s:"loss",y:2020},
  {t:"BBBY",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:88.52,ps:83.95,pp:-5.16,me:1365.21,peur:-70.44,ca:5460.82,s:"loss",y:2020},
  {t:"AAPL",d:"2020-09-01",ex:"2020-10-01",ra:"REBALANCE_ADJUST",pe:130.28,ps:113.4,pp:-12.96,me:1365.21,peur:-176.93,ca:5460.82,s:"loss",y:2020},
  {t:"AAPL",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:113.4,ps:105.61,pp:-6.87,me:1035.59,peur:-71.15,ca:5177.95,s:"loss",y:2020},
  {t:"ADT",d:"2020-10-01",ex:"2020-11-02",ra:"DROPPED_FROM_TOP",pe:7.14,ps:5.86,pp:-17.93,me:1035.59,peur:-185.68,ca:5177.95,s:"loss",y:2020},
  {t:"BBBY",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:83.95,ps:58.44,pp:-30.39,me:1035.59,peur:-207.12,ca:5177.95,s:"loss",y:2020},
  {t:"NVDA",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:13.57,ps:12.54,pp:-7.59,me:1035.59,peur:-78.6,ca:5177.95,s:"loss",y:2020},
  {t:"SE",d:"2020-10-01",ex:"2020-11-02",ra:"REBALANCE_ADJUST",pe:160.16,ps:159.83,pp:-0.21,me:1035.59,peur:-2.17,ca:5177.95,s:"loss",y:2020},
  {t:"AAPL",d:"2020-11-02",ex:"2020-12-01",ra:"DROPPED_FROM_TOP",pe:105.61,ps:119.12,pp:12.79,me:1158.31,peur:148.15,ca:4633.23,s:"win",y:2020},
  {t:"BBBY",d:"2020-11-02",ex:"2020-12-01",ra:"REBALANCE_ADJUST",pe:58.44,ps:63.2,pp:8.15,me:1158.31,peur:94.4,ca:4633.23,s:"win",y:2020},
  {t:"NVDA",d:"2020-11-02",ex:"2020-12-01",ra:"REBALANCE_ADJUST",pe:12.54,ps:13.35,pp:6.43,me:1158.31,peur:74.48,ca:4633.23,s:"win",y:2020},
  {t:"SE",d:"2020-11-02",ex:"2020-12-01",ra:"REBALANCE_ADJUST",pe:159.83,ps:177.56,pp:11.09,me:1158.31,peur:128.46,ca:4633.23,s:"win",y:2020},
  {t:"SE",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:177.56,ps:196.26,pp:10.53,me:1269.68,peur:133.7,ca:5078.72,s:"win",y:2020},
  {t:"NVDA",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:13.35,ps:13.07,pp:-2.04,me:1269.68,peur:-25.9,ca:5078.72,s:"loss",y:2020},
  {t:"BBBY",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:63.2,ps:49.51,pp:-21.67,me:1269.68,peur:-253.94,ca:5078.72,s:"loss",y:2020},
  {t:"GME",d:"2020-12-01",ex:"2021-01-04",ra:"REBALANCE_ADJUST",pe:3.95,ps:4.32,pp:9.18,me:1269.68,peur:116.56,ca:5078.72,s:"win",y:2020},
  {t:"BBBY",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:49.51,ps:79.6,pp:60.78,me:1262.28,peur:767.22,ca:5049.14,s:"win",y:2021},
  {t:"GME",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:4.32,ps:56.31,pp:1204.35,me:1262.28,peur:15202.32,ca:5049.14,s:"win",y:2021},
  {t:"NVDA",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:13.07,ps:13.2,pp:0.94,me:1262.28,peur:11.87,ca:5049.14,s:"win",y:2021},
  {t:"SE",d:"2021-01-04",ex:"2021-02-01",ra:"REBALANCE_ADJUST",pe:196.26,ps:233.76,pp:19.11,me:1262.28,peur:241.22,ca:5049.14,s:"win",y:2021},
  {t:"SE",d:"2021-02-01",ex:"2021-03-01",ra:"REBALANCE_ADJUST",pe:233.76,ps:248.76,pp:6.41,me:4254.35,peur:272.7,ca:21271.75,s:"win",y:2021},
  {t:"BBBY",d:"2021-02-01",ex:"2021-03-01",ra:"REBALANCE_ADJUST",pe:79.6,ps:73.1,pp:-8.16,me:4254.35,peur:-347.16,ca:21271.75,s:"loss",y:2021},
  {t:"GME",d:"2021-02-01",ex:"2021-03-01",ra:"REBALANCE_ADJUST",pe:56.31,ps:30.13,pp:-46.49,me:4254.35,peur:-850.87,ca:21271.75,s:"loss",y:2021},
  {t:"NVDA",d:"2021-02-01",ex:"2021-03-01",ra:"DROPPED_FROM_TOP",pe:13.2,ps:13.77,pp:4.36,me:4254.35,peur:185.49,ca:21271.75,s:"win",y:2021},
  {t:"PYPL",d:"2021-02-01",ex:"2021-03-01",ra:"DROPPED_FROM_TOP",pe:240.01,ps:271.01,pp:12.91,me:4254.35,peur:549.24,ca:21271.75,s:"win",y:2021},
  {t:"SE",d:"2021-03-01",ex:"2021-04-01",ra:"REBALANCE_ADJUST",pe:248.76,ps:236.69,pp:-4.85,me:5270.29,peur:-255.61,ca:21081.16,s:"loss",y:2021},
  {t:"GME",d:"2021-03-01",ex:"2021-04-01",ra:"REBALANCE_ADJUST",pe:30.13,ps:47.91,pp:59.01,me:5270.29,peur:3110,ca:21081.16,s:"win",y:2021},
  {t:"EQT",d:"2021-03-01",ex:"2021-04-01",ra:"DROPPED_FROM_TOP",pe:17.24,ps:17.69,pp:2.61,me:5270.29,peur:137.55,ca:21081.16,s:"win",y:2021},
  {t:"BBBY",d:"2021-03-01",ex:"2021-04-01",ra:"REBALANCE_ADJUST",pe:73.1,ps:68.77,pp:-5.93,me:5270.29,peur:-312.53,ca:21081.16,s:"loss",y:2021},
  {t:"SE",d:"2021-04-01",ex:"2021-05-03",ra:"REBALANCE_ADJUST",pe:236.69,ps:254.87,pp:7.68,me:4752.11,peur:364.96,ca:23760.57,s:"win",y:2021},
  {t:"BBBY",d:"2021-04-01",ex:"2021-05-03",ra:"REBALANCE_ADJUST",pe:68.77,ps:82.58,pp:20.09,me:4752.11,peur:954.7,ca:23760.57,s:"win",y:2021},
  {t:"FOSL",d:"2021-04-01",ex:"2021-05-03",ra:"DROPPED_FROM_TOP",pe:12.49,ps:13.11,pp:4.92,me:4752.11,peur:233.8,ca:23760.57,s:"win",y:2021},
  {t:"GME",d:"2021-04-01",ex:"2021-05-03",ra:"REBALANCE_ADJUST",pe:47.91,ps:40.59,pp:-15.28,me:4752.11,peur:-726.12,ca:23760.57,s:"loss",y:2021},
  {t:"RRC",d:"2021-04-01",ex:"2021-05-03",ra:"DROPPED_FROM_TOP",pe:10.62,ps:10.39,pp:-2.18,me:4752.11,peur:-103.6,ca:23760.57,s:"loss",y:2021},
  {t:"GME",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:40.59,ps:62.32,pp:53.53,me:4896.86,peur:2621.29,ca:24484.32,s:"win",y:2021},
  {t:"SE",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:254.87,ps:257.8,pp:1.15,me:4896.86,peur:56.31,ca:24484.32,s:"win",y:2021},
  {t:"BBBY",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:82.58,ps:85.75,pp:3.83,me:4896.86,peur:187.55,ca:24484.32,s:"win",y:2021},
  {t:"CPRI",d:"2021-05-03",ex:"2021-06-01",ra:"DROPPED_FROM_TOP",pe:57.47,ps:56.21,pp:-2.18,me:4896.86,peur:-106.75,ca:24484.32,s:"loss",y:2021},
  {t:"SIG",d:"2021-05-03",ex:"2021-06-01",ra:"REBALANCE_ADJUST",pe:59.45,ps:59.53,pp:0.14,me:4896.86,peur:6.86,ca:24484.32,s:"win",y:2021},
  {t:"SIG",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:59.53,ps:75.36,pp:26.59,me:5449.92,peur:1449.13,ca:27249.58,s:"win",y:2021},
  {t:"SE",d:"2021-06-01",ex:"2021-07-01",ra:"DROPPED_FROM_TOP",pe:257.8,ps:272.04,pp:5.52,me:5449.92,peur:300.84,ca:27249.58,s:"win",y:2021},
  {t:"FCX",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:41.32,ps:34.66,pp:-16.1,me:5449.92,peur:-877.44,ca:27249.58,s:"loss",y:2021},
  {t:"GME",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:62.32,ps:51.14,pp:-17.93,me:5449.92,peur:-977.17,ca:27249.58,s:"loss",y:2021},
  {t:"BBBY",d:"2021-06-01",ex:"2021-07-01",ra:"REBALANCE_ADJUST",pe:85.75,ps:90.37,pp:5.39,me:5449.92,peur:293.75,ca:27249.58,s:"win",y:2021},
  {t:"BBBY",d:"2021-07-01",ex:"2021-08-02",ra:"DROPPED_FROM_TOP",pe:90.37,ps:67.68,pp:-25.11,me:5487.74,peur:-1097.55,ca:27438.69,s:"loss",y:2021},
  {t:"FCX",d:"2021-07-01",ex:"2021-08-02",ra:"DROPPED_FROM_TOP",pe:34.66,ps:34.23,pp:-1.26,me:5487.74,peur:-69.15,ca:27438.69,s:"loss",y:2021},
  {t:"FOSL",d:"2021-07-01",ex:"2021-08-02",ra:"DROPPED_FROM_TOP",pe:14.51,ps:12.57,pp:-13.41,me:5487.74,peur:-735.91,ca:27438.69,s:"loss",y:2021},
  {t:"GME",d:"2021-07-01",ex:"2021-08-02",ra:"REBALANCE_ADJUST",pe:51.14,ps:39.45,pp:-22.86,me:5487.74,peur:-1097.55,ca:27438.69,s:"loss",y:2021},
  {t:"SIG",d:"2021-07-01",ex:"2021-08-02",ra:"REBALANCE_ADJUST",pe:75.36,ps:61.93,pp:-17.82,me:5487.74,peur:-977.92,ca:27438.69,s:"loss",y:2021},
  {t:"CPRI",d:"2021-08-02",ex:"2021-09-01",ra:"REBALANCE_ADJUST",pe:57.24,ps:57.21,pp:-0.05,me:4692.13,peur:-2.35,ca:23460.63,s:"loss",y:2021},
  {t:"GME",d:"2021-08-02",ex:"2021-09-01",ra:"REBALANCE_ADJUST",pe:39.45,ps:53.3,pp:35.09,me:4692.13,peur:1646.47,ca:23460.63,s:"win",y:2021},
  {t:"PBI",d:"2021-08-02",ex:"2021-09-01",ra:"DROPPED_FROM_TOP",pe:6.59,ps:6.18,pp:-6.16,me:4692.13,peur:-289.03,ca:23460.63,s:"loss",y:2021},
  {t:"SIG",d:"2021-08-02",ex:"2021-09-01",ra:"REBALANCE_ADJUST",pe:61.93,ps:76.38,pp:23.33,me:4692.13,peur:1094.67,ca:23460.63,s:"win",y:2021},
  {t:"THC",d:"2021-08-02",ex:"2021-09-01",ra:"DROPPED_FROM_TOP",pe:71.28,ps:74.92,pp:5.1,me:4692.13,peur:239.3,ca:23460.63,s:"win",y:2021},
  {t:"TPR",d:"2021-09-01",ex:"2021-10-01",ra:"DROPPED_FROM_TOP",pe:35.65,ps:33.57,pp:-5.82,me:5229.94,peur:-304.38,ca:26149.69,s:"loss",y:2021},
  {t:"SIG",d:"2021-09-01",ex:"2021-10-01",ra:"REBALANCE_ADJUST",pe:76.38,ps:77.21,pp:1.09,me:5229.94,peur:57.01,ca:26149.69,s:"win",y:2021},
  {t:"GME",d:"2021-09-01",ex:"2021-10-01",ra:"REBALANCE_ADJUST",pe:53.3,ps:44.27,pp:-16.93,me:5229.94,peur:-885.43,ca:26149.69,s:"loss",y:2021},
  {t:"FOSL",d:"2021-09-01",ex:"2021-10-01",ra:"DROPPED_FROM_TOP",pe:13.92,ps:11.98,pp:-13.98,me:5229.94,peur:-731.15,ca:26149.69,s:"loss",y:2021},
  {t:"CPRI",d:"2021-09-01",ex:"2021-10-01",ra:"REBALANCE_ADJUST",pe:57.21,ps:49.88,pp:-12.81,me:5229.94,peur:-669.96,ca:26149.69,s:"loss",y:2021},
  {t:"BBT",d:"2021-10-01",ex:"2021-11-01",ra:"DROPPED_FROM_TOP",pe:23.6,ps:24.69,pp:4.63,me:4723.16,peur:218.68,ca:23615.78,s:"win",y:2021},
  {t:"CPRI",d:"2021-10-01",ex:"2021-11-01",ra:"DROPPED_FROM_TOP",pe:49.88,ps:55.5,pp:11.28,me:4723.16,peur:532.77,ca:23615.78,s:"win",y:2021},
  {t:"GME",d:"2021-10-01",ex:"2021-11-01",ra:"REBALANCE_ADJUST",pe:44.27,ps:50.07,pp:13.1,me:4723.16,peur:618.73,ca:23615.78,s:"win",y:2021},
  {t:"M",d:"2021-10-01",ex:"2021-11-01",ra:"REBALANCE_ADJUST",pe:19.18,ps:23.82,pp:24.16,me:4723.16,peur:1141.11,ca:23615.78,s:"win",y:2021},
  {t:"SIG",d:"2021-10-01",ex:"2021-11-01",ra:"REBALANCE_ADJUST",pe:77.21,ps:91.47,pp:18.46,me:4723.16,peur:871.89,ca:23615.78,s:"win",y:2021},
  {t:"DVN",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:33.63,ps:32.71,pp:-2.74,me:5399.8,peur:-147.95,ca:26998.98,s:"loss",y:2021},
  {t:"GME",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:50.07,ps:45,pp:-10.12,me:5399.8,peur:-546.46,ca:26998.98,s:"loss",y:2021},
  {t:"M",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:23.82,ps:22.78,pp:-4.36,me:5399.8,peur:-235.43,ca:26998.98,s:"loss",y:2021},
  {t:"RIG",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:3.76,ps:2.92,pp:-22.34,me:5399.8,peur:-1079.96,ca:26998.98,s:"loss",y:2021},
  {t:"SIG",d:"2021-11-01",ex:"2021-12-01",ra:"REBALANCE_ADJUST",pe:91.47,ps:88.19,pp:-3.58,me:5399.8,peur:-193.31,ca:26998.98,s:"loss",y:2021},
  {t:"SIG",d:"2021-12-01",ex:"2022-01-03",ra:"REBALANCE_ADJUST",pe:88.19,ps:88.27,pp:0.09,me:4959.17,peur:4.46,ca:24795.86,s:"win",y:2021},
  {t:"RIG",d:"2021-12-01",ex:"2022-01-03",ra:"DROPPED_FROM_TOP",pe:2.92,ps:3.12,pp:6.64,me:4959.17,peur:329.29,ca:24795.86,s:"win",y:2021},
  {t:"DVN",d:"2021-12-01",ex:"2022-01-03",ra:"REBALANCE_ADJUST",pe:32.71,ps:37.19,pp:13.71,me:4959.17,peur:679.9,ca:24795.86,s:"win",y:2021},
  {t:"GME",d:"2021-12-01",ex:"2022-01-03",ra:"REBALANCE_ADJUST",pe:45,ps:38.25,pp:-15.01,me:4959.17,peur:-744.37,ca:24795.86,s:"loss",y:2021},
  {t:"M",d:"2021-12-01",ex:"2022-01-03",ra:"DROPPED_FROM_TOP",pe:22.78,ps:23.04,pp:1.14,me:4959.17,peur:56.53,ca:24795.86,s:"win",y:2021},
  {t:"DVN",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:37.19,ps:42.89,pp:15.34,me:6280.42,peur:963.42,ca:25121.68,s:"win",y:2022},
  {t:"GME",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:38.25,ps:28.18,pp:-26.33,me:6280.42,peur:-1256.08,ca:25121.68,s:"loss",y:2022},
  {t:"HAR",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:14214.2,ps:8208.2,pp:-42.25,me:6280.42,peur:-1256.08,ca:25121.68,s:"loss",y:2022},
  {t:"SIG",d:"2022-01-03",ex:"2022-02-01",ra:"REBALANCE_ADJUST",pe:88.27,ps:82.25,pp:-6.82,me:6280.42,peur:-428.32,ca:25121.68,s:"loss",y:2022},
  {t:"DVN",d:"2022-02-01",ex:"2022-03-01",ra:"REBALANCE_ADJUST",pe:42.89,ps:48.35,pp:12.73,me:5786.15,peur:736.58,ca:23144.61,s:"win",y:2022},
  {t:"GME",d:"2022-02-01",ex:"2022-03-01",ra:"DROPPED_FROM_TOP",pe:28.18,ps:29.73,pp:5.49,me:5786.15,peur:317.66,ca:23144.61,s:"win",y:2022},
  {t:"HAR",d:"2022-02-01",ex:"2022-03-01",ra:"DROPPED_FROM_TOP",pe:8208.2,ps:10389.6,pp:26.58,me:5786.15,peur:1537.96,ca:23144.61,s:"win",y:2022},
  {t:"SIG",d:"2022-02-01",ex:"2022-03-01",ra:"DROPPED_FROM_TOP",pe:82.25,ps:63.55,pp:-22.74,me:5786.15,peur:-1157.23,ca:23144.61,s:"loss",y:2022},
  {t:"MUR",d:"2022-03-01",ex:"2022-04-01",ra:"DROPPED_FROM_TOP",pe:30.44,ps:35.7,pp:17.3,me:6144.89,peur:1063.07,ca:24579.57,s:"win",y:2022},
  {t:"EOG",d:"2022-03-01",ex:"2022-04-01",ra:"DROPPED_FROM_TOP",pe:95.99,ps:99.88,pp:4.05,me:6144.89,peur:248.87,ca:24579.57,s:"win",y:2022},
  {t:"COP",d:"2022-03-01",ex:"2022-04-01",ra:"DROPPED_FROM_TOP",pe:82.96,ps:86.14,pp:3.84,me:6144.89,peur:235.96,ca:24579.57,s:"win",y:2022},
  {t:"DVN",d:"2022-03-01",ex:"2022-04-01",ra:"REBALANCE_ADJUST",pe:48.35,ps:50.08,pp:3.57,me:6144.89,peur:219.37,ca:24579.57,s:"win",y:2022},
  {t:"CF",d:"2022-04-01",ex:"2022-05-02",ra:"REBALANCE_ADJUST",pe:91.2,ps:88.13,pp:-3.36,me:6586.71,peur:-221.31,ca:26346.84,s:"loss",y:2022},
  {t:"DVN",d:"2022-04-01",ex:"2022-05-02",ra:"REBALANCE_ADJUST",pe:50.08,ps:48.42,pp:-3.31,me:6586.71,peur:-218.02,ca:26346.84,s:"loss",y:2022},
  {t:"HAR",d:"2022-04-01",ex:"2022-05-02",ra:"DROPPED_FROM_TOP",pe:10160.15,ps:10139.85,pp:-0.2,me:6586.71,peur:-13.17,ca:26346.84,s:"loss",y:2022},
  {t:"RRC",d:"2022-04-01",ex:"2022-05-02",ra:"REBALANCE_ADJUST",pe:30.31,ps:28.67,pp:-5.39,me:6586.71,peur:-355.02,ca:26346.84,s:"loss",y:2022},
  {t:"APA",d:"2022-05-02",ex:"2022-06-01",ra:"DROPPED_FROM_TOP",pe:35.5,ps:41.55,pp:17.03,me:5107.86,peur:869.87,ca:25539.31,s:"win",y:2022},
  {t:"CF",d:"2022-05-02",ex:"2022-06-01",ra:"DROPPED_FROM_TOP",pe:88.13,ps:87.46,pp:-0.76,me:5107.86,peur:-38.82,ca:25539.31,s:"loss",y:2022},
  {t:"DVN",d:"2022-05-02",ex:"2022-06-01",ra:"REBALANCE_ADJUST",pe:48.42,ps:63.46,pp:31.07,me:5107.86,peur:1587.01,ca:25539.31,s:"win",y:2022},
  {t:"MUR",d:"2022-05-02",ex:"2022-06-01",ra:"REBALANCE_ADJUST",pe:32.21,ps:37.34,pp:15.95,me:5107.86,peur:814.7,ca:25539.31,s:"win",y:2022},
  {t:"RRC",d:"2022-05-02",ex:"2022-06-01",ra:"REBALANCE_ADJUST",pe:28.67,ps:33.85,pp:18.06,me:5107.86,peur:922.48,ca:25539.31,s:"win",y:2022},
  {t:"RRC",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:33.85,ps:24.33,pp:-28.12,me:7423.64,peur:-1484.73,ca:29694.56,s:"loss",y:2022},
  {t:"MUR",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:37.34,ps:26.33,pp:-29.5,me:7423.64,peur:-1484.73,ca:29694.56,s:"loss",y:2022},
  {t:"EQT",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:46.99,ps:32.27,pp:-31.32,me:7423.64,peur:-1484.73,ca:29694.56,s:"loss",y:2022},
  {t:"DVN",d:"2022-06-01",ex:"2022-07-01",ra:"ABSOLUTE_MOMENTUM_OFF",pe:63.46,ps:46.4,pp:-26.89,me:7423.64,peur:-1484.73,ca:29694.56,s:"loss",y:2022},
  {t:"FSLR",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:208.95,ps:191.58,pp:-8.31,me:4751.13,peur:-394.82,ca:23755.65,s:"loss",y:2023},
  {t:"FTI",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:13.75,ps:16.46,pp:19.69,me:4751.13,peur:935.5,ca:23755.65,s:"win",y:2023},
  {t:"GE",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:82.31,ps:85.15,pp:3.45,me:4751.13,peur:163.91,ca:23755.65,s:"win",y:2023},
  {t:"NFLX",d:"2023-06-01",ex:"2023-07-03",ra:"REBALANCE_ADJUST",pe:40.35,ps:44.19,pp:9.5,me:4751.13,peur:451.36,ca:23755.65,s:"win",y:2023},
  {t:"OI",d:"2023-06-01",ex:"2023-07-03",ra:"DROPPED_FROM_TOP",pe:20.86,ps:21.89,pp:4.92,me:4751.13,peur:233.76,ca:23755.65,s:"win",y:2023},
  {t:"FSLR",d:"2023-07-03",ex:"2023-08-01",ra:"REBALANCE_ADJUST",pe:191.58,ps:202.88,pp:5.9,me:6286.34,peur:370.89,ca:25145.35,s:"win",y:2023},
  {t:"FTI",d:"2023-07-03",ex:"2023-08-01",ra:"REBALANCE_ADJUST",pe:16.46,ps:17.56,pp:6.67,me:6286.34,peur:419.3,ca:25145.35,s:"win",y:2023},
  {t:"GE",d:"2023-07-03",ex:"2023-08-01",ra:"DROPPED_FROM_TOP",pe:85.15,ps:88.92,pp:4.43,me:6286.34,peur:278.48,ca:25145.35,s:"win",y:2023},
  {t:"NFLX",d:"2023-07-03",ex:"2023-08-01",ra:"REBALANCE_ADJUST",pe:44.19,ps:43.91,pp:-0.64,me:6286.34,peur:-40.23,ca:25145.35,s:"loss",y:2023},
  {t:"NVDA",d:"2023-08-01",ex:"2023-09-01",ra:"REBALANCE_ADJUST",pe:46.46,ps:48.46,pp:4.3,me:6543.45,peur:281.37,ca:26173.8,s:"win",y:2023},
  {t:"NFLX",d:"2023-08-01",ex:"2023-09-01",ra:"DROPPED_FROM_TOP",pe:43.91,ps:43.94,pp:0.09,me:6543.45,peur:5.89,ca:26173.8,s:"win",y:2023},
  {t:"FSLR",d:"2023-08-01",ex:"2023-09-01",ra:"DROPPED_FROM_TOP",pe:202.88,ps:186.18,pp:-8.23,me:6543.45,peur:-538.53,ca:26173.8,s:"loss",y:2023},
  {t:"FTI",d:"2023-08-01",ex:"2023-09-01",ra:"REBALANCE_ADJUST",pe:17.56,ps:19.23,pp:9.52,me:6543.45,peur:622.94,ca:26173.8,s:"win",y:2023},
  {t:"FTI",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:19.23,ps:19.67,pp:2.3,me:5309.09,peur:122.11,ca:26545.46,s:"win",y:2023},
  {t:"NVDA",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:48.46,ps:44.74,pp:-7.68,me:5309.09,peur:-407.74,ca:26545.46,s:"loss",y:2023},
  {t:"PHM",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:81,ps:71.92,pp:-11.21,me:5309.09,peur:-595.15,ca:26545.46,s:"loss",y:2023},
  {t:"RCL",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:95.11,ps:89.27,pp:-6.14,me:5309.09,peur:-325.98,ca:26545.46,s:"loss",y:2023},
  {t:"RIG",d:"2023-09-01",ex:"2023-10-02",ra:"REBALANCE_ADJUST",pe:8.47,ps:7.89,pp:-6.86,me:5309.09,peur:-364.2,ca:26545.46,s:"loss",y:2023},
  {t:"FTI",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:19.67,ps:21.52,pp:9.4,me:4994.9,peur:469.52,ca:24974.5,s:"win",y:2023},
  {t:"NVDA",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:44.74,ps:42.29,pp:-5.49,me:4994.9,peur:-274.22,ca:24974.5,s:"loss",y:2023},
  {t:"PHM",d:"2023-10-02",ex:"2023-11-01",ra:"DROPPED_FROM_TOP",pe:71.92,ps:75.71,pp:5.27,me:4994.9,peur:263.23,ca:24974.5,s:"win",y:2023},
  {t:"RCL",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:89.27,ps:83.01,pp:-7.01,me:4994.9,peur:-350.14,ca:24974.5,s:"loss",y:2023},
  {t:"RIG",d:"2023-10-02",ex:"2023-11-01",ra:"REBALANCE_ADJUST",pe:7.89,ps:6.66,pp:-15.61,me:4994.9,peur:-779.7,ca:24974.5,s:"loss",y:2023},
  {t:"RIG",d:"2023-11-01",ex:"2023-12-01",ra:"REBALANCE_ADJUST",pe:6.66,ps:6.57,pp:-1.35,me:4860.64,peur:-65.62,ca:24303.19,s:"loss",y:2023},
  {t:"RCL",d:"2023-11-01",ex:"2023-12-01",ra:"DROPPED_FROM_TOP",pe:83.01,ps:107.58,pp:29.6,me:4860.64,peur:1438.75,ca:24303.19,s:"win",y:2023},
  {t:"NVDA",d:"2023-11-01",ex:"2023-12-01",ra:"REBALANCE_ADJUST",pe:42.29,ps:46.72,pp:10.49,me:4860.64,peur:509.88,ca:24303.19,s:"win",y:2023},
  {t:"GE",d:"2023-11-01",ex:"2023-12-01",ra:"DROPPED_FROM_TOP",pe:84.46,ps:96.28,pp:13.99,me:4860.64,peur:680,ca:24303.19,s:"win",y:2023},
  {t:"FTI",d:"2023-11-01",ex:"2023-12-01",ra:"REBALANCE_ADJUST",pe:21.52,ps:20.39,pp:-5.25,me:4860.64,peur:-255.18,ca:24303.19,s:"loss",y:2023},
  {t:"AVGO",d:"2023-12-01",ex:"2024-01-02",ra:"REBALANCE_ADJUST",pe:90.43,ps:106.02,pp:17.24,me:5322.2,peur:917.55,ca:26611.02,s:"win",y:2023},
  {t:"FTI",d:"2023-12-01",ex:"2024-01-02",ra:"DROPPED_FROM_TOP",pe:20.39,ps:19.73,pp:-3.24,me:5322.2,peur:-172.44,ca:26611.02,s:"loss",y:2023},
  {t:"NVDA",d:"2023-12-01",ex:"2024-01-02",ra:"REBALANCE_ADJUST",pe:46.72,ps:48.13,pp:3.01,me:5322.2,peur:160.2,ca:26611.02,s:"win",y:2023},
  {t:"PHM",d:"2023-12-01",ex:"2024-01-02",ra:"REBALANCE_ADJUST",pe:89.41,ps:99.95,pp:11.79,me:5322.2,peur:627.49,ca:26611.02,s:"win",y:2023},
  {t:"RIG",d:"2023-12-01",ex:"2024-01-02",ra:"DROPPED_FROM_TOP",pe:6.57,ps:6.24,pp:-4.92,me:5322.2,peur:-261.85,ca:26611.02,s:"loss",y:2023},
  {t:"ADBE",d:"2024-01-02",ex:"2024-02-01",ra:"DROPPED_FROM_TOP",pe:580.65,ps:627.28,pp:8.03,me:5576.39,peur:447.78,ca:27881.96,s:"win",y:2024},
  {t:"AVGO",d:"2024-01-02",ex:"2024-02-01",ra:"REBALANCE_ADJUST",pe:106.02,ps:117.22,pp:10.56,me:5576.39,peur:588.87,ca:27881.96,s:"win",y:2024},
  {t:"GE",d:"2024-01-02",ex:"2024-02-01",ra:"DROPPED_FROM_TOP",pe:99.25,ps:106.49,pp:7.3,me:5576.39,peur:407.08,ca:27881.96,s:"win",y:2024},
  {t:"NVDA",d:"2024-01-02",ex:"2024-02-01",ra:"REBALANCE_ADJUST",pe:48.13,ps:62.98,pp:30.85,me:5576.39,peur:1720.32,ca:27881.96,s:"win",y:2024},
  {t:"PHM",d:"2024-01-02",ex:"2024-02-01",ra:"REBALANCE_ADJUST",pe:99.95,ps:105.05,pp:5.1,me:5576.39,peur:284.4,ca:27881.96,s:"win",y:2024},
  {t:"RCL",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:123.59,ps:120.96,pp:-2.13,me:6266.08,peur:-133.47,ca:31330.4,s:"loss",y:2024},
  {t:"PHM",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:105.05,ps:109.46,pp:4.2,me:6266.08,peur:263.18,ca:31330.4,s:"win",y:2024},
  {t:"CCL",d:"2024-02-01",ex:"2024-03-01",ra:"DROPPED_FROM_TOP",pe:16.64,ps:15.81,pp:-4.95,me:6266.08,peur:-310.17,ca:31330.4,s:"loss",y:2024},
  {t:"AVGO",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:117.22,ps:136.67,pp:16.6,me:6266.08,peur:1040.17,ca:31330.4,s:"win",y:2024},
  {t:"NVDA",d:"2024-02-01",ex:"2024-03-01",ra:"REBALANCE_ADJUST",pe:62.98,ps:82.22,pp:30.55,me:6266.08,peur:1914.29,ca:31330.4,s:"win",y:2024},
  {t:"AVGO",d:"2024-03-01",ex:"2024-04-01",ra:"REBALANCE_ADJUST",pe:136.67,ps:132.46,pp:-3.08,me:8526.1,peur:-262.6,ca:34104.4,s:"loss",y:2024},
  {t:"NVDA",d:"2024-03-01",ex:"2024-04-01",ra:"REBALANCE_ADJUST",pe:82.22,ps:90.3,pp:9.83,me:8526.1,peur:838.12,ca:34104.4,s:"win",y:2024},
  {t:"PHM",d:"2024-03-01",ex:"2024-04-01",ra:"REBALANCE_ADJUST",pe:109.46,ps:116.77,pp:6.68,me:8526.1,peur:569.54,ca:34104.4,s:"win",y:2024},
  {t:"RCL",d:"2024-03-01",ex:"2024-04-01",ra:"DROPPED_FROM_TOP",pe:120.96,ps:136.56,pp:12.89,me:8526.1,peur:1099.01,ca:34104.4,s:"win",y:2024},
  {t:"AVGO",d:"2024-04-01",ex:"2024-05-01",ra:"REBALANCE_ADJUST",pe:132.46,ps:121.92,pp:-7.95,me:9087.12,peur:-722.43,ca:36348.47,s:"loss",y:2024},
  {t:"LLY",d:"2024-04-01",ex:"2024-05-01",ra:"REBALANCE_ADJUST",pe:749.55,ps:765.51,pp:2.13,me:9087.12,peur:193.56,ca:36348.47,s:"win",y:2024},
  {t:"NVDA",d:"2024-04-01",ex:"2024-05-01",ra:"REBALANCE_ADJUST",pe:90.3,ps:82.98,pp:-8.1,me:9087.12,peur:-736.06,ca:36348.47,s:"loss",y:2024},
  {t:"PHM",d:"2024-04-01",ex:"2024-05-01",ra:"DROPPED_FROM_TOP",pe:116.77,ps:110.03,pp:-5.77,me:9087.12,peur:-524.33,ca:36348.47,s:"loss",y:2024},
  {t:"SLG",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:45.08,ps:48.37,pp:7.28,me:6911.84,peur:503.18,ca:34559.21,s:"win",y:2024},
  {t:"NVDA",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:82.98,ps:114.92,pp:38.49,me:6911.84,peur:2660.37,ca:34559.21,s:"win",y:2024},
  {t:"NRG",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:71.58,ps:76.13,pp:6.35,me:6911.84,peur:438.9,ca:34559.21,s:"win",y:2024},
  {t:"LLY",d:"2024-05-01",ex:"2024-06-03",ra:"DROPPED_FROM_TOP",pe:765.51,ps:818.99,pp:6.99,me:6911.84,peur:483.14,ca:34559.21,s:"win",y:2024},
  {t:"AVGO",d:"2024-05-01",ex:"2024-06-03",ra:"REBALANCE_ADJUST",pe:121.92,ps:129.67,pp:6.36,me:6911.84,peur:439.59,ca:34559.21,s:"win",y:2024},
  {t:"AVGO",d:"2024-06-03",ex:"2024-07-01",ra:"DROPPED_FROM_TOP",pe:129.67,ps:161.14,pp:24.27,me:7816.88,peur:1897.16,ca:39084.4,s:"win",y:2024},
  {t:"NRG",d:"2024-06-03",ex:"2024-07-01",ra:"REBALANCE_ADJUST",pe:76.13,ps:75.65,pp:-0.63,me:7816.88,peur:-49.25,ca:39084.4,s:"loss",y:2024},
  {t:"NVDA",d:"2024-06-03",ex:"2024-07-01",ra:"REBALANCE_ADJUST",pe:114.92,ps:124.22,pp:8.1,me:7816.88,peur:633.17,ca:39084.4,s:"win",y:2024},
  {t:"SLG",d:"2024-06-03",ex:"2024-07-01",ra:"REBALANCE_ADJUST",pe:48.37,ps:50.38,pp:4.16,me:7816.88,peur:325.18,ca:39084.4,s:"win",y:2024},
  {t:"WDC",d:"2024-06-03",ex:"2024-07-01",ra:"DROPPED_FROM_TOP",pe:56.47,ps:57.41,pp:1.66,me:7816.88,peur:129.76,ca:39084.4,s:"win",y:2024},
  {t:"GE",d:"2024-07-01",ex:"2024-08-01",ra:"DROPPED_FROM_TOP",pe:157.24,ps:167.85,pp:6.75,me:8404.08,peur:567.28,ca:42020.42,s:"win",y:2024},
  {t:"NRG",d:"2024-07-01",ex:"2024-08-01",ra:"REBALANCE_ADJUST",pe:75.65,ps:71.81,pp:-5.07,me:8404.08,peur:-426.09,ca:42020.42,s:"loss",y:2024},
  {t:"NVDA",d:"2024-07-01",ex:"2024-08-01",ra:"REBALANCE_ADJUST",pe:124.22,ps:109.14,pp:-12.14,me:8404.08,peur:-1020.26,ca:42020.42,s:"loss",y:2024},
  {t:"SLG",d:"2024-07-01",ex:"2024-08-01",ra:"REBALANCE_ADJUST",pe:50.38,ps:61.05,pp:21.18,me:8404.08,peur:1779.98,ca:42020.42,s:"win",y:2024},
  {t:"URI",d:"2024-07-01",ex:"2024-08-01",ra:"DROPPED_FROM_TOP",pe:630.4,ps:703.41,pp:11.58,me:8404.08,peur:973.19,ca:42020.42,s:"win",y:2024},
  {t:"SLG",d:"2024-08-01",ex:"2024-09-03",ra:"REBALANCE_ADJUST",pe:61.05,ps:59.41,pp:-2.69,me:10973.63,peur:-295.19,ca:43894.53,s:"loss",y:2024},
  {t:"NVDA",d:"2024-08-01",ex:"2024-09-03",ra:"REBALANCE_ADJUST",pe:109.14,ps:107.93,pp:-1.11,me:10973.63,peur:-121.81,ca:43894.53,s:"loss",y:2024},
  {t:"NRG",d:"2024-08-01",ex:"2024-09-03",ra:"REBALANCE_ADJUST",pe:71.81,ps:77.92,pp:8.5,me:10973.63,peur:932.76,ca:43894.53,s:"win",y:2024},
  {t:"MU",d:"2024-08-01",ex:"2024-09-03",ra:"DROPPED_FROM_TOP",pe:100.99,ps:87.95,pp:-12.91,me:10973.63,peur:-1416.7,ca:43894.53,s:"loss",y:2024},
  {t:"GE",d:"2024-09-03",ex:"2024-10-01",ra:"DROPPED_FROM_TOP",pe:162.7,ps:184.49,pp:13.39,me:8598.72,peur:1151.37,ca:42993.59,s:"win",y:2024},
  {t:"NRG",d:"2024-09-03",ex:"2024-10-01",ra:"REBALANCE_ADJUST",pe:77.92,ps:90.52,pp:16.18,me:8598.72,peur:1391.27,ca:42993.59,s:"win",y:2024},
  {t:"NVDA",d:"2024-09-03",ex:"2024-10-01",ra:"REBALANCE_ADJUST",pe:107.93,ps:116.93,pp:8.34,me:8598.72,peur:717.13,ca:42993.59,s:"win",y:2024},
  {t:"SLG",d:"2024-09-03",ex:"2024-10-01",ra:"DROPPED_FROM_TOP",pe:59.41,ps:64.31,pp:8.25,me:8598.72,peur:709.39,ca:42993.59,s:"win",y:2024},
  {t:"THC",d:"2024-09-03",ex:"2024-10-01",ra:"REBALANCE_ADJUST",pe:161.81,ps:163.03,pp:0.75,me:8598.72,peur:64.49,ca:42993.59,s:"win",y:2024},
  {t:"NRG",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:90.52,ps:85.11,pp:-5.98,me:9405.45,peur:-562.45,ca:47027.25,s:"loss",y:2024},
  {t:"NVDA",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:116.93,ps:135.32,pp:15.73,me:9405.45,peur:1479.48,ca:47027.25,s:"win",y:2024},
  {t:"PBI",d:"2024-10-01",ex:"2024-11-01",ra:"DROPPED_FROM_TOP",pe:6.52,ps:6.83,pp:4.75,me:9405.45,peur:446.76,ca:47027.25,s:"win",y:2024},
  {t:"SE",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:97.59,ps:95.48,pp:-2.16,me:9405.45,peur:-203.16,ca:47027.25,s:"loss",y:2024},
  {t:"THC",d:"2024-10-01",ex:"2024-11-01",ra:"REBALANCE_ADJUST",pe:163.03,ps:156.29,pp:-4.14,me:9405.45,peur:-389.39,ca:47027.25,s:"loss",y:2024},
  {t:"THC",d:"2024-11-01",ex:"2024-12-02",ra:"REBALANCE_ADJUST",pe:156.29,ps:142.17,pp:-9.03,me:9559.7,peur:-863.24,ca:47798.5,s:"loss",y:2024},
  {t:"SE",d:"2024-11-01",ex:"2024-12-02",ra:"DROPPED_FROM_TOP",pe:95.48,ps:113.13,pp:18.49,me:9559.7,peur:1767.59,ca:47798.5,s:"win",y:2024},
  {t:"NRG",d:"2024-11-01",ex:"2024-12-02",ra:"DROPPED_FROM_TOP",pe:85.11,ps:97.36,pp:14.39,me:9559.7,peur:1375.64,ca:47798.5,s:"win",y:2024},
  {t:"GE",d:"2024-11-01",ex:"2024-12-02",ra:"DROPPED_FROM_TOP",pe:170.37,ps:178.69,pp:4.88,me:9559.7,peur:466.51,ca:47798.5,s:"win",y:2024},
  {t:"NVDA",d:"2024-11-01",ex:"2024-12-02",ra:"REBALANCE_ADJUST",pe:135.32,ps:138.55,pp:2.39,me:9559.7,peur:228.48,ca:47798.5,s:"win",y:2024},
  {t:"NVDA",d:"2024-12-02",ex:"2025-01-02",ra:"REBALANCE_ADJUST",pe:138.55,ps:138.24,pp:-0.22,me:12693.37,peur:-27.93,ca:50773.48,s:"loss",y:2024},
  {t:"PBI",d:"2024-12-02",ex:"2025-01-02",ra:"DROPPED_FROM_TOP",pe:7.71,ps:6.9,pp:-10.49,me:12693.37,peur:-1331.53,ca:50773.48,s:"loss",y:2024},
  {t:"RCL",d:"2024-12-02",ex:"2025-01-02",ra:"REBALANCE_ADJUST",pe:240.43,ps:223.98,pp:-6.84,me:12693.37,peur:-868.23,ca:50773.48,s:"loss",y:2024},
  {t:"THC",d:"2024-12-02",ex:"2025-01-02",ra:"DROPPED_FROM_TOP",pe:142.17,ps:125.09,pp:-12.01,me:12693.37,peur:-1524.47,ca:50773.48,s:"loss",y:2024},
  {t:"JEF",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:75.82,ps:71.55,pp:-5.63,me:9404.26,peur:-529.46,ca:47021.32,s:"loss",y:2025},
  {t:"NVDA",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:138.24,ps:116.6,pp:-15.65,me:9404.26,peur:-1471.77,ca:47021.32,s:"loss",y:2025},
  {t:"RCL",d:"2025-01-02",ex:"2025-02-03",ra:"DROPPED_FROM_TOP",pe:223.98,ps:254.61,pp:13.68,me:9404.26,peur:1286.5,ca:47021.32,s:"win",y:2025},
  {t:"SE",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:104.97,ps:122.02,pp:16.24,me:9404.26,peur:1527.25,ca:47021.32,s:"win",y:2025},
  {t:"UAL",d:"2025-01-02",ex:"2025-02-03",ra:"REBALANCE_ADJUST",pe:95.53,ps:104.93,pp:9.85,me:9404.26,peur:926.32,ca:47021.32,s:"win",y:2025},
  {t:"NVDA",d:"2025-02-03",ex:"2025-03-03",ra:"REBALANCE_ADJUST",pe:116.6,ps:114,pp:-2.23,me:12190.04,peur:-271.84,ca:48760.16,s:"loss",y:2025},
  {t:"UAL",d:"2025-02-03",ex:"2025-03-03",ra:"REBALANCE_ADJUST",pe:104.93,ps:91.76,pp:-12.55,me:12190.04,peur:-1529.85,ca:48760.16,s:"loss",y:2025},
  {t:"JEF",d:"2025-02-03",ex:"2025-03-03",ra:"DROPPED_FROM_TOP",pe:71.55,ps:61.41,pp:-14.17,me:12190.04,peur:-1727.33,ca:48760.16,s:"loss",y:2025},
  {t:"SE",d:"2025-02-03",ex:"2025-03-03",ra:"REBALANCE_ADJUST",pe:122.02,ps:123.61,pp:1.3,me:12190.04,peur:158.47,ca:48760.16,s:"win",y:2025},
  {t:"NVDA",d:"2025-03-03",ex:"2025-04-01",ra:"DROPPED_FROM_TOP",pe:114,ps:109.89,pp:-3.61,me:9077.92,peur:-327.71,ca:45389.62,s:"loss",y:2025},
  {t:"PBI",d:"2025-03-03",ex:"2025-04-01",ra:"REBALANCE_ADJUST",pe:10.22,ps:8.7,pp:-14.88,me:9077.92,peur:-1350.8,ca:45389.62,s:"loss",y:2025},
  {t:"RCL",d:"2025-03-03",ex:"2025-04-01",ra:"DROPPED_FROM_TOP",pe:235.81,ps:203.84,pp:-13.56,me:9077.92,peur:-1230.97,ca:45389.62,s:"loss",y:2025},
  {t:"SE",d:"2025-03-03",ex:"2025-04-01",ra:"REBALANCE_ADJUST",pe:123.61,ps:132.59,pp:7.26,me:9077.92,peur:659.06,ca:45389.62,s:"win",y:2025},
  {t:"UAL",d:"2025-03-03",ex:"2025-04-01",ra:"REBALANCE_ADJUST",pe:91.76,ps:68.27,pp:-25.6,me:9077.92,peur:-1815.58,ca:45389.62,s:"loss",y:2025},
  {t:"SE",d:"2025-04-01",ex:"2025-05-01",ra:"REBALANCE_ADJUST",pe:132.59,ps:137.45,pp:3.66,me:10330.9,peur:378.11,ca:41323.62,s:"win",y:2025},
  {t:"MMM",d:"2025-04-01",ex:"2025-05-01",ra:"DROPPED_FROM_TOP",pe:144.4,ps:134.57,pp:-6.8,me:10330.9,peur:-702.5,ca:41323.62,s:"loss",y:2025},
  {t:"PBI",d:"2025-04-01",ex:"2025-05-01",ra:"REBALANCE_ADJUST",pe:8.7,ps:8.42,pp:-3.21,me:10330.9,peur:-331.62,ca:41323.62,s:"loss",y:2025},
  {t:"UAL",d:"2025-04-01",ex:"2025-05-01",ra:"DROPPED_FROM_TOP",pe:68.27,ps:69.09,pp:1.21,me:10330.9,peur:125,ca:41323.62,s:"win",y:2025},
  {t:"SE",d:"2025-05-01",ex:"2025-06-02",ra:"REBALANCE_ADJUST",pe:137.45,ps:165.27,pp:20.24,me:10198.15,peur:2064.11,ca:40792.61,s:"win",y:2025},
  {t:"PBI",d:"2025-05-01",ex:"2025-06-02",ra:"REBALANCE_ADJUST",pe:8.42,ps:9.96,pp:18.25,me:10198.15,peur:1861.16,ca:40792.61,s:"win",y:2025},
  {t:"GME",d:"2025-05-01",ex:"2025-06-02",ra:"REBALANCE_ADJUST",pe:27.46,ps:30.67,pp:11.7,me:10198.15,peur:1193.18,ca:40792.61,s:"win",y:2025},
  {t:"FOX",d:"2025-05-01",ex:"2025-06-02",ra:"DROPPED_FROM_TOP",pe:45.44,ps:50.01,pp:10.05,me:10198.15,peur:1024.91,ca:40792.61,s:"win",y:2025},
  {t:"GME",d:"2025-06-02",ex:"2025-07-01",ra:"DROPPED_FROM_TOP",pe:30.67,ps:23.66,pp:-22.87,me:11733.99,peur:-2346.8,ca:46935.97,s:"loss",y:2025},
  {t:"NFLX",d:"2025-06-02",ex:"2025-07-01",ra:"DROPPED_FROM_TOP",pe:122.02,ps:129.23,pp:5.91,me:11733.99,peur:693.48,ca:46935.97,s:"win",y:2025},
  {t:"PBI",d:"2025-06-02",ex:"2025-07-01",ra:"REBALANCE_ADJUST",pe:9.96,ps:10.88,pp:9.25,me:11733.99,peur:1085.39,ca:46935.97,s:"win",y:2025},
  {t:"SE",d:"2025-06-02",ex:"2025-07-01",ra:"REBALANCE_ADJUST",pe:165.27,ps:150.65,pp:-8.84,me:11733.99,peur:-1037.29,ca:46935.97,s:"loss",y:2025},
  {t:"NRG",d:"2025-07-01",ex:"2025-08-01",ra:"DROPPED_FROM_TOP",pe:154.35,ps:166.01,pp:7.55,me:9066.15,peur:684.49,ca:45330.76,s:"win",y:2025},
  {t:"PBI",d:"2025-07-01",ex:"2025-08-01",ra:"REBALANCE_ADJUST",pe:10.88,ps:10.91,pp:0.27,me:9066.15,peur:24.48,ca:45330.76,s:"win",y:2025},
  {t:"PM",d:"2025-07-01",ex:"2025-08-01",ra:"DROPPED_FROM_TOP",pe:172.92,ps:158.41,pp:-8.39,me:9066.15,peur:-760.65,ca:45330.76,s:"loss",y:2025},
  {t:"SE",d:"2025-07-01",ex:"2025-08-01",ra:"REBALANCE_ADJUST",pe:150.65,ps:154.36,pp:2.47,me:9066.15,peur:223.93,ca:45330.76,s:"win",y:2025},
  {t:"TPR",d:"2025-07-01",ex:"2025-08-01",ra:"REBALANCE_ADJUST",pe:85.92,ps:105.06,pp:22.28,me:9066.15,peur:2019.94,ca:45330.76,s:"win",y:2025},
  {t:"TPR",d:"2025-08-01",ex:"2025-09-02",ra:"REBALANCE_ADJUST",pe:105.06,ps:101.58,pp:-3.31,me:9504.59,peur:-314.6,ca:47522.96,s:"loss",y:2025},
  {t:"RCL",d:"2025-08-01",ex:"2025-09-02",ra:"REBALANCE_ADJUST",pe:309.28,ps:348.48,pp:12.67,me:9504.59,peur:1204.23,ca:47522.96,s:"win",y:2025},
  {t:"SE",d:"2025-08-01",ex:"2025-09-02",ra:"REBALANCE_ADJUST",pe:154.36,ps:178.96,pp:15.93,me:9504.59,peur:1514.08,ca:47522.96,s:"win",y:2025},
  {t:"LB",d:"2025-08-01",ex:"2025-09-02",ra:"DROPPED_FROM_TOP",pe:55.07,ps:54.66,pp:-0.76,me:9504.59,peur:-72.23,ca:47522.96,s:"loss",y:2025},
  {t:"PBI",d:"2025-08-01",ex:"2025-09-02",ra:"DROPPED_FROM_TOP",pe:10.91,ps:11.71,pp:7.31,me:9504.59,peur:694.79,ca:47522.96,s:"win",y:2025},
  {t:"AVGO",d:"2025-09-02",ex:"2025-10-01",ra:"DROPPED_FROM_TOP",pe:296.84,ps:331.72,pp:11.75,me:10109.84,peur:1187.91,ca:50549.22,s:"win",y:2025},
  {t:"NRG",d:"2025-09-02",ex:"2025-10-01",ra:"DROPPED_FROM_TOP",pe:143.99,ps:160.34,pp:11.35,me:10109.84,peur:1147.47,ca:50549.22,s:"win",y:2025},
  {t:"RCL",d:"2025-09-02",ex:"2025-10-01",ra:"REBALANCE_ADJUST",pe:348.48,ps:311.97,pp:-10.48,me:10109.84,peur:-1059.51,ca:50549.22,s:"loss",y:2025},
  {t:"SE",d:"2025-09-02",ex:"2025-10-01",ra:"REBALANCE_ADJUST",pe:178.96,ps:182.19,pp:1.81,me:10109.84,peur:182.99,ca:50549.22,s:"win",y:2025},
  {t:"TPR",d:"2025-09-02",ex:"2025-10-01",ra:"REBALANCE_ADJUST",pe:101.58,ps:112.92,pp:11.16,me:10109.84,peur:1128.26,ca:50549.22,s:"win",y:2025},
  {t:"FOSL",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:2.57,ps:2.06,pp:-20,me:10627.27,peur:-2125.45,ca:53136.33,s:"loss",y:2025},
  {t:"RCL",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:311.97,ps:273.69,pp:-12.27,me:10627.27,peur:-1303.97,ca:53136.33,s:"loss",y:2025},
  {t:"SE",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:182.19,ps:157.25,pp:-13.69,me:10627.27,peur:-1454.87,ca:53136.33,s:"loss",y:2025},
  {t:"TPR",d:"2025-10-01",ex:"2025-11-03",ra:"REBALANCE_ADJUST",pe:112.92,ps:105.48,pp:-6.59,me:10627.27,peur:-700.34,ca:53136.33,s:"loss",y:2025},
  {t:"UAL",d:"2025-10-01",ex:"2025-11-03",ra:"DROPPED_FROM_TOP",pe:93.24,ps:96.01,pp:2.97,me:10627.27,peur:315.63,ca:53136.33,s:"win",y:2025},
  {t:"WDC",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:157.93,ps:163.45,pp:3.49,me:11966.83,peur:417.64,ca:47867.33,s:"win",y:2025},
  {t:"TPR",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:105.48,ps:111.21,pp:5.43,me:11966.83,peur:649.8,ca:47867.33,s:"win",y:2025},
  {t:"STX",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:264.66,ps:269.19,pp:1.71,me:11966.83,peur:204.63,ca:47867.33,s:"win",y:2025},
  {t:"AVGO",d:"2025-11-03",ex:"2025-12-01",ra:"REBALANCE_ADJUST",pe:361.46,ps:384.92,pp:6.49,me:11966.83,peur:776.65,ca:47867.33,s:"win",y:2025},
  {t:"AVGO",d:"2025-12-01",ex:"2026-01-02",ra:"REBALANCE_ADJUST",pe:384.92,ps:347.24,pp:-9.79,me:9983.21,peur:-977.36,ca:49916.05,s:"loss",y:2025},
  {t:"STX",d:"2025-12-01",ex:"2026-01-02",ra:"REBALANCE_ADJUST",pe:269.19,ps:287.33,pp:6.74,me:9983.21,peur:672.87,ca:49916.05,s:"win",y:2025},
  {t:"TE",d:"2025-12-01",ex:"2026-01-02",ra:"DROPPED_FROM_TOP",pe:4.47,ps:7.83,pp:75.04,me:9983.21,peur:7491.4,ca:49916.05,s:"win",y:2025},
  {t:"TPR",d:"2025-12-01",ex:"2026-01-02",ra:"DROPPED_FROM_TOP",pe:111.21,ps:128.23,pp:15.31,me:9983.21,peur:1528.43,ca:49916.05,s:"win",y:2025},
  {t:"WDC",d:"2025-12-01",ex:"2026-01-02",ra:"REBALANCE_ADJUST",pe:163.45,ps:187.75,pp:14.87,me:9983.21,peur:1484.5,ca:49916.05,s:"win",y:2025},
  {t:"AVGO",d:"2026-01-02",ex:"2026-02-02",ra:"DROPPED_FROM_TOP",pe:347.24,ps:330.09,pp:-4.94,me:12023.18,peur:-593.95,ca:60115.9,s:"loss",y:2026},
  {t:"FOSL",d:"2026-01-02",ex:"2026-02-02",ra:"DROPPED_FROM_TOP",pe:3.82,ps:3.55,pp:-7.25,me:12023.18,peur:-871.68,ca:60115.9,s:"loss",y:2026},
  {t:"MU",d:"2026-01-02",ex:"2026-02-02",ra:"REBALANCE_ADJUST",pe:315.6,ps:438.05,pp:38.8,me:12023.18,peur:4664.99,ca:60115.9,s:"win",y:2026},
  {t:"STX",d:"2026-01-02",ex:"2026-02-02",ra:"REBALANCE_ADJUST",pe:287.33,ps:432.63,pp:50.57,me:12023.18,peur:6080.12,ca:60115.9,s:"win",y:2026},
  {t:"WDC",d:"2026-01-02",ex:"2026-02-02",ra:"REBALANCE_ADJUST",pe:187.75,ps:270.3,pp:43.97,me:12023.18,peur:5286.59,ca:60115.9,s:"win",y:2026},
  {t:"WDC",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:270.3,ps:270.15,pp:-0.06,me:14936.4,peur:-8.96,ca:74681.98,s:"loss",y:2026},
  {t:"STX",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:432.63,ps:379.24,pp:-12.34,me:14936.4,peur:-1843.15,ca:74681.98,s:"loss",y:2026},
  {t:"MU",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:438.05,ps:412.91,pp:-5.74,me:14936.4,peur:-857.35,ca:74681.98,s:"loss",y:2026},
  {t:"LRCX",d:"2026-02-02",ex:"2026-03-02",ra:"REBALANCE_ADJUST",pe:237.45,ps:230.95,pp:-2.74,me:14936.4,peur:-409.26,ca:74681.98,s:"loss",y:2026},
  {t:"NEM",d:"2026-02-02",ex:"2026-03-02",ra:"DROPPED_FROM_TOP",pe:112.47,ps:128.04,pp:13.84,me:14936.4,peur:2067.2,ca:74681.98,s:"win",y:2026},
  {t:"LRCX",d:"2026-03-02",ex:"2026-04-01",ra:"DROPPED_FROM_TOP",pe:230.95,ps:221.79,pp:-3.97,me:14726.09,peur:-584.63,ca:73630.46,s:"loss",y:2026},
  {t:"MU",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:412.91,ps:368.22,pp:-10.82,me:14726.09,peur:-1593.36,ca:73630.46,s:"loss",y:2026},
  {t:"STX",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:379.24,ps:423.54,pp:11.68,me:14726.09,peur:1720.01,ca:73630.46,s:"win",y:2026},
  {t:"TE",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:6.85,ps:4.48,pp:-34.5,me:14726.09,peur:-2945.22,ca:73630.46,s:"loss",y:2026},
  {t:"WDC",d:"2026-03-02",ex:"2026-04-01",ra:"REBALANCE_ADJUST",pe:270.15,ps:297.95,pp:10.29,me:14726.09,peur:1515.31,ca:73630.46,s:"win",y:2026},
  {t:"WDC",d:"2026-04-01",ex:"2026-05-01",ra:"REBALANCE_ADJUST",pe:297.95,ps:431.84,pp:44.94,me:17935.64,peur:8060.28,ca:71742.58,s:"win",y:2026},
  {t:"MU",d:"2026-04-01",ex:"2026-05-01",ra:"REBALANCE_ADJUST",pe:368.22,ps:542.75,pp:47.4,me:17935.64,peur:8501.5,ca:71742.58,s:"win",y:2026},
  {t:"STX",d:"2026-04-01",ex:"2026-05-01",ra:"REBALANCE_ADJUST",pe:423.54,ps:727.66,pp:71.8,me:17935.64,peur:12877.79,ca:71742.58,s:"win",y:2026},
  {t:"TE",d:"2026-04-01",ex:"2026-05-01",ra:"DROPPED_FROM_TOP",pe:4.48,ps:5.14,pp:14.73,me:17935.64,peur:2641.92,ca:71742.58,s:"win",y:2026},
  {t:"MU",d:"2026-05-01",ex:"2026-06-01",ra:"REBALANCE_ADJUST",pe:542.75,ps:1036.54,pp:90.98,me:25956.02,peur:23614.78,ca:103824.06,s:"win",y:2026},
  {t:"STX",d:"2026-05-01",ex:"2026-06-01",ra:"REBALANCE_ADJUST",pe:727.66,ps:922.18,pp:26.73,me:25956.02,peur:6938.04,ca:103824.06,s:"win",y:2026},
  {t:"FOSL",d:"2026-05-01",ex:"2026-06-01",ra:"DROPPED_FROM_TOP",pe:4.32,ps:4.13,pp:-4.59,me:25956.02,peur:-1191.38,ca:103824.06,s:"loss",y:2026},
  {t:"WDC",d:"2026-05-01",ex:"2026-06-01",ra:"REBALANCE_ADJUST",pe:431.84,ps:546.6,pp:26.58,me:25956.02,peur:6899.11,ca:103824.06,s:"win",y:2026},
];

const years = [...new Set(trades.map(t => t.y))].sort((a, b) => b - a)
function fmt(n: number) { return n > 0 ? '+' + n.toFixed(2) : n.toFixed(2); }
function fmtCapital(n: number) { return n.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }

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
            <div className="text-2xl font-bold text-[#F59E0B]">80.6%</div>
            <div className="text-xs text-[#FEFEFE]/50">CAGR</div>
          </div>
          <div className="bg-[#1E293B]/50 border border-[#334155]/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#3B82F6]">140 085€</div>
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