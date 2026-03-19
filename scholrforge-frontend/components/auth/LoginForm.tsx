'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Github, Loader2, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── Animated input field ─────────────────────────────────────────────────────

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
  const [focused, setFocused] = useState(false)

  return (
    <div className="space-y-1.5">
      <motion.label
        className="block text-[11px] font-semibold tracking-widest uppercase"
        animate={{ color: error ? 'hsl(var(--destructive))' : focused ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
        transition={{ duration: 0.15 }}
      >
        {label}
      </motion.label>

      <motion.div
        animate={{
          boxShadow: error
            ? '0 0 0 1.5px hsl(var(--destructive) / 0.5), 0 2px 8px hsl(var(--destructive) / 0.1)'
            : focused
              ? '0 0 0 1.5px hsl(var(--primary) / 0.6), 0 4px 16px hsl(var(--primary) / 0.12)'
              : '0 0 0 1px hsl(var(--border) / 0.6)',
        }}
        transition={{ duration: 0.2 }}
        className={`
          flex items-center gap-3 px-4 h-12 rounded-xl
          bg-muted/30 backdrop-blur-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <motion.span
          animate={{ color: error ? 'hsl(var(--destructive))' : focused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.5)' }}
          transition={{ duration: 0.15 }}
          className="shrink-0"
        >
          {icon}
        </motion.span>

        <input
          {...field}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); field.onBlur?.() }}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none min-w-0 font-medium"
        />
        {rightSlot}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-[11px] text-destructive flex items-center gap-1.5 font-medium"
          >
            <span className="w-1 h-1 rounded-full bg-destructive inline-block shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

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
      const response = await api.post('/api/auth/login', {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      })

      const { user, access_token } = response.data
      login(user, access_token)

      const isSecure = window.location.protocol === 'https:'
      document.cookie = `isLoggedIn=true; Max-Age=900; SameSite=Strict; ${isSecure ? 'Secure; ' : ''}Path=/`

      setSuccess(true)
      toast.success(`Welcome back, ${user.username}!`)
      addNotification({ message: 'Welcome back!', type: 'success' })

      const params = new URLSearchParams(window.location.search)
      const redirectTo = params.get('from') ?? '/feed'

      setTimeout(() => router.push(redirectTo), 600)

    } catch (error: any) {
      const status = error?.statusCode ?? error?.response?.status
      const errorMessage =
        status === 401 ? 'Invalid email or password' :
          status === 403 ? 'Account is locked or disabled' :
            status === 429 ? 'Too many attempts. Please wait.' :
              error?.message ??
              error?.response?.data?.message ??
              (!error?.response && error?.request ? 'Cannot connect to server' : 'Failed to login. Please try again.')

      toast.error(errorMessage)
      addNotification({ message: errorMessage, type: 'error' })

      // Shake animation on error
      form.setError('email', {})
      form.setError('password', {})
      setTimeout(() => {
        form.clearErrors('email')
        form.clearErrors('password')
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log('form submitted') 
            form.handleSubmit(onSubmit)(e)
          }}
          className="space-y-4"
        >
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
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
                      disabled={isLoading || success}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
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
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          whileTap={{ scale: 0.85 }}
                          className="text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0 p-0.5"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                      }
                      field={field}
                      disabled={isLoading || success}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          {/* Remember + Forgot */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <motion.div
                    onClick={() => field.onChange(!field.value)}
                    whileTap={{ scale: 0.85 }}
                    animate={{
                      backgroundColor: field.value ? 'hsl(var(--primary))' : 'transparent',
                      borderColor: field.value ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.8)',
                    }}
                    className="w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 transition-shadow group-hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                  >
                    <AnimatePresence>
                      {field.value && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                    Remember me
                  </span>
                </label>
              )}
            />
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary/70 hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.button
              type="submit"
              disabled={isLoading || success}
              whileHover={!isLoading && !success ? { scale: 1.01 } : {}}
              whileTap={!isLoading && !success ? { scale: 0.98 } : {}}
              className={`
                relative w-full h-12 rounded-xl text-sm font-semibold overflow-hidden
                flex items-center justify-center gap-2
                transition-all duration-300
                disabled:cursor-not-allowed
                ${success
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  : 'bg-primary text-primary-foreground hover:brightness-110 active:brightness-95 shadow-lg shadow-primary/20'
                }
              `}
            >
              {/* Shimmer effect */}
              {!success && !isLoading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
                />
              )}

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Signed in! Redirecting...
                  </motion.span>
                ) : isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </form>
      </Form>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative flex items-center gap-3"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/60 to-border/60" />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/50 shrink-0">
          or
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border/60 to-border/60" />
      </motion.div>

      {/* Social buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        {[
          {
            icon: <Github className="w-4 h-4" />,
            label: 'GitHub',
            handler: () => toast.info('GitHub login coming soon'),
          },
          {
            icon: <FcGoogle className="w-4 h-4" />,
            label: 'Google',
            handler: () => toast.info('Google login coming soon'),
          },
        ].map(({ icon, label, handler }) => (
          <motion.button
            key={label}
            type="button"
            onClick={handler}
            disabled={isLoading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="
              h-11 rounded-xl
              flex items-center justify-center gap-2.5
              text-sm font-semibold text-muted-foreground
              border border-border/60 bg-muted/20
              hover:bg-muted/50 hover:border-border hover:text-foreground
              transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {icon}
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* Sign up */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-center text-xs text-muted-foreground"
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline"
        >
          Create one free
        </Link>
      </motion.p>
    </motion.div>
  )
}