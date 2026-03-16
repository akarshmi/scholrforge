'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Github, Loader2, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

function InputField({
  label, placeholder, type = 'text', icon, rightSlot, field, disabled, error,
}: {
  label: string
  placeholder: string
  type?: string
  icon: React.ReactNode
  rightSlot?: React.ReactNode
  field: any
  disabled?: boolean
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className={`
        flex items-center gap-2.5 px-3.5 h-11 rounded-xl
        border transition-all duration-200
        bg-muted/20
        ${error ? 'border-destructive/60 bg-destructive/5' : 'border-border/60 focus-within:border-primary/60 focus-within:bg-primary/5 focus-within:ring-2 focus-within:ring-primary/10'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <span className="text-muted-foreground/60 shrink-0">{icon}</span>
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none min-w-0"
        />
        {rightSlot}
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-destructive inline-block" />
          {error}
        </p>
      )}
    </div>
  )
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()
  const addNotification = useUIStore((s) => s.addNotification)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      const mockUser = {
        id: '1',
        username: values.email.split('@')[0],
        email: values.email,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
      }
      login(mockUser, 'mock-jwt-token')
      setSuccess(true)
      toast.success('Welcome back!')
      addNotification({ message: 'Welcome back!', type: 'success' })
      setTimeout(() => router.push('/feed'), 800)
    } catch {
      toast.error('Failed to login. Please try again.')
      addNotification({ message: 'Failed to login', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <InputField
                    label="Email"
                    placeholder="you@example.com"
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                    field={field}
                    disabled={isLoading}
                    error={fieldState.error?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <InputField
                    label="Password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    icon={<Lock className="w-4 h-4" />}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0"
                        tabIndex={-1}
                      >
                        {showPassword
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />
                        }
                      </button>
                    }
                    field={field}
                    disabled={isLoading}
                    error={fieldState.error?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => field.onChange(!field.value)}
                    className={`
                      w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 shrink-0
                      ${field.value
                        ? 'bg-primary border-primary'
                        : 'border-border/60 bg-muted/20 group-hover:border-primary/40'
                      }
                    `}
                  >
                    {field.value && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>
              )}
            />
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || success}
            className={`
              w-full h-11 rounded-xl text-sm font-semibold
              flex items-center justify-center gap-2
              transition-all duration-200 active:scale-[0.98]
              ${success
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25'
              }
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            {success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Signed in!
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-xs text-muted-foreground/60 shrink-0">or continue with</span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: <Github className="w-4 h-4" />, label: 'GitHub', handler: () => toast.info('GitHub login coming soon') },
          { icon: <FcGoogle className="w-4 h-4" />, label: 'Google', handler: () => toast.info('Google login coming soon') },
        ].map(({ icon, label, handler }) => (
          <button
            key={label}
            type="button"
            onClick={handler}
            disabled={isLoading}
            className="
              h-10 rounded-xl border border-border/60 bg-muted/20
              flex items-center justify-center gap-2
              text-sm font-medium text-muted-foreground
              hover:border-border hover:bg-muted/40 hover:text-foreground
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Sign up link */}
      <p className="text-center text-xs text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Create one free
        </Link>
      </p>
    </motion.div>
  )
}