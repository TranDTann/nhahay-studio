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
      router.replace(paths.auth.login)
      return
    }

    if (token && isLoginPage) {
      router.replace(paths.dashboard.home())
    }
  }, [pathname, authComplete, router])
}
