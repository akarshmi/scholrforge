import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In - scholrforge',
  description: 'Sign in to your scholrforge account',
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue to scholrforge"
    >
      <LoginForm />
    </AuthShell>
  )
}
