"use client"

import { ParticleHero } from "@/components/ui/particle-hero"
import { PerformanceStats } from "@/components/sections/PerformanceStats"
import { ComparisonTable } from "@/components/sections/ComparisonTable"
import { SimulationTable } from "@/components/sections/SimulationTable"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Reassurance } from "@/components/sections/Reassurance"
import { CTASection } from "@/components/sections/CTASection"
import { ScrollProgress } from "@/components/layout/ScrollProgress"

export default function HomePage() {
  return (
    <main className="relative pt-16">
      <ScrollProgress />
      <ParticleHero
        title="CITADEL"
        subtitle="ALPHA TRADING QUANTITATIF"
        description="Stratégie prouvée sur 5.3 ans | 58.5% CAGR | 325 trades | 109 actions S&P 500 | 3 000€ → 34 955€"
        primaryButton={{
          text: "Accéder à la stratégie",
          onClick: () => window.location.href = '/track-record'
        }}
        secondaryButton={{
          text: "En savoir plus",
          onClick: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
        }}
        interactiveHint="Faites glisser pour explorer"
        particleCount={12}
      />

      <section id="performance-stats">
        <PerformanceStats />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="comparison">
        <ComparisonTable />
      </section>

      <section id="simulation">
        <SimulationTable />
      </section>

      <section id="reassurance">
        <Reassurance />
      </section>

      <section id="cta">
        <CTASection />
      </section>
    </main>
  )
}