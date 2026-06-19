import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Citadel Alpha | Quantitative Trading Strategy",
  description: "10-year proven quantitative trading strategy with 26.37% CAGR, -14.5% max drawdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0F172A] text-white">
        {children}
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
