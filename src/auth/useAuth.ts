import { useCallback, useEffect, useRef } from 'react'
import { useFirstLoad } from '@/hooks/useFirstLoad'
import { useAuthStore } from '@/store/auth/authStore'

const useAuth = (onAuthComplete) => {
  const { isLoggingIn, isSigningUp } = useAuthStore((state) => state)
  const isLoggingInRef = useRef<boolean>(null)
  const isFirstLoad = useFirstLoad()

  const unsubscribe = useCallback(() => {
    useAuthStore.setState({
      authUser: null
    })
  }, [])

  const subscribe = useCallback(() => {
    if (isFirstLoad) {
      useAuthStore.setState({
        authUser: null
      })
    }

    onAuthComplete?.(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAuthComplete])

  // listen to Firebase state change
  useEffect(() => {
    if (isLoggingIn || isSigningUp) return
    subscribe()
    return () => {
      unsubscribe()
    }
  }, [subscribe, unsubscribe, isLoggingIn, isSigningUp])

  useEffect(() => {
    isLoggingInRef.current = isLoggingIn
  }, [isLoggingIn])
}

export default useAuth
