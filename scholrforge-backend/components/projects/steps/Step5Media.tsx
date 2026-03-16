'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Upload, Image } from 'lucide-react'

export default function Step5Media() {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add Media</h2>
        <p className="text-muted-foreground">
          Upload screenshots or demo videos (optional)
        </p>
      </div>

      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
        <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="font-semibold mb-1">Drag and drop images here</p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse (PNG, JPG up to 10MB)
        </p>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Choose Files
        </button>
      </div>

      <div className="glass rounded-xl p-4 bg-secondary/5 border-secondary/20">
        <p className="text-sm text-muted-foreground">
          💡 Adding screenshots helps attract more downloads and makes your project stand out
        </p>
      </div>
    </div>
  )
}
