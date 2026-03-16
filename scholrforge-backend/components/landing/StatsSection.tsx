'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface StatItem {
  value: number
  label: string
  suffix?: string
}

const stats: StatItem[] = [
  { value: 5000, label: 'Active Students', suffix: '+' },
  { value: 2500, label: 'Projects Shared' },
  { value: 45000, label: 'Downloads', suffix: '+' },
  { value: 95, label: 'Satisfaction', suffix: '%' },
]

function StatCounter({ value, label, suffix = '' }: StatItem) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const duration = 2500 // ms
    const increment = value / (duration / 50)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 50)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl sm:text-5xl font-bold text-primary flex items-baseline">
        {displayValue.toLocaleString()}
        <span className="ml-1">{suffix}</span>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground text-center">{label}</p>
    </motion.div>
  )
}

export default function StatsSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Trusted by Students Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a thriving community of academic innovators and showcase your best work
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <StatCounter key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
