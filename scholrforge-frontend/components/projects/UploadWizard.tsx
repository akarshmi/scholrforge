'use client'

/**
 * UploadProjectPage.tsx  —  app/projects/upload/page.tsx
 * ───────────────────────────────────────────────────────
 * Self-contained 6-step project upload wizard.
 *
 * Fixes vs previous version:
 *   1. submitProject() reads the JWT from localStorage / cookie and forwards
 *      it as an Authorization header so the Next.js proxy can pass it on.
 *   2. The route handler (see companion comment at the bottom) now forwards
 *      the Authorization header to Spring Boot — fixing the 401.
 *   3. FormData debug: use [...fd.entries()] to actually see contents in DevTools.
 *
 * External deps: react-hook-form, @hookform/resolvers/zod, zod,
 *                framer-motion, lucide-react, sonner, next/navigation
 */

import React, { useRef, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, Check, Loader2,
  FileArchive, ImageIcon, Upload, X, Film,
  CheckCircle2, AlertCircle, Code2,
  Layers, BookOpen, Link2, Gauge,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// 1. SCHEMA & TYPES
// ─────────────────────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  'WEB', 'MOBILE', 'AI', 'MACHINE_LEARNING', 'DESKTOP', 'EMBEDDED', 'IOT',
] as const

const DIFFICULTY_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const

const isFile = (v: unknown): v is File =>
  typeof window !== 'undefined' && v instanceof File

