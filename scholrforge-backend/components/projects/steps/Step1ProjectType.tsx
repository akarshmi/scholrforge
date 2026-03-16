'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Github, FileZip } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

const options = [
  {
    value: 'github',
    label: 'GitHub Repository',
    description: 'Link to your GitHub repo',
    icon: Github,
  },
  {
    value: 'zip',
    label: 'Upload ZIP File',
    description: 'Upload a ZIP file directly',
    icon: FileZip,
  },
]

export default function Step1ProjectType() {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">How would you like to share?</h2>
        <p className="text-muted-foreground">
          Choose how you'd like to upload your project
        </p>
      </div>

      <FormField
        control={form.control}
        name="projectType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="space-y-3">
                  {options.map(({ value, label, description, icon: Icon }) => (
                    <motion.label
                      key={value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'glass rounded-xl p-6 cursor-pointer flex items-center gap-4 transition-all border-2',
                        field.value === value
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent hover:border-border'
                      )}
                    >
                      <RadioGroupItem value={value} id={value} />
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Icon className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                    </motion.label>
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="glass rounded-xl p-6 bg-secondary/5 border-secondary/20">
        <p className="text-sm text-muted-foreground">
          💡 Tip: GitHub repositories allow automatic README parsing and better collaboration features.
        </p>
      </div>
    </div>
  )
}
