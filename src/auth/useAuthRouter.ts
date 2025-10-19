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

  const publicPaths = [paths.dashboard.home(), paths.dashboard.root()]

  const isAuthRequiredPage =
    !publicPaths.includes(pathname) &&
    !pathname.startsWith('/category/') &&
    !pathname.startsWith('/post/') &&
    !pathname.startsWith('/auth/sign-up')

  const handleNavigate = () => {
    if (!token && isAuthRequiredPage) {
      router.replace(paths.auth.login)
    }

    if (pathname === '/') {
      router.push(paths.dashboard.home())
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
