'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { TECH_STACKS } from '@/lib/constants'
import { Checkbox } from '@/components/ui/checkbox'
import { FormMessage } from '@/components/ui/form'

const allTechs = [
  ...TECH_STACKS.LANGUAGES,
  ...TECH_STACKS.FRAMEWORKS,
  ...TECH_STACKS.DATABASES,
]

export default function Step3TechStack() {
  const form = useFormContext()
  const techStack = form.watch('techStack')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Technology Stack</h2>
        <p className="text-muted-foreground">
          Select all technologies used in your project
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {allTechs.map((tech) => (
          <div key={tech.name} className="flex items-center space-x-2">
            <Checkbox
              checked={techStack.includes(tech.name)}
              onCheckedChange={(checked) => {
                if (checked) {
                  form.setValue('techStack', [...techStack, tech.name])
                } else {
                  form.setValue('techStack', techStack.filter((t: string) => t !== tech.name))
                }
              }}
            />
            <label className="text-sm font-medium cursor-pointer">
              {tech.name}
            </label>
          </div>
        ))}
      </div>

      {form.formState.errors.techStack && (
        <FormMessage className="text-destructive">
          {form.formState.errors.techStack.message}
        </FormMessage>
      )}
    </div>
  )
}
