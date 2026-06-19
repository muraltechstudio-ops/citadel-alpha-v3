"use client"

import { useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return { ref, isInView }
}

export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  return { scaleX }
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return mousePosition
}

export function useParallax(speed: number = 0.5) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1], [0, speed * 100])
  return { y }
}

export function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * target))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [target, duration, isInView])

  return { count, ref }
}

export function useAnimatedCounter() {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  const animateNumber = (element: HTMLElement, target: number, duration: number = 2000) => {
    const start = 0
    const end = target
    const startTime = performance.now()

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentValue = Math.floor(progress * (end - start) + start)
      element.textContent = currentValue.toLocaleString()

      if (progress < 1) {
        requestAnimationFrame(updateNumber)
      }
    }

    requestAnimationFrame(updateNumber)
  }

  useEffect(() => {
    if (isInView && ref.current) {
      animateNumber(ref.current as HTMLElement, 2.5)
    }
  }, [isInView])

  return { ref }
}