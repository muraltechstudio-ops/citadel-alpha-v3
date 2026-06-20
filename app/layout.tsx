import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Citadel Alpha | Stratégie de Trading Quantitative",
  description: "Stratégie de trading quantitative prouvée sur 5.3 ans avec 58.5% CAGR et drawdown limité à -20%",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0F172A] text-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <DevelopmentBadge />
      </body>
    </html>
  );
}

function DevelopmentBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
        Site en cours de développement
      </div>
    </div>
  );
}
