'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { X, Tag } from 'lucide-react'

const SUGGESTED = ['AI', 'Machine Learning', 'Web App', 'Mobile', 'Backend', 'Frontend', 'API', 'Database', 'Security', 'NLP']

export default function Step4Tags() {
  const form = useFormContext()
  const tags: string[] = form.watch('tags')
  const [input, setInput] = useState('')

  const add = (tag: string) => {
    const t = tag.trim().toLowerCase()
    if (t && tags.length < 5 && !tags.includes(t)) {
      form.setValue('tags', [...tags, t])
      setInput('')
    }
  }

  const remove = (t: string) => form.setValue('tags', tags.filter(x => x !== t))

  const remaining = 5 - tags.length

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Add Tags</h2>
        <p className="text-sm text-muted-foreground">Add up to 5 tags to help people discover your project</p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input) } }}
            placeholder="Type a tag and press Enter..."
            disabled={tags.length >= 5}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => add(input)}
          disabled={!input.trim() || tags.length >= 5}
          className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          Add
        </button>
      </div>

      {/* Active tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <span key={t}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium"
              style={{ background: 'rgba(108,99,255,0.12)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.3)' }}>
              #{t}
              <button type="button" onClick={() => remove(t)}
                className="opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(tags.length / 5) * 100}%`,
              background: tags.length >= 5 ? '#00d4aa' : '#6c63ff',
            }} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {tags.length}/5 tags
        </span>
      </div>

      {/* Suggestions */}
      {remaining > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED.filter(s => !tags.includes(s.toLowerCase())).map(s => (
              <button key={s} type="button" onClick={() => add(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}