'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutGrid, Sparkles } from 'lucide-react'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary/60 border-t-primary animate-spin" />
        <p className="text-xs text-muted-foreground/60 animate-pulse">Loading scene...</p>
      </div>
    </div>
  ),
})

const FEATURES = [
  'Discover student projects',
  'Share your work',
  'Collaborate & grow',
]

interface AuthShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left: 3D panel ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-1/2 relative overflow-hidden border-r border-border/30">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(108,99,255,0.12),transparent_65%)]" />

        {/* 3D scene */}
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Bottom overlay — branding + feature pills */}
        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-background/95 via-background/60 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                The platform for student builders
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <span
                  key={f}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-muted-foreground backdrop-blur-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top-left logo on the panel */}
        <div className="absolute top-7 left-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <LayoutGrid className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              scholrforge
            </span>
          </Link>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile logo */}
        <div className="lg:hidden px-5 pt-6 pb-0">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              scholrforge
            </span>
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
          <motion.div
            className="w-full max-w-sm space-y-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form content */}
            <div className="glass rounded-2xl p-5 sm:p-6 border border-border/50">
              {children}
            </div>

            {/* Footer */}
            <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed px-2">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="hover:text-muted-foreground transition-colors underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="hover:text-muted-foreground transition-colors underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}