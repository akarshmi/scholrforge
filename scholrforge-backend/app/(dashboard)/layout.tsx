import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
