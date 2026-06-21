"use client"

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { TrendingUp, Activity, DollarSign, BarChart3, Clock, Shield } from 'lucide-react';

interface TradingMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

interface ParticleHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    onClick: () => void;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  interactiveHint?: string;
  className?: string;
  particleCount?: number;
  children?: ReactNode;
}

export const ParticleHero: React.FC<ParticleHeroProps> = ({
  title = "CITADEL",
  subtitle = "ALPHA QUANTITATIVE TRADING",
  description = "10-year proven strategy | 26.37% CAGR | -14.5% Max Drawdown | 192 trades",
  primaryButton,
  secondaryButton,
  interactiveHint = "Move to Create",
  className = "",
  particleCount = 15,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [staticCursor, setStaticCursor] = useState({ x: 0, y: 0 });
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isStaticAnimation, setIsStaticAnimation] = useState(false);
  const startTimeRef = useRef(Date.now());
  const lastMouseMoveRef = useRef(Date.now());

  const rows = particleCount;
  const totalParticles = rows * rows;

  // Trading metrics data - updated with Citadel Alpha actuals
  const tradingMetrics: TradingMetric[] = [
    {
      label: "CAGR",
      value: "26.37%",
      change: "+11.36%",
      icon: BarChart3,
      color: "#F59E0B"
    },
    {
      label: "Max DD",
      value: "-14.5%",
      change: "-0.8%",
      icon: Activity,
      color: "#EF4444"
    },
    {
      label: "Win Rate",
      value: "53.1%",
      change: "+0.1%",
      icon: TrendingUp,
      color: "#10B981"
    },
    {
      label: "Profit Factor",
      value: "2.57",
      change: "+0.09",
      icon: DollarSign,
      color: "#3B82F6"
    }
  ];

  // Initialize particles with gold/dark blue theme
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';
    particlesRef.current = [];

    for (let i = 0; i < totalParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle absolute rounded-full will-change-transform';

      // Calculate grid position
      const row = Math.floor(i / rows);
      const col = i % rows;
      const centerRow = Math.floor(rows / 2);
      const centerCol = Math.floor(rows / 2);

      // Distance from center for stagger effects
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );

      // Staggered scale (larger in center)
      const scale = Math.max(0.1, 1.2 - distanceFromCenter * 0.12);

      // Staggered opacity (more opaque in center)
      const opacity = Math.max(0.05, 1 - distanceFromCenter * 0.1);

      // Gold and dark blue color scheme
      const hue = distanceFromCenter > rows / 2
        ? 45 + (distanceFromCenter - rows / 2) * 2  // Gold range
        : 225 + distanceFromCenter * 1.5;            // Dark blue range

      const lightness = Math.max(15, 75 - distanceFromCenter * 6);

      // Glow intensity
      const glowSize = Math.max(0.5, 6 - distanceFromCenter * 0.5);

      particle.style.cssText = `
        width: 0.4rem;
        height: 0.4rem;
        left: ${col * 1.8}rem;
        top: ${row * 1.8}rem;
        transform: scale(${scale});
        opacity: ${opacity};
        background: hsl(${hue}, 85%, ${lightness}%);
        box-shadow: 0 0 ${glowSize * 0.2}rem 0 hsl(${hue}, 85%, 60%);
        mix-blend-mode: screen;
        z-index: ${Math.round(totalParticles - distanceFromCenter * 5)};
        transition: transform 0.05s linear;
      `;

      container.appendChild(particle);
      particlesRef.current.push(particle);
    }
  }, [rows, totalParticles]);

  // Continuous animation
  useEffect(() => {
    const animate = () => {
      const currentTime = (Date.now() - startTimeRef.current) * 0.001;

      if (isAutoMode) {
        const x = Math.sin(currentTime * 0.3) * 200 + Math.sin(currentTime * 0.17) * 100;
        const y = Math.cos(currentTime * 0.2) * 150 + Math.cos(currentTime * 0.23) * 80;
        setCursor({ x, y });
      } else if (isStaticAnimation) {
        const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;

        if (timeSinceLastMove > 200) {
          const animationStrength = Math.min((timeSinceLastMove - 200) / 1000, 1);
          const subtleX = Math.sin(currentTime * 1.5) * 20 * animationStrength;
          const subtleY = Math.cos(currentTime * 1.2) * 16 * animationStrength;

          setCursor({
            x: staticCursor.x + subtleX,
            y: staticCursor.y + subtleY
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoMode, isStaticAnimation, staticCursor]);

  // Update particle positions
  useEffect(() => {
    particlesRef.current.forEach((particle, i) => {
      const row = Math.floor(i / rows);
      const col = i % rows;
      const centerRow = Math.floor(rows / 2);
      const centerCol = Math.floor(rows / 2);
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );

      const delay = distanceFromCenter * 8;
      const originalScale = Math.max(0.1, 1.2 - distanceFromCenter * 0.12);
      const dampening = Math.max(0.3, 1 - distanceFromCenter * 0.08);

      setTimeout(() => {
        const moveX = cursor.x * dampening;
        const moveY = cursor.y * dampening;

        particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${originalScale})`;
        particle.style.transition = `transform ${120 + distanceFromCenter * 20}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      }, delay);
    });
  }, [cursor, rows]);

  // Mouse/touch movement handler
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const event = 'touches' in e ? e.touches[0] : e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const newCursor = {
      x: (event.clientX - centerX) * 0.8,
      y: (event.clientY - centerY) * 0.8
    };

    setCursor(newCursor);
    setStaticCursor(newCursor);
    setIsAutoMode(false);
    setIsStaticAnimation(false);
    lastMouseMoveRef.current = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsStaticAnimation(true);
    }, 500);

    setTimeout(() => {
      if (Date.now() - lastMouseMoveRef.current >= 4000) {
        setIsAutoMode(true);
        setIsStaticAnimation(false);
        startTimeRef.current = Date.now();
      }
    }, 4000);
  };

  return (
    <section
      className={`relative w-full min-h-screen bg-[#0F172A] overflow-hidden ${className}`}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
    >
      {/* Particle Animation Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: `${rows * 1.8}rem`,
            height: `${rows * 1.8}rem`
          }}
        />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-24">
        {children ? (
          children
        ) : (
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Title */}
            <div className="mb-16">
              <h1 className="text-8xl md:text-[10rem] lg:text-[14rem] xl:text-[16rem] font-black tracking-tighter leading-[0.8] mb-8">
                <span className="bg-gradient-to-b from-[#F59E0B] via-[#FCD34D] to-[#FDE047] bg-clip-text text-transparent drop-shadow-2xl">
                  {title}
                </span>
              </h1>

              {/* Subtitle */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-thin text-[#FCD34D]/90 tracking-[0.2em] uppercase">
                  {subtitle}
                </h2>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent mx-auto"></div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="mb-20">
                <p className="text-lg md:text-xl lg:text-2xl text-[#FEFEFE]/60 font-light max-w-3xl mx-auto leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
              {tradingMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-[#1E293B]/50 backdrop-blur-sm border border-[#334155]/50 rounded-xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-3">
                    <metric.icon
                      size={24}
                      style={{ color: metric.color }}
                      className="drop-shadow-lg"
                    />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-[#94A3B8] font-medium mb-2">{metric.label}</div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: metric.change.startsWith('+') ? '#10B981' : '#EF4444' }}
                  >
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {primaryButton && (
                  <button
                    onClick={primaryButton.onClick}
                    className="group relative px-12 py-6 bg-transparent border-2 border-[#F59E0B]/30 hover:border-[#F59E0B] text-[#F59E0B] hover:text-white font-medium text-lg tracking-wider uppercase transition-all duration-500 overflow-hidden"
                  >
                    <span className="relative z-10">{primaryButton.text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/0 via-[#F59E0B]/20 to-[#F59E0B]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                )}

                {secondaryButton && (
                  <button
                    onClick={secondaryButton.onClick}
                    className="px-8 py-4 border-2 border-[#FEFEFE]/20 hover:border-[#F59E0B] text-[#FEFEFE] hover:text-[#F59E0B] font-semibold rounded-full transition-all duration-300 backdrop-blur-sm"
                  >
                    {secondaryButton.text}
                  </button>
                )}
              </div>

              {/* Interactive hint */}
              {interactiveHint && (
                <div className="flex items-center justify-center gap-6 text-[#F59E0B]/40 text-sm uppercase tracking-[0.3em]">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#F59E0B]/30"></div>
                  <span className="animate-pulse">{interactiveHint}</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#F59E0B]/30"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] bg-gradient-radial from-[#F59E0B]/5 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default ParticleHero;