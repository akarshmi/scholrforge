'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ── Matches backend: DifficultyLevel enum ─────────────────────────────────────
const DIFFICULTY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', color: '#00d4aa' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: '#facc15' },
  { value: 'ADVANCED', label: 'Advanced', color: '#ff4d6d' },
]

// Semesters are a UI concern only — not a backend enum, adjust as needed
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"

export default function Step2BasicInfo() {
  const form = useFormContext()

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Basic Information</h2>
        <p className="text-sm text-muted-foreground">Tell us about your project</p>
      </div>

      {/* projectTitle — matches backend @NotBlank String projectTitle */}
      <FormField control={form.control} name="projectTitle" render={({ field, fieldState }) => (
        <FormItem>
          <label className={labelCls}>Project Title</label>
          <FormControl>
            <input
              {...field}
              placeholder="e.g., AI Chatbot Platform"
              className={`${inputCls} ${fieldState.error ? 'border-destructive/60 bg-destructive/5' : ''}`}
            />
          </FormControl>
          <div className="flex items-center justify-between mt-1">
            <FormMessage className="text-xs" />
            <span className="text-[11px] text-muted-foreground/60 ml-auto">
              {field.value?.length ?? 0}/150
            </span>
          </div>
        </FormItem>
      )} />

      {/* description — matches backend @NotBlank String description */}
      <FormField control={form.control} name="description" render={({ field, fieldState }) => (
        <FormItem>
          <label className={labelCls}>Description</label>
          <FormControl>
            <textarea
              {...field}
              rows={4}
              placeholder="Describe your project in detail..."
              className={`${inputCls} resize-none leading-relaxed ${fieldState.error ? 'border-destructive/60 bg-destructive/5' : ''}`}
            />
          </FormControl>
          <div className="flex items-center justify-between mt-1">
            <FormMessage className="text-xs" />
            <span className="text-[11px] text-muted-foreground/60 ml-auto">
              {field.value?.length ?? 0}/2000
            </span>
          </div>
        </FormItem>
      )} />

      {/* difficultyLevel + semester (UI-only) */}
      <div className="grid grid-cols-2 gap-3">

        {/* difficultyLevel — matches backend DifficultyLevel enum: BEGINNER | INTERMEDIATE | ADVANCED */}
        <FormField control={form.control} name="difficultyLevel" render={({ field }) => (
          <FormItem>
            <label className={labelCls}>Difficulty</label>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/20 text-sm">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DIFFICULTY_LEVELS.map(({ value, label, color }) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {/* semester — UI-only helper field, not in backend DTO */}
        <FormField control={form.control} name="semester" render={({ field }) => (
          <FormItem>
            <label className={labelCls}>Semester <span className="normal-case font-normal opacity-50">(optional)</span></label>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/20 text-sm">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SEMESTERS.map(sem => (
                  <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )} />
      </div>
    </div>
  )
}