const projectSchema = z.object({
  projectType:      z.enum(PROJECT_TYPES,      { required_error: 'Select a project type.' }),
  projectTitle:     z.string().min(3, 'Title must be at least 3 characters.').max(150, 'Max 150 characters.'),
  description:      z.string().min(10, 'Description must be at least 10 characters.').max(2000, 'Max 2000 characters.'),
  difficultyLevel:  z.enum(DIFFICULTY_LEVELS,  { required_error: 'Select a difficulty level.' }),
  techStackIds:     z.array(z.string()).default([]),
  newTechStackNames:z.array(z.string().min(1)).default([]),
  tagIds:           z.array(z.string()).default([]),
  newTagNames:      z.array(z.string().min(1)).default([]),
  zipFile: z.any()
    .refine(isFile,                                { message: 'A project ZIP file is required.' })
    .refine((f: File) => f?.name?.endsWith('.zip'),{ message: 'File must be a .zip archive.' })
    .refine((f: File) => f?.size <= 200*1024*1024, { message: 'ZIP must be 200 MB or smaller.' }),
  mediaFiles:   z.array(z.any()).max(6, 'Up to 6 screenshots allowed.').default([]),
  githubUrl:    z.string().optional().refine(v => !v || /^(https?:\/\/)?(www\.)?github\.com\/.+/.test(v), { message: 'Must be a valid GitHub URL.' }),
  demoVideoUrl: z.string().optional().refine(v => !v || /^https?:\/\/.+/.test(v), { message: 'Must be a valid URL.' }),
  license:      z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const defaultValues: Partial<ProjectFormValues> = {
  techStackIds: [], newTechStackNames: [],
  tagIds: [],      newTagNames: [],
  mediaFiles: [],
  githubUrl: '',   demoVideoUrl: '', license: '',
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SUBMIT FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

async function submitProject(values: ProjectFormValues): Promise<{ slug: string; id: string }> {
  const fd = new FormData()

  // Scalar fields
  fd.append('projectTitle',    values.projectTitle)
  fd.append('description',     values.description)
  fd.append('projectType',     values.projectType)
  fd.append('difficultyLevel', values.difficultyLevel)
  if (values.githubUrl?.trim())    fd.append('githubUrl',    values.githubUrl.trim())
  if (values.demoVideoUrl?.trim()) fd.append('demoVideoUrl', values.demoVideoUrl.trim())
  if (values.license?.trim())      fd.append('license',      values.license.trim())

  // Repeated keys → Spring Boot Set<>
  for (const id   of values.techStackIds      ?? []) fd.append('techStackIds',      id)
  for (const name of values.newTechStackNames ?? []) fd.append('newTechStackNames', name)
  for (const id   of values.tagIds            ?? []) fd.append('tagIds',            id)
  for (const name of values.newTagNames       ?? []) fd.append('newTagNames',       name)

  // Files
  fd.append('zipFile', values.zipFile as File, (values.zipFile as File).name)
  for (const f of (values.mediaFiles ?? []) as File[]) fd.append('mediaFiles', f, f.name)


  // Auth: read access_token stored after login, forward as Bearer token.
  // Route handler passes it to Spring Boot. Cookie sent as fallback via credentials:'include'.
  // After login store it: sessionStorage.setItem('access_token', data.access_token)
  // Read access token from Zustand's persist storage (key: 'auth-storage')
  // Zustand persist stores the full state as JSON under the key name.
  const token: string | null = (() => {
    try {
      const raw = localStorage.getItem('auth-storage')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed?.state?.accessToken ?? null
    } catch {
      return null
    }
  })()
  const reqHeaders: HeadersInit = {}
  if (token) reqHeaders['Authorization'] = 'Bearer ' + token
  // DO NOT set Content-Type - browser sets multipart boundary automatically

  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: reqHeaders,
    credentials: 'include',
    body: fd,
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw Object.assign(
      new Error(json?.error ?? `Request failed (${res.status})`),
      { response: { status: res.status }, detail: json?.detail },
    )
  }

  return (json?.data ?? json) as { slug: string; id: string }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STEP COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared primitives ─────────────────────────────────────────────────────────

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-foreground bg-muted/20 border border-border/50 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-muted/30 transition-all"

function FormField({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

// ── Step 1 · Project Type ─────────────────────────────────────────────────────

const TYPE_META: Record<typeof PROJECT_TYPES[number], { icon: React.ReactNode; label: string; desc: string }> = {
  WEB:             { icon: <Layers className="w-5 h-5" />,   label: 'Web',            desc: 'Browser-based application' },
  MOBILE:          { icon: <Gauge className="w-5 h-5" />,    label: 'Mobile',         desc: 'iOS / Android app' },
  AI:              { icon: <Code2 className="w-5 h-5" />,    label: 'AI',             desc: 'Artificial intelligence' },
  MACHINE_LEARNING:{ icon: <BookOpen className="w-5 h-5" />, label: 'Machine Learning',desc: 'ML models & pipelines' },
  DESKTOP:         { icon: <Link2 className="w-5 h-5" />,    label: 'Desktop',        desc: 'Native desktop app' },
  EMBEDDED:        { icon: <Gauge className="w-5 h-5" />,    label: 'Embedded',       desc: 'Firmware / microcontrollers' },
  IOT:             { icon: <Layers className="w-5 h-5" />,   label: 'IoT',            desc: 'Internet of Things' },
}


function Step1ProjectType() {
  const { setValue, watch, formState: { errors } } = useFormContext<ProjectFormValues>()
  const current = watch('projectType')
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">What are you building?</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose the category that best fits your project.</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {PROJECT_TYPES.map(type => {
          const { icon, label, desc } = TYPE_META[type]
          const active = current === type
          return (
            <button key={type} type="button"
              onClick={() => setValue('projectType', type, { shouldValidate: true })}
              className="flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-150 active:scale-[0.98]"
              style={active
                ? { borderColor: '#6c63ff', background: 'rgba(108,99,255,0.1)' }
                : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              <span className="mt-0.5 shrink-0" style={{ color: active ? '#6c63ff' : 'rgba(255,255,255,0.35)' }}>{icon}</span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{desc}</span>
              </span>
            </button>
          )
        })}
      </div>
      {errors.projectType && (
        <p className="text-xs text-destructive flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors.projectType.message}
        </p>
      )}
    </div>
  )
}

// ── Step 2 · Basic Info ───────────────────────────────────────────────────────

function Step2BasicInfo() {
  const { register, watch, formState: { errors } } = useFormContext<ProjectFormValues>()
  const desc = watch('description') ?? ''
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Project details</h2>
        <p className="text-sm text-muted-foreground mt-1">Tell the world what you built.</p>
      </div>
      <FormField label="Project title" required error={errors.projectTitle?.message}>
        <input {...register('projectTitle')} placeholder="My Awesome Project" className={inputCls} />
      </FormField>
      <FormField label="Description" required error={errors.description?.message}>
        <div className="relative">
          <textarea {...register('description')} rows={4}
            placeholder="Describe what your project does, the problem it solves, and any interesting technical decisions…"
            className={`${inputCls} resize-none`} />
          <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/50">{desc.length}/2000</span>
        </div>
      </FormField>
      <FormField label="Difficulty level" required error={errors.difficultyLevel?.message}>
        <div className="flex gap-2">
          {DIFFICULTY_LEVELS.map(lvl => <DifficultyPill key={lvl} level={lvl} />)}
        </div>
      </FormField>
    </div>
  )
}

function DifficultyPill({ level }: { level: typeof DIFFICULTY_LEVELS[number] }) {
  const { setValue, watch } = useFormContext<ProjectFormValues>()
  const active = watch('difficultyLevel') === level
  const color  = level === 'BEGINNER' ? '#00d4aa' : level === 'INTERMEDIATE' ? '#f59e0b' : '#ef4444'
  return (
    <button type="button" onClick={() => setValue('difficultyLevel', level, { shouldValidate: true })}
      className="flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150 active:scale-[0.97]"
      style={active
        ? { borderColor: color, background: `${color}18`, color }
        : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.35)' }}>
      {level.charAt(0) + level.slice(1).toLowerCase()}
    </button>
  )
}

// ── Step 3 · Tech Stack ───────────────────────────────────────────────────────

const POPULAR_TECH = [
  'React','Next.js','Vue','Angular','Svelte',
  'Node.js','Express','Spring Boot','Django','FastAPI',
  'PostgreSQL','MongoDB','Redis','TypeScript','Python',
  'Docker','Kubernetes','AWS','Tailwind CSS','GraphQL',
]

function Step3TechStack() {
  const { getValues, setValue, watch } = useFormContext<ProjectFormValues>()
  const [input, setInput] = useState('')
  const selected: string[] = watch('newTechStackNames') ?? []

  const toggle = (name: string) => {
    const curr = getValues('newTechStackNames') ?? []
    setValue('newTechStackNames', curr.includes(name) ? curr.filter(n => n !== name) : [...curr, name], { shouldValidate: true })
  }
  const addCustom = () => {
    const val = input.trim()
    if (!val) return
    const curr = getValues('newTechStackNames') ?? []
    if (!curr.includes(val)) setValue('newTechStackNames', [...curr, val], { shouldValidate: true })
    setInput('')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Tech stack</h2>
        <p className="text-sm text-muted-foreground mt-1">Select everything you used to build this.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {POPULAR_TECH.map(t => {
          const active = selected.includes(t)
          return (
            <button key={t} type="button" onClick={() => toggle(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 active:scale-[0.96]"
              style={active
                ? { borderColor: '#6c63ff', background: 'rgba(108,99,255,0.15)', color: '#a89eff' }
                : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }}>
              {t}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add custom tech…" className={`${inputCls} flex-1`} />
        <button type="button" onClick={addCustom}
          className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-all">Add</button>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(t => (
            <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {t}<button type="button" onClick={() => toggle(t)} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Step 4 · Tags ─────────────────────────────────────────────────────────────

const POPULAR_TAGS = [
  'open-source','beginner-friendly','tutorial','portfolio',
  'full-stack','frontend','backend','authentication',
  'real-time','ai-powered','rest-api','responsive',
  'dark-mode','pwa','serverless','microservices',
]

function Step4Tags() {
  const { getValues, setValue, watch } = useFormContext<ProjectFormValues>()
  const [input, setInput] = useState('')
  const selected: string[] = watch('newTagNames') ?? []

  const toggle = (tag: string) => {
    const curr = getValues('newTagNames') ?? []
    setValue('newTagNames', curr.includes(tag) ? curr.filter(t => t !== tag) : [...curr, tag], { shouldValidate: true })
  }
  const addCustom = () => {
    const val = input.trim().toLowerCase().replace(/\s+/g, '-')
    if (!val) return
    const curr = getValues('newTagNames') ?? []
    if (!curr.includes(val)) setValue('newTagNames', [...curr, val], { shouldValidate: true })
    setInput('')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Tags</h2>
        <p className="text-sm text-muted-foreground mt-1">Help people discover your project.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {POPULAR_TAGS.map(t => {
          const active = selected.includes(t)
          return (
            <button key={t} type="button" onClick={() => toggle(t)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 active:scale-[0.96]"
              style={active
                ? { borderColor: '#00d4aa', background: 'rgba(0,212,170,0.12)', color: '#00d4aa' }
                : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }}>
              #{t}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add custom tag…" className={`${inputCls} flex-1`} />
        <button type="button" onClick={addCustom}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border transition-all"
          style={{ background: 'rgba(0,212,170,0.1)', borderColor: 'rgba(0,212,170,0.2)', color: '#00d4aa' }}>Add</button>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(t => (
            <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{ background: 'rgba(0,212,170,0.08)', borderColor: 'rgba(0,212,170,0.2)', color: '#00d4aa' }}>
              #{t}<button type="button" onClick={() => toggle(t)} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Step 5 · Files ────────────────────────────────────────────────────────────

const MAX_MEDIA_FILES = 6
const MAX_MEDIA_MB    = 10
const MAX_ZIP_MB      = 200
const fmtBytes = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024**2 ? `${(b/1024).toFixed(1)} KB` : `${(b/1024**2).toFixed(1)} MB`

function Step5Files() {
  const { setValue, getValues, watch, formState: { errors } } = useFormContext<ProjectFormValues>()

  const zipFile = watch('zipFile') as File | null | undefined
  const [zipDrag, setZipDrag] = useState(false)
  const zipRef = useRef<HTMLInputElement>(null)

  const [previews,  setPreviews]  = useState<string[]>([])
  const [mediaDrag, setMediaDrag] = useState(false)
  const [mediaErr,  setMediaErr]  = useState<string | null>(null)
  const mediaRef = useRef<HTMLInputElement>(null)

  const handleZip = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    setValue('zipFile', f, { shouldValidate: true, shouldDirty: true })
    if (zipRef.current) zipRef.current.value = ''
  }

  const removeZip = () => {
    setValue('zipFile', null as any, { shouldValidate: true, shouldDirty: true })
    if (zipRef.current) zipRef.current.value = ''
  }

  const handleMedia = (incoming: FileList | null) => {
    if (!incoming) return
    setMediaErr(null)
    const existing: File[] = getValues('mediaFiles') ?? []
    const remaining = MAX_MEDIA_FILES - existing.length
    if (remaining <= 0) return
    const valid: File[] = []
    const urls:  string[] = []
    Array.from(incoming).slice(0, remaining).forEach(f => {
      if (f.size > MAX_MEDIA_MB * 1024 * 1024) { setMediaErr(`"${f.name}" exceeds ${MAX_MEDIA_MB} MB.`); return }
      valid.push(f); urls.push(URL.createObjectURL(f))
    })
    if (!valid.length) return
    setValue('mediaFiles', [...existing, ...valid], { shouldValidate: true })
    setPreviews(p => [...p, ...urls])
  }

  const removeMedia = (i: number) => {
    URL.revokeObjectURL(previews[i])
    setPreviews(p => p.filter((_, idx) => idx !== i))
    const files: File[] = getValues('mediaFiles') ?? []
    setValue('mediaFiles', files.filter((_, idx) => idx !== i), { shouldValidate: true })
  }

  const mediaCount  = (watch('mediaFiles') ?? []).length
  const zipErrMsg   = errors.zipFile?.message   as string | undefined
  const mediaErrMsg = errors.mediaFiles?.message as string | undefined

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">Upload files</h2>
        <p className="text-sm text-muted-foreground mt-1">Add your project ZIP and optional screenshots.</p>
      </div>

      {/* ZIP */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FileArchive className="w-4 h-4" style={{ color: '#6c63ff' }} />
          <span className="text-sm font-semibold text-foreground">Project ZIP <span className="text-destructive">*</span></span>
          <span className="text-xs text-muted-foreground ml-auto">Max {MAX_ZIP_MB} MB</span>
        </div>

        <input ref={zipRef} type="file" accept=".zip,application/zip,application/x-zip-compressed"
          className="sr-only" onChange={e => handleZip(e.target.files)} />

        {!zipFile ? (
          <div onClick={() => zipRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setZipDrag(true) }}
            onDragLeave={() => setZipDrag(false)}
            onDrop={e => { e.preventDefault(); setZipDrag(false); handleZip(e.dataTransfer.files) }}
            className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200"
            style={zipErrMsg
              ? { borderColor: 'hsl(var(--destructive))', background: 'rgba(239,68,68,0.04)' }
              : zipDrag
              ? { borderColor: '#6c63ff', background: 'rgba(108,99,255,0.08)' }
              : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: zipErrMsg ? 'rgba(239,68,68,0.08)' : 'rgba(108,99,255,0.1)', border: zipErrMsg ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(108,99,255,0.2)' }}>
                <FileArchive className="w-5 h-5" style={{ color: zipErrMsg ? 'hsl(var(--destructive))' : '#6c63ff' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{zipDrag ? 'Drop ZIP here' : 'Drag & drop your project ZIP'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">.zip only · up to {MAX_ZIP_MB} MB</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); zipRef.current?.click() }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-[0.98] transition-all">
                <Upload className="w-3.5 h-3.5" /> Choose ZIP
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
            style={{ background: 'rgba(108,99,255,0.06)', borderColor: 'rgba(108,99,255,0.25)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(108,99,255,0.12)' }}>
              <FileArchive className="w-5 h-5" style={{ color: '#6c63ff' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{zipFile.name}</p>
              <p className="text-xs text-muted-foreground">{fmtBytes(zipFile.size)}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#00d4aa' }} />
            <button type="button" onClick={removeZip}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors shrink-0">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        {zipErrMsg && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{zipErrMsg}
          </p>
        )}
      </section>

      <div className="border-t border-border/30" />

      {/* Screenshots */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" style={{ color: '#00d4aa' }} />
          <span className="text-sm font-semibold text-foreground">
            Screenshots <span className="text-muted-foreground font-normal">(optional)</span>
          </span>
          <span className="text-xs text-muted-foreground ml-auto">{mediaCount}/{MAX_MEDIA_FILES}</span>
        </div>

        {mediaCount < MAX_MEDIA_FILES && (
          <div onClick={e => { e.stopPropagation(); mediaRef.current?.click() }}
            onDragOver={e => { e.preventDefault(); setMediaDrag(true) }}
            onDragLeave={() => setMediaDrag(false)}
            onDrop={e => { e.preventDefault(); setMediaDrag(false); handleMedia(e.dataTransfer.files) }}
            className="rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200"
            style={mediaDrag ? { borderColor: '#00d4aa', background: 'rgba(0,212,170,0.06)' } : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            <input ref={mediaRef} type="file" accept="image/*" multiple className="sr-only" onChange={e => handleMedia(e.target.files)} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <ImageIcon className="w-4 h-4" style={{ color: '#00d4aa' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{mediaDrag ? 'Drop images here' : 'Drag & drop screenshots'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG · {MAX_MEDIA_MB} MB each · {MAX_MEDIA_FILES - mediaCount} slots left</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); mediaRef.current?.click() }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-border/50 text-foreground hover:bg-accent transition-all active:scale-[0.98]">
                <Upload className="w-3 h-3" /> Choose Images
              </button>
            </div>
          </div>
        )}

        {(mediaErr || mediaErrMsg) && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{mediaErr ?? mediaErrMsg}
          </p>
        )}

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5">
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-border/40">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeMedia(i)} className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-1.5 right-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-md">{i+1}/{MAX_MEDIA_FILES}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border" style={{ background: 'rgba(0,212,170,0.06)', borderColor: 'rgba(0,212,170,0.2)' }}>
          <Film className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#00d4aa' }} />
          <p className="text-xs text-muted-foreground leading-relaxed">Adding screenshots significantly increases downloads. Show the UI, key features, or architecture diagrams.</p>
        </div>
      </section>
    </div>
  )
}

// ── Step 6 · Review & Links ───────────────────────────────────────────────────

function Step6Review() {
  const { register, watch, formState: { errors } } = useFormContext<ProjectFormValues>()
  const values  = watch()
  const zipFile = values.zipFile as File | null | undefined

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/20 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0 w-28">{label}</span>
      <span className="text-xs text-foreground text-right">{value || <span className="text-muted-foreground/50">—</span>}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Final check</h2>
        <p className="text-sm text-muted-foreground mt-1">Review your project and add optional links.</p>
      </div>
      <div className="rounded-2xl border border-border/30 px-4 py-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Row label="Type"        value={values.projectType?.replace('_', ' ')} />
        <Row label="Title"       value={values.projectTitle} />
        <Row label="Difficulty"  value={values.difficultyLevel} />
        <Row label="Tech stack"  value={(values.newTechStackNames ?? []).join(', ') || '—'} />
        <Row label="Tags"        value={(values.newTagNames ?? []).map(t => `#${t}`).join(', ') || '—'} />
        <Row label="ZIP file"    value={zipFile?.name ?? <span className="text-destructive text-xs">Not uploaded</span>} />
        <Row label="Screenshots" value={`${(values.mediaFiles ?? []).length} file(s)`} />
      </div>
      <div className="space-y-4">
        <FormField label="GitHub URL" error={errors.githubUrl?.message}>
          <input {...register('githubUrl')} placeholder="https://github.com/you/project" className={inputCls} />
        </FormField>
        <FormField label="Demo / video URL" error={errors.demoVideoUrl?.message}>
          <input {...register('demoVideoUrl')} placeholder="https://youtube.com/watch?v=…" className={inputCls} />
        </FormField>
        <FormField label="License" error={errors.license?.message}>
          <input {...register('license')} placeholder="MIT, Apache 2.0, GPL…" className={inputCls} />
        </FormField>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. WIZARD SHELL
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Type',   short: '01' },
  { label: 'Info',   short: '02' },
  { label: 'Tech',   short: '03' },
  { label: 'Tags',   short: '04' },
  { label: 'Files',  short: '05' },
  { label: 'Review', short: '06' },
]

const STEP_FIELDS: (keyof ProjectFormValues)[][] = [
  ['projectType'],
  ['projectTitle', 'description', 'difficultyLevel'],
  ['newTechStackNames'],
  ['newTagNames'],
  ['zipFile', 'mediaFiles'],
  ['githubUrl', 'demoVideoUrl'],
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const done = i < current; const active = i === current
        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300"
                style={done
                  ? { background: '#6c63ff', borderColor: '#6c63ff', color: '#fff' }
                  : active
                  ? { background: 'rgba(108,99,255,0.15)', borderColor: '#6c63ff', color: '#6c63ff' }
                  : { background: 'transparent', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.3)' }}>
                {done ? <Check className="w-3.5 h-3.5" /> : step.short}
              </div>
              <span className="text-[10px] font-medium hidden sm:block transition-colors duration-200"
                style={{ color: active ? '#6c63ff' : done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 sm:mx-2 mt-0 sm:-mt-4 transition-all duration-500"
                style={{ background: i < current ? '#6c63ff' : 'rgba(255,255,255,0.1)' }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function UploadProjectPage() {
  const [currentStep,  setCurrentStep]  = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success,      setSuccess]      = useState(false)
  const router = useRouter()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = async () => {
    const valid = await form.trigger(STEP_FIELDS[currentStep])
    if (valid) setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0))

  const handlePublish = async () => {
    const values = form.getValues()
    const zipFile = values.zipFile as File | null | undefined

    // ── Build FormData ──────────────────────────────────────────────────────
    const fd = new FormData()
    fd.append('projectTitle',    values.projectTitle    ?? '')
    fd.append('description',     values.description     ?? '')
    fd.append('projectType',     values.projectType     ?? '')
    fd.append('difficultyLevel', values.difficultyLevel ?? '')
    if (values.githubUrl?.trim())    fd.append('githubUrl',    values.githubUrl.trim())
    if (values.demoVideoUrl?.trim()) fd.append('demoVideoUrl', values.demoVideoUrl.trim())
    if (values.license?.trim())      fd.append('license',      values.license.trim())

    for (const id   of values.techStackIds      ?? []) fd.append('techStackIds',      id)
    for (const name of values.newTechStackNames ?? []) fd.append('newTechStackNames', name)
    for (const id   of values.tagIds            ?? []) fd.append('tagIds',            id)
    for (const name of values.newTagNames       ?? []) fd.append('newTagNames',       name)

    if (zipFile instanceof File) fd.append('zipFile', zipFile, zipFile.name)

    for (const f of (values.mediaFiles ?? []) as File[]) fd.append('mediaFiles', f, f.name)

    // ── Console log everything being sent ───────────────────────────────────
    console.group('handlePublish — FormData payload')
    for (const [key, val] of fd.entries()) {
      if (val instanceof File) {
        console.log(`[FILE]  ${key}:`, val.name, `(${(val.size / 1024).toFixed(1)} KB, ${val.type || 'unknown type'})`)
      } else {
        console.log(`[FIELD] ${key}:`, val)
      }
    }
    console.groupEnd()

    // ── Send ────────────────────────────────────────────────────────────────
    // Read access token from Zustand's persist storage (key: 'auth-storage')
  // Zustand persist stores the full state as JSON under the key name.
  const token: string | null = (() => {
    try {
      const raw = localStorage.getItem('auth-storage')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed?.state?.accessToken ?? null
    } catch {
      return null
    }
  })()
    const headers: HeadersInit = {}
    if (token) headers['Authorization'] = 'Bearer ' + token

    setIsSubmitting(true)
    try {
      // ── Step 1: Create project metadata (JSON) ──────────────────────────
      const createRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          projectTitle:      values.projectTitle,
          description:       values.description,
          projectType:       values.projectType,
          difficultyLevel:   values.difficultyLevel,
          githubUrl:         values.githubUrl?.trim()  || undefined,
          demoVideoUrl:      values.demoVideoUrl?.trim() || undefined,
          tagIds:            values.tagIds            ?? [],
          newTagNames:       values.newTagNames       ?? [],
          techStackIds:      values.techStackIds      ?? [],
          newTechStackNames: values.newTechStackNames ?? [],
        }),
      })
      const createJson = await createRes.json().catch(() => null)
      console.log('[Step 1] status:', createRes.status, 'body:', createJson)

      if (!createRes.ok) throw new Error(createJson?.error ?? `Step 1 failed (${createRes.status})`)

      // Extract the project ID — log the full response so we can see the shape
      console.log('[Step 1] full response data:', createJson)
      const projectId = createJson?.data?.id
                     ?? createJson?.data?.projectId
                     ?? createJson?.id
                     ?? createJson?.projectId
      console.log('[Step 1] extracted projectId:', projectId)

      if (!projectId) throw new Error('Server did not return a project ID')

      // ── Step 2: Upload ZIP file (single file multipart) ─────────────────
      if (zipFile instanceof File) {
        const uploadFd = new FormData()
        uploadFd.append('zipFile', zipFile, zipFile.name)

        const uploadRes = await fetch(`/api/projects/${projectId}/upload`, {
          method: 'POST',
          headers, // Bearer only — NO Content-Type, browser sets multipart boundary
          credentials: 'include',
          body: uploadFd,
        })
        const uploadJson = await uploadRes.json().catch(() => null)
        console.log('[Step 2] status:', uploadRes.status, 'body:', uploadJson)

        if (!uploadRes.ok) throw new Error(uploadJson?.error ?? `Step 2 failed (${uploadRes.status})`)
      }

      setSuccess(true)
      toast.success('Project submitted for review!')
    } catch (err: any) {
      console.error('handlePublish error:', err)
      toast.error(err.message ?? 'Failed to publish. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div className="glass rounded-2xl p-10 text-center max-w-sm w-full space-y-4"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ background: 'rgba(0,212,170,0.15)', border: '2px solid rgba(0,212,170,0.4)' }}>
            <Check className="w-7 h-7" style={{ color: '#00d4aa' }} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Project Submitted!</h2>
          <p className="text-sm text-muted-foreground">Your project is under review and will be visible once approved.</p>
          <button type="button" onClick={() => router.push('/explore')}
            className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
            Browse Projects
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-10 sm:py-16 px-4 sm:px-6">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(108,99,255,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-xl mx-auto space-y-8">
        <motion.div className="text-center space-y-1.5"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Share Your Project</h1>
          <p className="text-sm text-muted-foreground">Showcase your work in {STEPS.length} simple steps</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <StepIndicator current={currentStep} />
        </motion.div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].label}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #6c63ff, #00d4aa)' }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="h-px w-full"
            style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.8), rgba(0,212,170,0.8), transparent)' }} />

          <FormProvider {...form}>
            <div>
              <div className="p-6 sm:p-7">
                <AnimatePresence mode="wait">
                  <motion.div key={currentStep}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                    {currentStep === 0 && <Step1ProjectType />}
                    {currentStep === 1 && <Step2BasicInfo />}
                    {currentStep === 2 && <Step3TechStack />}
                    {currentStep === 3 && <Step4Tags />}
                    {currentStep === 4 && <Step5Files />}
                    {currentStep === 5 && <Step6Review />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="px-6 sm:px-7 pb-6 sm:pb-7 flex gap-3 border-t border-border/40 pt-5">
                <button type="button" onClick={handleBack} disabled={currentStep === 0 || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex-1" />
                {currentStep < STEPS.length - 1 ? (
                  <button type="button" onClick={handleNext} disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 active:scale-[0.98] transition-all">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="button" onClick={handlePublish} disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all">
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</>
                      : <><Check className="w-4 h-4" /> Publish Project</>}
                  </button>
                )}
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
