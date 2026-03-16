'use client'

import { FormProvider } from 'react-hook-form'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import Step1ProjectType from '@/components/projects/steps/Step1ProjectType'
import Step2BasicInfo from '@/components/projects/steps/Step2BasicInfo'
import Step3TechStack from '@/components/projects/steps/Step3TechStack'
import Step4Tags from '@/components/projects/steps/Step4Tags'
import Step5Media from '@/components/projects/steps/Step5Media'
import Step6Review from '@/components/projects/steps/Step6Review'

const STEPS = [
  { label: 'Type', short: '01' },
  { label: 'Info', short: '02' },
  { label: 'Tech', short: '03' },
  { label: 'Tags', short: '04' },
  { label: 'Media', short: '05' },
  { label: 'Review', short: '06' },
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

function StepIndicator({ steps, current }: { steps: typeof STEPS; current: number }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        const last = i === steps.length - 1

        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300"
                style={
                  done ? { background: '#6c63ff', borderColor: '#6c63ff', color: '#fff' } :
                    active ? { background: 'rgba(108,99,255,0.15)', borderColor: '#6c63ff', color: '#6c63ff' } :
                      { background: 'transparent', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.3)' }
                }
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step.short}
              </div>
              <span
                className="text-[10px] font-medium hidden sm:block transition-colors duration-200"
                style={{ color: active ? '#6c63ff' : done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}
              >
                {step.label}
              </span>
            </div>
            {!last && (
              <div
                className="flex-1 h-px mx-1 sm:mx-2 mt-0 sm:-mt-4 transition-all duration-500"
                style={{ background: i < current ? '#6c63ff' : 'rgba(255,255,255,0.1)' }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function UploadWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      projectType: 'github', title: '', description: '', content: '',
      difficulty: 'beginner', semester: '', techStack: [], tags: [],
      media: [], license: 'MIT', repositoryUrl: '',
    },
  })

  const progress = ((currentStep + 1) / STEPS.length) * 100

  function getFieldsForStep(step: number): (keyof UploadFormValues)[] {
    return ({
      0: ['projectType'],
      1: ['title', 'description', 'difficulty', 'semester'],
      2: ['techStack'],
      3: ['tags'],
      4: ['media'],
      5: ['repositoryUrl', 'license'],
    } as Record<number, (keyof UploadFormValues)[]>)[step] || []
  }

  const handleNext = async () => {
    const valid = await form.trigger(getFieldsForStep(currentStep))
    if (valid) setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0))

  const handleSubmit = async (values: UploadFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 2000))
      setSuccess(true)
      toast.success('Project published successfully!')
    } catch {
      toast.error('Failed to upload project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="glass rounded-2xl p-10 text-center max-w-sm w-full space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ background: 'rgba(0,212,170,0.15)', border: '2px solid rgba(0,212,170,0.4)' }}>
            <Check className="w-7 h-7" style={{ color: '#00d4aa' }} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Project Published!</h2>
          <p className="text-sm text-muted-foreground">Your project is now live and visible to the community.</p>
          <a href="/explore"
            className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
            Browse Projects
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-10 sm:py-16 px-4 sm:px-6">

      {/* Background glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(108,99,255,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          className="text-center space-y-1.5"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Share Your Project</h1>
          <p className="text-sm text-muted-foreground">Showcase your academic work in {STEPS.length} simple steps</p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StepIndicator steps={STEPS} current={currentStep} />
        </motion.div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].label}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #6c63ff, #00d4aa)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-px w-full"
            style={{ background: `linear-gradient(to right, rgba(108,99,255,0.8), rgba(0,212,170,0.8), transparent)` }} />

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="p-6 sm:p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22 }}
                  >
                    {currentStep === 0 && <Step1ProjectType />}
                    {currentStep === 1 && <Step2BasicInfo />}
                    {currentStep === 2 && <Step3TechStack />}
                    {currentStep === 3 && <Step4Tags />}
                    {currentStep === 4 && <Step5Media />}
                    {currentStep === 5 && <Step6Review />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="px-6 sm:px-7 pb-6 sm:pb-7 flex gap-3 border-t border-border/40 pt-5">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex-1" />

                {currentStep === STEPS.length - 1 ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                      : <><Check className="w-4 h-4" /> Publish Project</>
                    }
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 active:scale-[0.98] transition-all"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}