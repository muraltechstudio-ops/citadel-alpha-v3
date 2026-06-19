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
  const scrollToNext = () => {
    const nextSection = document.getElementById('performance-stats')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="relative">
      {/* Hero Section with Particle Background */}
      <ParticleHero
        title="CITADEL"
        subtitle="ALPHA QUANTITATIVE TRADING"
        description="10-year proven strategy | 26.37% CAGR | -14.5% Max Drawdown | 192 trades"
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

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Performance Stats Section */}
      <section id="performance-stats" className="relative py-32 bg-[#0F172A]">
        <PerformanceStats />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 bg-[#0F172A]">
        <HowItWorks />
      </section>

      {/* Performance Comparison Section */}
      <section id="comparison" className="relative py-32 bg-[#0F172A]">
        <ComparisonTable />
      </section>

      {/* Simulation Table Section */}
      <section id="simulation" className="relative py-32 bg-[#0F172A]">
        <SimulationTable />
      </section>

      {/* Reassurance Section */}
      <section id="reassurance" className="relative py-32 bg-[#0F172A]">
        <Reassurance />
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative py-32 bg-[#0F172A]">
        <CTASection />
      </section>
    </main>
  )
}