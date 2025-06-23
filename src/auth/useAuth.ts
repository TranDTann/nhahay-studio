import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import { useFirstLoad } from '@/hooks/useFirstLoad'
import { useAuthStore } from '@/store/auth/authStore'
import Cookies from 'js-cookie'

const useAuth = (onAuthComplete?: Dispatch<SetStateAction<boolean>>) => {
  const { isLoggingIn, isSigningUp } = useAuthStore((state) => state)
  const isLoggingInRef = useRef<boolean>(null)
  const isFirstLoad = useFirstLoad()

  const unsubscribe = useCallback(() => {
    Cookies.remove('token')
    useAuthStore.setState({ authUser: null })
  }, [])

  const subscribe = useCallback(() => {
    const auth_token =
      typeof window !== 'undefined' ? Cookies.get('token') : null

    if (isFirstLoad && !auth_token) {
      useAuthStore.setState({ authUser: null })
    }

    onAuthComplete?.(true)
  }, [onAuthComplete])

  useEffect(() => {
    if (isLoggingIn || isSigningUp) return
    subscribe()
  }, [subscribe, isLoggingIn, isSigningUp])

  useEffect(() => {
    isLoggingInRef.current = isLoggingIn
  }, [isLoggingIn])

  return { logout: unsubscribe }
}

export default useAuth
