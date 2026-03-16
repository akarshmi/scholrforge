'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Step6Review() {
  const form = useFormContext()
  const values = form.getValues()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">
          Verify your information before publishing
        </p>
      </div>

      {/* Review Summary */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Title</p>
          <p className="font-semibold">{values.title}</p>
        </div>
        <Separator />
        <div>
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{values.description}</p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
            <Badge variant="outline">{values.difficulty}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Semester</p>
            <Badge variant="outline">{values.semester}</Badge>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-xs text-muted-foreground mb-2">Technologies</p>
          <div className="flex flex-wrap gap-1">
            {values.techStack?.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        {values.tags?.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {values.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Optional Fields */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/username/project"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MIT">MIT</SelectItem>
                  <SelectItem value="Apache-2.0">Apache 2.0</SelectItem>
                  <SelectItem value="GPL-3.0">GPL 3.0</SelectItem>
                  <SelectItem value="BSD-3-Clause">BSD 3-Clause</SelectItem>
                  <SelectItem value="Unlicense">Unlicense</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div className="glass rounded-xl p-4 bg-secondary/5 border-secondary/20">
        <p className="text-sm text-muted-foreground">
          ✨ Your project will be published and visible to the community immediately
        </p>
      </div>
    </div>
  )
}
