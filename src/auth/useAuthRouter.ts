import paths from '@/routes/paths'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useAuth from './useAuth'

export default function useAuthRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const [authComplete, setAuthComplete] = useState<boolean>(false)
  useAuth(setAuthComplete)
  const token = Cookies.get('token')
  const isAuthRequiredPage = ![paths.auth.login, paths.auth.signup].includes(
    pathname
  )
  const isLoginPage = pathname === paths.auth.login
  const handleNavigate = () => {
    if (pathname === '/' && token) {
      router.push(paths.dashboard.home())
      return
    }
    if (!token && isAuthRequiredPage) {
      router.replace(paths.auth.login)
      return
    }
    if (token && isLoginPage) {
      router.replace(paths.dashboard.home())
    }
  }
  useEffect(() => {
    handleNavigate()
  }, [])
  useEffect(() => {
    if (!authComplete) return
    handleNavigate()
  }, [pathname, authComplete, router])
}
