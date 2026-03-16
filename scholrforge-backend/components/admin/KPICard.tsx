'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  label: string
  value: number
  change: string
  icon: React.ComponentType<{ className: string }>
}

export default function KPICard({ label, value, change, icon: Icon }: KPICardProps) {
  const isPositive = change.startsWith('+')

  return (
    <motion.div
      className="glass rounded-xl p-6 space-y-2"
      whileHover={{ translateY: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>

      <p className="text-3xl font-bold">{value.toLocaleString()}</p>

      <div className="flex items-center gap-1 text-sm">
        {isPositive ? (
          <>
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-semibold">{change}</span>
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-red-500 font-semibold">{change}</span>
          </>
        )}
        <span className="text-muted-foreground">from last week</span>
      </div>
    </motion.div>
  )
}
