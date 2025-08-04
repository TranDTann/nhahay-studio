import { useFirstLoad } from '@/hooks/useFirstLoad'
import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'

const useAuth = (onAuthComplete?: Dispatch<SetStateAction<boolean>>) => {
  const { isLoggingIn, isSigningUp, getUser, authUser } = useAuthStore(
    (state) => state
  )
  const isLoggingInRef = useRef<boolean>(null)
  const isFirstLoad = useFirstLoad()
  const router = useRouter()

  const logout = () => {
    Cookies.remove('token')
    router.push(paths.auth.login)
    useAuthStore.setState({ authUser: null })
  }

  const unsubscribe = useCallback(() => {
    Cookies.remove('token')
    useAuthStore.setState({ authUser: null })
  }, [])

  const getUserInfo = async () => {
    try {
      const user = await getUser()
      useAuthStore.setState({ authUser: user })
    } catch (err) {
      useAuthStore.setState({ authUser: null })
      logout()
    }
  }

  const subscribe = useCallback(() => {
    const auth_token =
      typeof window !== 'undefined' ? Cookies.get('token') : null

    if (isFirstLoad && !auth_token) {
      useAuthStore.setState({ authUser: null })
      return
    }

    if (!authUser && auth_token) {
      getUserInfo()
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
