'use client'

import React from 'react'
import useAuthStore from '@/auth/useAuthStore'
import { LoadingScreen } from '@/components/LoadingScreen'
import paths from '@/routes/paths'
import { usePathname } from 'next/navigation'
import './style.css'
import useAuthRouter from '@/auth/useAuthRouter'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthRouter()

  const pathname = usePathname()
  const { userLoading } = useAuthStore((state) => state)

  let content: React.ReactNode = null

  if (userLoading && !pathname.includes(paths.auth.root)) {
    content = <LoadingScreen />
  } else {
    content = children
  }

  return <main className="main-background">{content}</main>
}

export default HomeLayout
