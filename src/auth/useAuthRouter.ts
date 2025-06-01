import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import paths from '../routes/paths'
import useAuth from './useAuth'
import useAuthStore from './useAuthStore'

export default function useAuthRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const [authComplete, setAuthComplete] = useState<boolean>(true)
  useAuth(setAuthComplete)

  const { authUser, userLoading } = useAuthStore((state) => state)

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
    if (!authComplete || userLoading || !authUser) return
    // signOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, userLoading, pathname, authComplete])
}
