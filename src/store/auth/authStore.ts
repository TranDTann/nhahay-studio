import { create } from 'zustand'
import { ApiError } from '../categories/crud'
import { TLoginForm } from '@/sections/auth/login/types'
import { TSignupForm } from '@/sections/auth/sign-up/types'
import { authCrud } from './crud'
import { showToast } from '@/utils/toast'

interface AuthState {
  authUser?: { name: string }
  isLoggingIn: boolean
  isSigningUp: boolean
  errorMessage: string | null
}

interface AuthActions {
  login: (loginData: TLoginForm) => Promise<void>
  signup: (signtPpData: TSignupForm) => Promise<void>
  // googleLogin: (loginData: TLoginForm) => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  errorMessage: null,
  isLoggingIn: false,
  isSigningUp: false,

  login: async (loginData: TLoginForm) => {
    set({ isLoggingIn: true, errorMessage: null })
    try {
      await authCrud.login(loginData)
      set(() => ({
        loading: false,
        isLoggingIn: true
      }))
    } catch (error) {
      const message = error?.message ? error.message : 'Login failed!'
      set({ errorMessage: message, isLoggingIn: false })
      showToast.error(message)

      throw error
    }
  },
  signup: async (singUpData: TLoginForm) => {
    set({ isSigningUp: true, errorMessage: null })
    try {
      const status = await authCrud.signup(singUpData)
      console.log(status)
      set(() => ({
        isSigningUp: false
      }))
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Login failed'
      set({ errorMessage: message, isSigningUp: false })
      throw error
    }
  }
}))
