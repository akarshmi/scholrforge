'use client'

import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Upload,
  ImageIcon,
  X,
  Film,
  FileArchive,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_MEDIA_FILES = 6
const MAX_MEDIA_MB = 10
const MAX_ZIP_MB = 200

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Step5Media() {
  const form = useFormContext()

  // ZIP state
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [zipError, setZipError] = useState<string | null>(null)
  const [zipDragging, setZipDragging] = useState(false)
  const zipInputRef = useRef<HTMLInputElement>(null)

  // Media state
  const [previews, setPreviews] = useState<string[]>([])
  const [mediaDragging, setMediaDragging] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  // ── ZIP handlers ─────────────────────────────────────────────────────────
  const handleZip = (files: FileList | null) => {
    setZipError(null)
    const file = files?.[0]
    if (!file) return

    if (!file.name.endsWith('.zip')) {
      setZipError('Only .zip files are accepted.')
      return
    }
    if (file.size > MAX_ZIP_MB * 1024 * 1024) {
      setZipError(`File exceeds the ${MAX_ZIP_MB} MB limit.`)
      return
    }

    setZipFile(file)
    form.setValue('zipFile', file)
  }

  const removeZip = () => {
    setZipFile(null)
    setZipError(null)
    form.setValue('zipFile', null)
    if (zipInputRef.current) zipInputRef.current.value = ''
  }

  // ── Media handlers ────────────────────────────────────────────────────────
  const handleMedia = (incoming: FileList | null) => {
    if (!incoming) return
    setMediaError(null)

    const existing: File[] = form.getValues('mediaFiles') ?? []
    const remaining = MAX_MEDIA_FILES - existing.length
    if (remaining <= 0) return

    const valid: File[] = []
    const newPreviews: string[] = []

    Array.from(incoming)
      .slice(0, remaining)
      .forEach(file => {
        if (file.size > MAX_MEDIA_MB * 1024 * 1024) {
          setMediaError(`"${file.name}" exceeds ${MAX_MEDIA_MB} MB and was skipped.`)
          return
        }
        valid.push(file)
        newPreviews.push(URL.createObjectURL(file))
      })

    if (valid.length === 0) return
    form.setValue('mediaFiles', [...existing, ...valid])
    setPreviews(p => [...p, ...newPreviews])
  }

  const removeMedia = (i: number) => {
    URL.revokeObjectURL(previews[i])
    setPreviews(p => p.filter((_, idx) => idx !== i))
    const files: File[] = form.getValues('mediaFiles') ?? []
    form.setValue('mediaFiles', files.filter((_, idx) => idx !== i))
  }

  const currentMediaCount = (form.watch('mediaFiles') ?? []).length

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Upload Files</h2>
        <p className="text-sm text-muted-foreground">
          Add your project ZIP and optional screenshots.
        </p>
      </div>

      {/* ── ZIP Upload ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FileArchive className="w-4 h-4" style={{ color: '#6c63ff' }} />
          <span className="text-sm font-semibold text-foreground">
            Project ZIP <span className="text-destructive">*</span>
          </span>
          <span className="text-xs text-muted-foreground ml-auto">Max {MAX_ZIP_MB} MB</span>
        </div>

        {!zipFile ? (
          <div
            onClick={() => zipInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setZipDragging(true) }}
            onDragLeave={() => setZipDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setZipDragging(false)
              handleZip(e.dataTransfer.files)
            }}
            className="relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200"
            style={
              zipDragging
                ? { borderColor: '#6c63ff', background: 'rgba(108,99,255,0.08)' }
                : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }
            }
          >
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              className="sr-only"
              onChange={e => handleZip(e.target.files)}
            />
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)' }}
              >
                <FileArchive className="w-5 h-5" style={{ color: '#6c63ff' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {zipDragging ? 'Drop ZIP here' : 'Drag & drop your project ZIP'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  or click to browse · .zip only · up to {MAX_ZIP_MB} MB
                </p>
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); zipInputRef.current?.click() }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                <Upload className="w-3.5 h-3.5" /> Choose ZIP
              </button>
            </div>
          </div>
        ) : (
          /* ZIP selected – show summary card */
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
            style={{ background: 'rgba(108,99,255,0.06)', borderColor: 'rgba(108,99,255,0.25)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(108,99,255,0.12)' }}
            >
              <FileArchive className="w-5 h-5" style={{ color: '#6c63ff' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{zipFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(zipFile.size)}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#00d4aa' }} />
            <button
              type="button"
              onClick={removeZip}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors shrink-0"
              aria-label="Remove ZIP"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        {zipError && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {zipError}
          </p>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-border/30" />

      {/* ── Media Upload ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" style={{ color: '#00d4aa' }} />
          <span className="text-sm font-semibold text-foreground">
            Screenshots <span className="text-muted-foreground font-normal">(optional)</span>
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {currentMediaCount}/{MAX_MEDIA_FILES} uploaded
          </span>
        </div>

        {currentMediaCount < MAX_MEDIA_FILES && (
          <div
            onClick={e => { e.stopPropagation(); mediaInputRef.current?.click() }}
            onDragOver={e => { e.preventDefault(); setMediaDragging(true) }}
            onDragLeave={() => setMediaDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setMediaDragging(false)
              handleMedia(e.dataTransfer.files)
            }}
            className="relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200"
            style={
              mediaDragging
                ? { borderColor: '#00d4aa', background: 'rgba(0,212,170,0.06)' }
                : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }
            }
          >
            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={e => handleMedia(e.target.files)}
            />
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}
              >
                <ImageIcon className="w-4.5 h-4.5" style={{ color: '#00d4aa' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {mediaDragging ? 'Drop images here' : 'Drag & drop screenshots'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PNG, JPG up to {MAX_MEDIA_MB} MB · {MAX_MEDIA_FILES - currentMediaCount} slots remaining
                </p>
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); mediaInputRef.current?.click() }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-border/50 text-foreground hover:bg-accent transition-all active:scale-[0.98]"
              >
                <Upload className="w-3 h-3" /> Choose Images
              </button>
            </div>
          </div>
        )}

        {mediaError && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {mediaError}
          </p>
        )}

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative group aspect-video rounded-xl overflow-hidden border border-border/40"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-1.5 right-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-md">
                  {i + 1}/{MAX_MEDIA_FILES}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tip */}
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl border"
        style={{ background: 'rgba(0,212,170,0.06)', borderColor: 'rgba(0,212,170,0.2)' }}
      >
        <Film className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#00d4aa' }} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Adding screenshots significantly increases downloads. Show the UI, key features, or
          architecture diagrams.
        </p>
      </div>
    </div>
  )
}