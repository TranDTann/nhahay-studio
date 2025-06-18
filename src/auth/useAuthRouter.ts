import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAuth from './useAuth'
import { useAuthStore } from '@/store/auth/authStore'

export default function useAuthRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const [authComplete, setAuthComplete] = useState<boolean>(true)
  useAuth(setAuthComplete)

  const { authUser } = useAuthStore((state) => state)

  useEffect(() => {
    const checkFirebaseUser = () => {
      // if (!authComplete) return
    }

    setTimeout(() => {
      checkFirebaseUser()
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authComplete])

  useEffect(() => {
    if (!authComplete || !authUser) return
    // signOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, pathname, authComplete])
}
