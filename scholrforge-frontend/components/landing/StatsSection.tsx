// ── StatsSection.tsx ──────────────────────────────────────────────────────────
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 5000, label: 'Active Students', suffix: '+', color: 'text-primary' },
  { value: 2500, label: 'Projects Shared', suffix: '+', color: 'text-secondary' },
  { value: 45000, label: 'Total Downloads', suffix: '+', color: 'text-primary' },
  { value: 95, label: 'Satisfaction', suffix: '%', color: 'text-secondary' },
]

function Counter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const steps = 50
    const increment = value / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      // Ease-out: slow down near end
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      current = Math.round(eased * value)
      setDisplay(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div ref={ref} className={`text-3xl sm:text-4xl font-bold tabular-nums ${color}`}>
      {display >= 1000 ? `${(display / 1000).toFixed(display >= 10000 ? 0 : 1)}k` : display}
      {suffix}
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 border-y border-border/40 bg-card/20 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_120%_80%_at_50%_50%,rgba(108,99,255,0.05),transparent)]" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map(({ value, label, suffix, color }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Counter value={value} suffix={suffix} color={color} />
              <p className="text-xs text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}