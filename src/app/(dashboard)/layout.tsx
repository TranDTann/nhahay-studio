'use client'

import { DashboardLayout } from '@/layout/dashboard'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
