'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, Award, Zap, Search, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Rich Project Showcase',
    desc: 'Detailed docs, media, and tech stack for every project.',
    color: '#6c63ff',
    bg: 'rgba(108,99,255,0.1)',
    border: 'rgba(108,99,255,0.2)',
    glow: 'rgba(108,99,255,0.12)',
  },
  {
    icon: Users,
    title: 'Collaboration Hub',
    desc: 'Connect with peers, share feedback, and form project teams.',
    color: '#00d4aa',
    bg: 'rgba(0,212,170,0.1)',
    border: 'rgba(0,212,170,0.2)',
    glow: 'rgba(0,212,170,0.10)',
  },
  {
    icon: Award,
    title: 'Earn Achievements',
    desc: 'Unlock badges and recognition as you contribute and grow.',
    color: '#ffd700',
    bg: 'rgba(255,215,0,0.1)',
    border: 'rgba(255,215,0,0.2)',
    glow: 'rgba(255,215,0,0.10)',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: '3D previews and instant search across thousands of projects.',
    color: '#00e0ff',
    bg: 'rgba(0,224,255,0.1)',
    border: 'rgba(0,224,255,0.2)',
    glow: 'rgba(0,224,255,0.10)',
  },
  {
    icon: Search,
    title: 'Powerful Discovery',
    desc: 'Filter by stack, difficulty, semester, and trending status.',
    color: '#6c63ff',
    bg: 'rgba(108,99,255,0.1)',
    border: 'rgba(108,99,255,0.2)',
    glow: 'rgba(108,99,255,0.12)',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Enterprise-grade security with full privacy controls.',
    color: '#00d4aa',
    bg: 'rgba(0,212,170,0.1)',
    border: 'rgba(0,212,170,0.2)',
    glow: 'rgba(0,212,170,0.10)',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 blur-3xl rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-3xl rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-6xl mx-auto space-y-14">

        {/* Header */}
        <motion.div
          className="text-center space-y-3 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#6c63ff' }}>
            <span className="w-6 h-px" style={{ background: 'rgba(108,99,255,0.6)' }} />
            Features
            <span className="w-6 h-px" style={{ background: 'rgba(108,99,255,0.6)' }} />
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to succeed
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Powerful tools built specifically for academic excellence — from first-year experiments to capstone projects.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border, glow }) => (
            <motion.div
              key={title}
              variants={item}
              className="relative glass rounded-2xl p-5 flex flex-col gap-3.5 overflow-hidden group transition-all duration-300 hover:-translate-y-0.5"
              style={{ '--hover-border': border } as React.CSSProperties}
            >
              {/* Top accent line */}
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
              />

              {/* Corner glow */}
              <div
                className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
                style={{ background: `radial-gradient(circle at top left, ${glow}, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="relative w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                style={{ background: bg, borderColor: border }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color }} />
              </div>

              {/* Text */}
              <div className="relative space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>

              {/* Hover border overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${border}` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}