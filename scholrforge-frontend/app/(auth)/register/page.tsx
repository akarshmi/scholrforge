import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Sign Up - scholrforge',
  description: 'Create a new scholrforge account',
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Join scholrforge"
      subtitle="Create an account to start showcasing your work"
    >
      <RegisterForm />
    </AuthShell>
  )
}
