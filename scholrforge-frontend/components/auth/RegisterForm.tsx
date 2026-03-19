'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Github, Loader2, Mail, Lock, Eye, EyeOff,
  User, Check, X, CheckCircle2, ShieldCheck,
} from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import api from '@/lib/api'

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string()
    .min(2, 'At least 2 characters')
    .max(50, 'Max 50 characters'),
  username: z.string()
    .min(3, 'At least 3 characters')
    .max(20, 'Max 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

// ─── Password strength ────────────────────────────────────────────────────────

function calcStrength(pw: string): number {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}

const strengthConfig = [
  { label: '', color: 'bg-muted' },
  { label: 'Weak', color: 'bg-destructive' },
  { label: 'Fair', color: 'bg-yellow-500' },
  { label: 'Good', color: 'bg-emerald-500' },
  { label: 'Strong', color: 'bg-emerald-500' },
]

function StrengthMeter({ password }: { password: string }) {
  const s = calcStrength(password)
  const cfg = strengthConfig[s]
  if (!password) return null
  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= s ? cfg.color : 'bg-muted/50'}`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${s <= 1 ? 'text-destructive' : s <= 2 ? 'text-yellow-500' : 'text-emerald-500'}`}>
        {cfg.label} password
      </p>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
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
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className={`
        flex items-center gap-2.5 px-3.5 h-11 rounded-xl border transition-all duration-200 bg-muted/20
        ${error
          ? 'border-destructive/60 bg-destructive/5'
          : 'border-border/60 focus-within:border-primary/60 focus-within:bg-primary/5 focus-within:ring-2 focus-within:ring-primary/10'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <span className="text-muted-foreground/50 shrink-0">{icon}</span>
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none min-w-0"
        />
        {rightSlot}
      </div>
      {error && (
        <p className="text-[11px] text-destructive flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-destructive inline-block shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = form.watch('password')
  const confirmPassword = form.watch('confirmPassword')
  const pwMatch = confirmPassword.length > 0 && password === confirmPassword

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true)
    try {
      const response = await api.post('/api/auth/register', {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      })

      const { user, access_token } = response.data
      login(user, access_token)

      const isSecure = window.location.protocol === 'https:'
      document.cookie = `isLoggedIn=true; Max-Age=900; SameSite=Strict; ${isSecure ? 'Secure; ' : ''}Path=/`

      setSuccess(true)
      toast.success('Account created! Welcome to scholrforge 🎉')
      setTimeout(() => router.push('/feed'), 600)

    } catch (error: any) {
      const status = error?.statusCode ?? error?.response?.status
      const errorMessage =
        status === 409 ? 'Email or username already exists' :
          status === 400 ? (error?.message ?? 'Invalid registration data') :
            status === 429 ? 'Too many attempts. Please wait.' :
              error?.message ?? 'Failed to create account. Please try again.'

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      tabIndex={-1}
      className="text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  )

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit(onSubmit)(e)
          }}
          className="space-y-3.5"
        >
          {/* Full Name */}
          <FormField control={form.control} name="name" render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Field
                  label="Full Name"
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  field={field}
                  disabled={isLoading || success}
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )} />

          {/* Username */}
          <FormField control={form.control} name="username" render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Field
                  label="Username"
                  placeholder="john_dev"
                  icon={<span className="text-muted-foreground/50 text-sm font-bold leading-none">@</span>}
                  field={field}
                  disabled={isLoading || success}
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )} />

          {/* Email */}
          <FormField control={form.control} name="email" render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Field
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  field={field}
                  disabled={isLoading || success}
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )} />

          {/* Password */}
          <FormField control={form.control} name="password" render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div>
                  <Field
                    label="Password"
                    placeholder="••••••••"
                    type={showPw ? 'text' : 'password'}
                    icon={<Lock className="w-4 h-4" />}
                    rightSlot={eyeBtn(showPw, () => setShowPw(!showPw))}
                    field={field}
                    disabled={isLoading || success}
                    error={fieldState.error?.message}
                  />
                  <StrengthMeter password={password} />
                </div>
              </FormControl>
            </FormItem>
          )} />

          {/* Confirm Password */}
          <FormField control={form.control} name="confirmPassword" render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Field
                  label="Confirm Password"
                  placeholder="••••••••"
                  type={showCpw ? 'text' : 'password'}
                  icon={<ShieldCheck className="w-4 h-4" />}
                  rightSlot={
                    <div className="flex items-center gap-1.5">
                      {confirmPassword.length > 0 && (
                        pwMatch
                          ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          : <X className="w-3.5 h-3.5 text-destructive shrink-0" />
                      )}
                      {eyeBtn(showCpw, () => setShowCpw(!showCpw))}
                    </div>
                  }
                  field={field}
                  disabled={isLoading || success}
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )} />

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || success}
            className={`
              w-full h-11 rounded-xl text-sm font-semibold mt-1
              flex items-center justify-center gap-2
              transition-all duration-200 active:scale-[0.98]
              ${success
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25'
              }
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            {success ? (
              <><CheckCircle2 className="w-4 h-4" /> Account created!</>
            ) : isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-[11px] text-muted-foreground/60 shrink-0">or sign up with</span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: <Github className="w-4 h-4" />, label: 'GitHub', fn: () => toast.info('GitHub signup coming soon') },
          { icon: <FcGoogle className="w-4 h-4" />, label: 'Google', fn: () => toast.info('Google signup coming soon') },
        ].map(({ icon, label, fn }) => (
          <button
            key={label}
            type="button"
            onClick={fn}
            disabled={isLoading || success}
            className="h-10 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Sign in */}
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}