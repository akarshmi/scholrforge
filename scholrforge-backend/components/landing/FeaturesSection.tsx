'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, Award, Zap, Search, Shield } from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Rich Project Showcase',
    description: 'Display your academic projects with detailed documentation, media, and technology stack details.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Collaboration Hub',
    description: 'Connect with peers, share feedback, and build teams to tackle challenging academic projects.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Earn Achievements',
    description: 'Unlock badges and recognition as you contribute and help the community grow.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Blazing fast performance with 3D previews and instant search across thousands of projects.',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Powerful Discovery',
    description: 'Filter by technology stack, difficulty level, semester, and trending projects.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and privacy controls.',
  },
]

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
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
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and features designed specifically for academic excellence
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass p-6 rounded-xl hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors mb-4">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
