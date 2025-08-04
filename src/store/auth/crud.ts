/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/api/axiosConfig'
import { TLoginForm } from '@/sections/auth/login/types'
import { TSignupForm } from '@/sections/auth/sign-up/types'
import Cookies from 'js-cookie'
import { TUser } from './authStore'

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const authCrud = {
  login: async (loginFormData: TLoginForm) => {
    try {
      const response = await axiosInstance.post<TLoginForm[]>(
        '/api/account/login',
        loginFormData
      )
      const token = response.data
      if (token) {
        Cookies.set('token', token, {
          expires: loginFormData.remember ? 7 : undefined,
          secure: false,
          // secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax'
        })
      }

      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data || 'Login failed',
        error.response?.status
      )
    }
  },

  signup: async (signUpFormData: TSignupForm) => {
    try {
      const response = await axiosInstance.post<TSignupForm[]>(
        '/api/account/admin/register',
        signUpFormData
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Signup failed',
        error.response?.status
      )
    }
  },

  loginWithGoogle: async (googleAccountData: TLoginForm) => {
    try {
      const response = await axiosInstance.post<TLoginForm[]>(
        '/api/auth/google-login',
        googleAccountData
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Login with google failed',
        error.response?.status
      )
    }
  },

  getUser: async () => {
    try {
      const token = Cookies.get('token')
      const headers: Record<string, string> = {
        Accept: 'application/json'
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await axiosInstance.get<TUser>('/api/user', { headers })
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data || 'Get user failed',
        error.response?.status
      )
    }
  }
}
