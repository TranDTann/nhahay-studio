import { create } from 'zustand'
import { ApiError } from '../categories/crud'
import { TLoginForm } from '@/sections/auth/login/types'
import { TSignupForm } from '@/sections/auth/sign-up/types'
import { authCrud } from './crud'
import { showToast } from '@/utils/toast'

export type TUser = {
  email: string
  id: string
  username: string
  role: EUserRole
}

export enum EUserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

interface AuthState {
  authUser?: TUser
  isLoggingIn: boolean
  isSigningUp: boolean
  errorMessage: string | null
  postDetailPage?: { title: string; id: string }
}

interface AuthActions {
  login: (loginData: TLoginForm) => Promise<void>
  signup: (signtPpData: TSignupForm) => Promise<void>
  loginWithGoogle: (loginData: TLoginForm) => Promise<void>
  getUser: () => Promise<TUser>
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
      set(() => ({
        isSigningUp: false
      }))
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Login failed'
      set({ errorMessage: message, isSigningUp: false })
      throw error
    }
  },
  loginWithGoogle: async (googleAccountData: TLoginForm) => {
    set({ isLoggingIn: true, errorMessage: null })
    try {
      const status = await authCrud.loginWithGoogle(googleAccountData)
      set(() => ({
        isSigningUp: false
      }))
    } catch (error) {
      const message = error?.message ? error.message : 'Login failed!'
      set({ errorMessage: message, isLoggingIn: false })
      showToast.error(message)

      throw error
    }
  },
  getUser: async () => {
    try {
      const user = await authCrud.getUser()
      set(() => ({
        authUser: user
      }))
      return user
    } catch (error) {
      const message = error?.message ? error.message : 'Get user failed!'
      set({ errorMessage: message })
      showToast.error(message)

      throw error
    }
  }
}))
