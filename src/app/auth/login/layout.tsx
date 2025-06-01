import React from 'react'
import LoginLayout from '@/layout/auth/LoginLayout'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <LoginLayout>{children}</LoginLayout>
}

export default Layout
