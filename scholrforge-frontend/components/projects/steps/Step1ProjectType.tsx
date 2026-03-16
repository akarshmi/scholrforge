'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Github, FileArchive, CheckCircle2 } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RadioGroup } from '@/components/ui/radio-group'

const OPTIONS = [
  {
    value: 'github',
    label: 'GitHub Repository',
    description: 'Link your GitHub repo for automatic README parsing and version tracking.',
    icon: Github,
    color: '#6c63ff',
    bg: 'rgba(108,99,255,0.08)',
    border: 'rgba(108,99,255,0.35)',
  },
  {
    value: 'zip',
    label: 'Upload ZIP File',
    description: 'Upload a ZIP archive directly with your source code and assets.',
    icon: FileArchive,
    color: '#00d4aa',
    bg: 'rgba(0,212,170,0.08)',
    border: 'rgba(0,212,170,0.35)',
  },
]

export default function Step1ProjectType() {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">How would you like to share?</h2>
        <p className="text-sm text-muted-foreground">Choose how you'd like to upload your project</p>
      </div>

      <FormField
        control={form.control}
        name="projectType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="space-y-3">
                  {OPTIONS.map(({ value, label, description, icon: Icon, color, bg, border }) => {
                    const selected = field.value === value
                    return (
                      <motion.label
                        key={value}
                        whileTap={{ scale: 0.99 }}
                        className="relative flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden"
                        style={selected
                          ? { background: bg, borderColor: border }
                          : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }
                        }
                      >
                        {/* Accent line */}
                        {selected && (
                          <div className="absolute inset-y-0 left-0 w-0.5 rounded-full"
                            style={{ background: color }} />
                        )}

                        {/* Icon */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all"
                          style={selected
                            ? { background: bg, borderColor: border, color }
                            : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }
                          }
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
                        </div>

                        {/* Check */}
                        <div className="shrink-0">
                          {selected
                            ? <CheckCircle2 className="w-5 h-5" style={{ color }} />
                            : <div className="w-5 h-5 rounded-full border-2 border-border/40" />
                          }
                        </div>

                        {/* Hidden radio */}
                        <input type="radio" value={value} checked={selected} onChange={() => field.onChange(value)} className="sr-only" />
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

      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border"
        style={{ background: 'rgba(108,99,255,0.06)', borderColor: 'rgba(108,99,255,0.2)' }}>
        <span className="text-base mt-0.5">💡</span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          GitHub repositories allow automatic README parsing and better collaboration features.
        </p>
      </div>
    </div>
  )
}