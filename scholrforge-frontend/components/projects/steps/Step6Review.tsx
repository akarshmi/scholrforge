'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, Github, Scale, Cpu, Tag, Globe, Smartphone, Brain, Database, Monitor, Wifi } from 'lucide-react'

// ── Display helpers ────────────────────────────────────────────────────────────

const difficultyConfig: Record<string, { bg: string; text: string; border: string }> = {
  BEGINNER:     { bg: 'rgba(0,212,170,0.1)',  text: '#00d4aa', border: 'rgba(0,212,170,0.25)' },
  INTERMEDIATE: { bg: 'rgba(234,179,8,0.1)',  text: '#facc15', border: 'rgba(234,179,8,0.25)' },
  ADVANCED:     { bg: 'rgba(255,77,109,0.1)', text: '#ff4d6d', border: 'rgba(255,77,109,0.25)' },
}

const projectTypeIcons: Record<string, React.ReactNode> = {
  WEB:             <Globe className="w-3 h-3" />,
  MOBILE:          <Smartphone className="w-3 h-3" />,
  AI:              <Brain className="w-3 h-3" />,
  MACHINE_LEARNING:<Database className="w-3 h-3" />,
  DESKTOP:         <Monitor className="w-3 h-3" />,
  EMBEDDED:        <Cpu className="w-3 h-3" />,
  IOT:             <Wifi className="w-3 h-3" />,
}

const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
const inputCls = "w-full h-10 px-3.5 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"

export default function Step6Review() {
  const form = useFormContext()
  const v = form.getValues()

  const diff = difficultyConfig[v.difficultyLevel] ?? difficultyConfig.BEGINNER
  const mediaFiles: File[] = v.mediaFiles ?? []

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">Verify your information before publishing</p>
      </div>

      {/* Summary card */}
      <div className="glass rounded-xl overflow-hidden">
        <div
          className="h-px"
          style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.7), rgba(0,212,170,0.7), transparent)' }}
        />

        <div className="divide-y divide-border/30">

          {/* Title + meta */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground">
              {v.projectTitle || <span className="text-muted-foreground/40">No title</span>}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{v.description}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {/* difficultyLevel */}
              {v.difficultyLevel && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border" style={diff}>
                  {v.difficultyLevel.charAt(0) + v.difficultyLevel.slice(1).toLowerCase()}
                </span>
              )}
              {/* projectType */}
              {v.projectType && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground">
                  {projectTypeIcons[v.projectType]}
                  {v.projectType.replace('_', ' ')}
                </span>
              )}
              {v.semester && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground">
                  {v.semester} Semester
                </span>
              )}
            </div>
          </div>

          {/* Tech stack — from newTechStackNames */}
          {v.newTechStackNames?.length > 0 && (
            <div className="p-4 space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3 h-3" /> Technologies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {v.newTechStackNames.map((t: string) => (
                  <span key={t} className="text-xs px-2.5 py-0.5 rounded-md bg-muted/40 border border-border/40 text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags — from newTagNames */}
          {v.newTagNames?.length > 0 && (
            <div className="p-4 space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {v.newTagNames.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(108,99,255,0.1)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.25)' }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media count */}
          {mediaFiles.length > 0 && (
            <div className="p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Media · {mediaFiles.length} file{mediaFiles.length > 1 ? 's' : ''} attached
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Final fields */}
      <div className="space-y-4">

        {/* githubUrl — matches backend @Pattern String githubUrl */}
        <FormField control={form.control} name="githubUrl" render={({ field, fieldState }) => (
          <FormItem>
            <label className={labelCls}>
              <span className="flex items-center gap-1.5">
                <Github className="w-3 h-3" /> GitHub URL <span className="normal-case font-normal opacity-50">(optional)</span>
              </span>
            </label>
            <FormControl>
              <input
                {...field}
                placeholder="https://github.com/username/project"
                className={`${inputCls} ${fieldState.error ? 'border-destructive/60' : ''}`}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {/* downloadUrl — matches backend @Pattern String downloadUrl */}
        <FormField control={form.control} name="downloadUrl" render={({ field, fieldState }) => (
          <FormItem>
            <label className={labelCls}>
              Download URL <span className="normal-case font-normal opacity-50">(optional, if not uploading a file)</span>
            </label>
            <FormControl>
              <input
                {...field}
                placeholder="https://example.com/project.zip"
                className={`${inputCls} ${fieldState.error ? 'border-destructive/60' : ''}`}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {/* demoVideoUrl — matches backend @Pattern String demoVideoUrl */}
        <FormField control={form.control} name="demoVideoUrl" render={({ field, fieldState }) => (
          <FormItem>
            <label className={labelCls}>
              Demo Video URL <span className="normal-case font-normal opacity-50">(optional)</span>
            </label>
            <FormControl>
              <input
                {...field}
                placeholder="https://youtube.com/watch?v=..."
                className={`${inputCls} ${fieldState.error ? 'border-destructive/60' : ''}`}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {/* license — UI-only, not in backend DTO, handle in service if needed */}
        <FormField control={form.control} name="license" render={({ field }) => (
          <FormItem>
            <label className={labelCls}>
              <span className="flex items-center gap-1.5"><Scale className="w-3 h-3" /> License</span>
            </label>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/20 text-sm">
                  <SelectValue placeholder="Select a license..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'Unlicense'].map(l => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )} />
      </div>

      {/* Publish note */}
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl border"
        style={{ background: 'rgba(0,212,170,0.06)', borderColor: 'rgba(0,212,170,0.2)' }}
      >
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#00d4aa' }} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your project will be submitted for review and visible to the community once approved.
        </p>
      </div>
    </div>
  )
}