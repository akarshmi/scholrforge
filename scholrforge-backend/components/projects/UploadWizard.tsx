'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Stepper } from '@/components/ui/stepper'
import { toast } from 'sonner'
import Step1ProjectType from '@/components/projects/steps/Step1ProjectType'
import Step2BasicInfo from '@/components/projects/steps/Step2BasicInfo'
import Step3TechStack from '@/components/projects/steps/Step3TechStack'
import Step4Tags from '@/components/projects/steps/Step4Tags'
import Step5Media from '@/components/projects/steps/Step5Media'
import Step6Review from '@/components/projects/steps/Step6Review'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const steps = [
  'Project Type',
  'Basic Info',
  'Tech Stack',
  'Tags',
  'Media',
  'Review',
]

const uploadSchema = z.object({
  projectType: z.enum(['github', 'zip']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  content: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  semester: z.string().min(1, 'Please select a semester'),
  techStack: z.array(z.string()).min(1, 'Select at least one technology'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
  media: z.array(z.string()).optional(),
  license: z.string().optional(),
  repositoryUrl: z.string().url().optional().or(z.literal('')),
})

type UploadFormValues = z.infer<typeof uploadSchema>

export default function UploadWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      projectType: 'github',
      title: '',
      description: '',
      content: '',
      difficulty: 'beginner',
      semester: '',
      techStack: [],
      tags: [],
      media: [],
      license: 'MIT',
      repositoryUrl: '',
    },
  })

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    // Validate current step before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  const handleSubmit = async (values: UploadFormValues) => {
    setIsSubmitting(true)
    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      console.log('Submitting project:', values)
      toast.success('Project uploaded successfully!')
      // Redirect to project page or dashboard
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function getFieldsForStep(step: number): (keyof UploadFormValues)[] {
    const stepFields: Record<number, (keyof UploadFormValues)[]> = {
      0: ['projectType'],
      1: ['title', 'description', 'difficulty', 'semester'],
      2: ['techStack'],
      3: ['tags'],
      4: ['media'],
      5: ['repositoryUrl', 'license'],
    }
    return stepFields[step] || []
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Share Your Project</h1>
          <p className="text-muted-foreground">
            Showcase your academic work in {steps.length} simple steps
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="mb-12">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <Step1ProjectType form={form} />
              )}
              {currentStep === 1 && (
                <Step2BasicInfo form={form} />
              )}
              {currentStep === 2 && (
                <Step3TechStack form={form} />
              )}
              {currentStep === 3 && (
                <Step4Tags form={form} />
              )}
              {currentStep === 4 && (
                <Step5Media form={form} />
              )}
              {currentStep === 5 && (
                <Step6Review form={form} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4 mt-12 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Uploading...' : 'Publish Project'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
