"use client"

import { motion, useScroll } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[#1E293B]/50 backdrop-blur-sm z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B]"
        style={{ scaleX: scrollYProgress, transformOrigin: "0% 0%" }}
      />
    </div>
  )
}