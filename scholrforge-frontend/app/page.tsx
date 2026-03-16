'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'

import Navbar from '@/components/landing/Navbar'
import FeaturesSection from '@/components/landing/FeaturesSection'
import TrendingSection from '@/components/landing/TrendingSection'
import StatsSection from '@/components/landing/StatsSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-9 h-9 rounded-full border-2 border-primary/60 border-t-primary animate-spin" />
    </div>
  ),
})

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'CS Final Year', text: 'Got my internship because a recruiter found my project on scholrforge. Incredible platform.' },
  { name: 'Ahmed K.', role: 'Software Eng.', text: 'Best place to discover what other students are building. Saved me weeks of research.' },
  { name: 'Liu W.', role: 'ML Student', text: 'The community feedback on my ML project helped me improve it significantly before submission.' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
  viewport: { once: true },
})

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen pt-14 flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(108,99,255,0.12),transparent)]" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Text */}
            <motion.div className="space-y-6 text-center lg:text-left" {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/20 text-xs font-medium text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Now in public beta · 5,000+ students
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                Showcase Your{' '}
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Academic
                </span>{' '}
                Excellence
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                Discover, share, and collaborate on student projects. Build your portfolio, earn recognition, and connect with peers worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/explore"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 active:scale-[0.98] transition-all duration-200">
                  Browse Projects
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['JS', 'AK', 'LW', 'PR'].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 border-2 border-background flex items-center justify-center text-[9px] font-bold text-white">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-xs text-muted-foreground">Loved by 5k+ students</span>
              </div>
            </motion.div>

            {/* 3D scene */}
            <motion.div
              className="relative h-72 sm:h-96 lg:h-[480px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Suspense fallback={null}>
                  <HeroScene />
                </Suspense>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <StatsSection />

      {/* ── Features ── */}
      <FeaturesSection />

      {/* ── Trending ── */}
      <TrendingSection />

      {/* ── Testimonials ── */}
      <section id="community" className="py-20 sm:py-24 px-4 sm:px-6 border-y border-border/40 overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'rgba(17,17,24,0.5)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-3xl rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.06) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-5xl mx-auto space-y-12">

          {/* Header */}
          <motion.div className="text-center space-y-3" {...fadeUp()}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#00d4aa' }}>
              <span className="w-6 h-px" style={{ background: 'rgba(0,212,170,0.6)' }} />
              Community
              <span className="w-6 h-px" style={{ background: 'rgba(0,212,170,0.6)' }} />
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Trusted by students</h2>
            <p className="text-sm text-muted-foreground">Hear from the builders using scholrforge every day.</p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map(({ name, role, text }, i) => (
              <motion.div
                key={name}
                className="relative glass rounded-2xl p-5 flex flex-col gap-4 overflow-hidden group hover:-translate-y-0.5 transition-all duration-300"
                {...fadeUp(i * 0.1)}
              >
                {/* Top accent line — alternates primary/secondary */}
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background: i % 2 === 0
                      ? 'linear-gradient(to right, rgba(108,99,255,0.8), transparent)'
                      : 'linear-gradient(to right, rgba(0,212,170,0.8), transparent)',
                  }}
                />

                {/* Corner glow */}
                <div
                  className="absolute top-0 left-0 w-28 h-28 pointer-events-none"
                  style={{
                    background: i % 2 === 0
                      ? 'radial-gradient(circle at top left, rgba(108,99,255,0.08), transparent 70%)'
                      : 'radial-gradient(circle at top left, rgba(0,212,170,0.08), transparent 70%)',
                  }}
                />

                {/* Hover border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: i % 2 === 0
                      ? 'inset 0 0 0 1px rgba(108,99,255,0.25)'
                      : 'inset 0 0 0 1px rgba(0,212,170,0.25)',
                  }}
                />

                {/* Stars */}
                <div className="relative flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="relative text-sm text-muted-foreground leading-relaxed flex-1">
                  "{text}"
                </p>

                {/* Author */}
                <div className="relative flex items-center gap-2.5 pt-2 border-t border-border/40">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{
                      background: i % 2 === 0
                        ? 'linear-gradient(135deg, rgba(108,99,255,0.8), rgba(0,212,170,0.8))'
                        : 'linear-gradient(135deg, rgba(0,212,170,0.8), rgba(108,99,255,0.8))',
                    }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{name}</p>
                    <p className="text-[11px] text-muted-foreground">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection />

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}