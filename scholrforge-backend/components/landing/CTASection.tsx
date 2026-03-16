'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FloatingBooks = dynamic(() => import('@/components/three/FloatingBooks'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-secondary border-t-transparent animate-spin mx-auto" />
      </div>
    </div>
  ),
})

export default function CTASection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: 3D Animation */}
          <motion.div
            className="relative h-80 lg:h-96 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={null}>
              <FloatingBooks />
            </Suspense>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            className="flex flex-col justify-center space-y-6 order-1 lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
                Ready to Showcase Your Work?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of students building portfolios and earning recognition for their academic excellence. Start uploading your projects today and grow your network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start for Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Projects
                </Button>
              </Link>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-6 border-t border-border">
              {[
                'No credit card required',
                'Free up to 5 projects',
                'Join 5,000+ students worldwide',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
