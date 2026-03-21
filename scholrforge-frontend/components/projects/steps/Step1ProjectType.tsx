'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Globe, Smartphone, Brain, Database, Monitor, Cpu, Wifi, CheckCircle2 } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RadioGroup } from '@/components/ui/radio-group'

// ── Matches backend: ProjectType enum ─────────────────────────────────────────
const OPTIONS = [
  {
    value: 'WEB',
    label: 'Web',
    description: 'Web applications, websites, and browser-based tools.',
    icon: Globe,
    color: '#6c63ff',
    bg: 'rgba(108,99,255,0.08)',
    border: 'rgba(108,99,255,0.35)',
  },
  {
    value: 'MOBILE',
    label: 'Mobile',
    description: 'iOS, Android, or cross-platform mobile applications.',
    icon: Smartphone,
    color: '#00d4aa',
    bg: 'rgba(0,212,170,0.08)',
    border: 'rgba(0,212,170,0.35)',
  },
  {
    value: 'AI',
    label: 'AI',
    description: 'Artificial intelligence, chatbots, and smart systems.',
    icon: Brain,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
  },
  {
    value: 'MACHINE_LEARNING',
    label: 'Machine Learning',
    description: 'ML models, training pipelines, and data science projects.',
    icon: Database,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.35)',
  },
  {
    value: 'DESKTOP',
    label: 'Desktop',
    description: 'Native desktop applications for Windows, macOS, or Linux.',
    icon: Monitor,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.35)',
  },
  {
    value: 'EMBEDDED',
    label: 'Embedded',
    description: 'Firmware, microcontrollers, and embedded systems.',
    icon: Cpu,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.35)',
  },
  {
    value: 'IOT',
    label: 'IoT',
    description: 'Internet of Things, connected devices, and smart hardware.',
    icon: Wifi,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.35)',
  },
]

export default function Step1ProjectType() {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">What type of project is this?</h2>
        <p className="text-sm text-muted-foreground">Select the category that best describes your project</p>
      </div>

      <FormField
        control={form.control}
        name="projectType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="space-y-2.5">
                  {OPTIONS.map(({ value, label, description, icon: Icon, color, bg, border }) => {
                    const selected = field.value === value
                    return (
                      <motion.label
                        key={value}
                        whileTap={{ scale: 0.99 }}
                        className="relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden"
                        style={selected
                          ? { background: bg, borderColor: border }
                          : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }
                        }
                      >
                        {selected && (
                          <div className="absolute inset-y-0 left-0 w-0.5 rounded-full" style={{ background: color }} />
                        )}

                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-all"
                          style={selected
                            ? { background: bg, borderColor: border, color }
                            : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }
                          }
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
                        </div>

                        <div className="shrink-0">
                          {selected
                            ? <CheckCircle2 className="w-5 h-5" style={{ color }} />
                            : <div className="w-5 h-5 rounded-full border-2 border-border/40" />
                          }
                        </div>

                        <input
                          type="radio"
                          value={value}
                          checked={selected}
                          onChange={() => field.onChange(value)}
                          className="sr-only"
                        />
                      </motion.label>
                    )
                  })}
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}