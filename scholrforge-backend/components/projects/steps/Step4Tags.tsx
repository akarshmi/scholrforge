'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

export default function Step4Tags() {
  const form = useFormContext()
  const tags = form.watch('tags')
  const [input, setInput] = useState('')

  const handleAddTag = () => {
    if (input.trim() && tags.length < 5) {
      const newTag = input.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        form.setValue('tags', [...tags, newTag])
        setInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue('tags', tags.filter((t: string) => t !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add Tags</h2>
        <p className="text-muted-foreground">
          Add up to 5 tags to help people discover your project
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., AI, Machine Learning, NLP"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={tags.length >= 5}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            disabled={!input.trim() || tags.length >= 5}
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1 gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {tags.length}/5 tags added
        </p>
      </div>
    </div>
  )
}
