import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAuth from './useAuth'
import { useAuthStore } from '@/store/auth/authStore'
import paths from '@/routes/paths'
import Cookies from 'js-cookie'

export default function useAuthRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const [authComplete, setAuthComplete] = useState<boolean>(false)

  useAuth(setAuthComplete)

  // const { authUser } = useAuthStore((state) => state)

  useEffect(() => {
    if (!authComplete) return
    const token = Cookies.get('token')

    const isLoginPage = pathname === paths.auth.login
    const isAuthRequiredPage = ![paths.auth.login, paths.auth.signup].includes(
      pathname
    )
    if (pathname === '/' && token) {
      router.push(paths.dashboard.home())
      return
    }

    if (!token && isAuthRequiredPage) {
      // if (!authUser && isAuthRequiredPage) {
      router.replace(paths.auth.login)
      return
    }

    if (token && isLoginPage) {
      // if (authUser && isLoginPage) {
      router.replace(paths.dashboard.home())
    }
  }, [pathname, authComplete, router])
  // }, [authUser, pathname, authComplete, router])
}
