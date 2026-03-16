'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { TECH_STACKS } from '@/lib/constants'
import { FormMessage } from '@/components/ui/form'
import { Search, CheckCircle2, Cpu } from 'lucide-react'

const allTechs = [
  ...TECH_STACKS.LANGUAGES,
  ...TECH_STACKS.FRAMEWORKS,
  ...TECH_STACKS.DATABASES,
]

export default function Step3TechStack() {
  const form = useFormContext()
  const techStack: string[] = form.watch('techStack')
  const [search, setSearch] = useState('')

  const filtered = allTechs.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (name: string) => {
    form.setValue('techStack',
      techStack.includes(name)
        ? techStack.filter(t => t !== name)
        : [...techStack, name]
    )
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Technology Stack</h2>
        <p className="text-sm text-muted-foreground">Select all technologies used in your project</p>
      </div>

      {/* Selected pills */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-border/40 bg-muted/10">
          {techStack.map(t => (
            <button key={t} type="button" onClick={() => toggle(t)}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-all active:scale-95"
              style={{ background: 'rgba(108,99,255,0.15)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.3)' }}>
              {t}
              <span className="opacity-60 hover:opacity-100">×</span>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search technologies..."
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Tech list */}
      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {filtered.map(tech => {
          const selected = techStack.includes(tech.name)
          return (
            <button
              key={tech.name}
              type="button"
              onClick={() => toggle(tech.name)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-150 text-left"
              style={selected
                ? { background: 'rgba(108,99,255,0.08)', borderColor: 'rgba(108,99,255,0.3)' }
                : { background: 'transparent', borderColor: 'rgba(255,255,255,0.06)' }
              }
            >
              <Cpu className="w-3.5 h-3.5 shrink-0"
                style={{ color: selected ? '#6c63ff' : 'rgba(255,255,255,0.25)' }} />
              <span className="text-sm flex-1"
                style={{ color: selected ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                {tech.name}
              </span>
              {selected && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#6c63ff' }} />}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{techStack.length} selected</span>
        {techStack.length > 0 && (
          <button type="button" onClick={() => form.setValue('techStack', [])}
            className="text-destructive/70 hover:text-destructive transition-colors">
            Clear all
          </button>
        )}
      </div>

      {form.formState.errors.techStack && (
        <FormMessage className="text-xs">{String(form.formState.errors.techStack.message)}</FormMessage>
      )}
    </div>
  )
}