'use client'

import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Upload, ImageIcon, X, Film } from 'lucide-react'

export default function Step5Media() {
  const form = useFormContext()
  const [previews, setPreviews] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const urls = Array.from(files).map(f => URL.createObjectURL(f))
    setPreviews(p => [...p, ...urls].slice(0, 6))
    form.setValue('media', [...(form.getValues('media') ?? []), ...Array.from(files).map(f => f.name)].slice(0, 6))
  }

  const remove = (i: number) => {
    setPreviews(p => p.filter((_, idx) => idx !== i))
    const media = form.getValues('media') ?? []
    form.setValue('media', media.filter((_: string, idx: number) => idx !== i))
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Add Media</h2>
        <p className="text-sm text-muted-foreground">Upload screenshots or demo images (optional, up to 6)</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        className="relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200"
        style={dragging
          ? { borderColor: '#6c63ff', background: 'rgba(108,99,255,0.08)' }
          : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }
        }
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only"
          onChange={e => handleFiles(e.target.files)} />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)' }}>
            <ImageIcon className="w-5 h-5" style={{ color: '#6c63ff' }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {dragging ? 'Drop files here' : 'Drag & drop images'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">or click to browse · PNG, JPG up to 10MB</p>
          </div>
          <button type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-[0.98] transition-all">
            <Upload className="w-3.5 h-3.5" /> Choose Files
          </button>
        </div>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          {previews.map((src, i) => (
            <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-border/40">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => remove(i)}
                  className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border"
        style={{ background: 'rgba(0,212,170,0.06)', borderColor: 'rgba(0,212,170,0.2)' }}>
        <Film className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#00d4aa' }} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Adding screenshots significantly increases downloads. Show the UI, key features, or architecture diagrams.
        </p>
      </div>
    </div>
  )
}