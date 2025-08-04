'use client'

import useAuthRouter from '@/auth/useAuthRouter'
import { LoadingScreen } from '@/components/LoadingScreen'
import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'
import { usePathname } from 'next/navigation'
import React from 'react'
import './style.css'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthRouter()

  const pathname = usePathname()
  const { isLoggingIn, isSigningUp } = useAuthStore((state) => state)

  let content: React.ReactNode = null

  const isLoadingPage =
    ((isLoggingIn || isSigningUp) && !pathname.includes(paths.auth.root)) ||
    pathname === '/'

  if (isLoadingPage) {
    content = <LoadingScreen />
  } else {
    content = children
  }

  return <main className="main-background">{content}</main>
}

export default HomeLayout
