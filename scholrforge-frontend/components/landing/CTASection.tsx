'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const FloatingBooks = dynamic(() => import('@/components/three/FloatingBooks'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-9 h-9 rounded-full border-2 border-secondary/60 border-t-secondary animate-spin" />
    </div>
  ),
})

const FEATURES = [
  'No credit card required',
  'Free up to 5 projects',
  'Join 5,000+ students worldwide',
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-primary/8 via-secondary/8 to-primary/8 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/6 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative glass rounded-3xl border border-border/50 overflow-hidden">

          {/* Inner top gradient strip */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── Left: 3D scene ── */}
            <motion.div
              className="relative h-72 sm:h-80 lg:h-auto lg:min-h-[440px] order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-border/40"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Corner accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
              <Suspense fallback={null}>
                <FloatingBooks />
              </Suspense>
            </motion.div>

            {/* ── Right: content ── */}
            <motion.div
              className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:p-12 order-1 lg:order-2"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Eyebrow */}
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary uppercase tracking-widest">
                  <span className="w-4 h-px bg-secondary" />
                  Start for free
                </span>
              </motion.div>

              {/* Heading */}
              <motion.div variants={fadeUp} className="space-y-3">
                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight text-balance">
                  Ready to Showcase{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Your Work?
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
                  Join thousands of students building portfolios and earning recognition. Upload your first project in minutes.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-2.5">
                <Link href="/register"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/explore"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border/70 bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 active:scale-[0.98] transition-all duration-200"
                >
                  Browse Projects
                </Link>
              </motion.div>

              {/* Feature list */}
              <motion.div variants={fadeUp} className="space-y-2.5 pt-2 border-t border-border/40">
                {FEATURES.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom gradient strip */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}