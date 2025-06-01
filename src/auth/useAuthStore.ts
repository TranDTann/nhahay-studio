import { create } from 'zustand'

type AuthState = {
  authUser?: { name: string }
  userLoading: boolean
  isLoggingIn: boolean
  isSigningUp: boolean
  deviceToken: string | null
}

const useAuthStore = create<AuthState>(() => ({
  firebaseUser: null,
  firebaseUserLoading: true,
  authUser: undefined,
  userLoading: false,
  isLoggingIn: false,
  isSigningUp: false,
  deviceToken: null
}))

export default useAuthStore

export const loginNhaHayStudio = async (): Promise<void> => {}
