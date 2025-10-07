import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export interface User {
  id?: string
  username: string
  email: string
  role: string
  phoneNumber?: string
  isActive: string
  createdTime?: string
  updatedTime?: string
  createdBy?: string
  updatedBy?: string
}

export interface UserFilters {
  search?: string
  sort?: string
  SortDir?: number
  take?: number
  skip?: number
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const userCrud = {
  getUsers: async (filters?: UserFilters) => {
    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.SortDir !== undefined)
        params.append('SortDir', filters.SortDir.toString())
      if (filters?.take) params.append('take', filters.take.toString())
      if (filters?.skip) params.append('skip', filters.skip.toString())

      const url = `/api/user/list/user${
        params.toString() ? `?${params.toString()}` : ''
      }`
      const response = await axiosInstance.get<{
        result: User[]
        count: number
      }>(url)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  },

  updateUser: async (data: Partial<User>) => {
    try {
      const response = await axiosInstance.put<User>(`/api/user`, data)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to update user',
        error.response?.status
      )
    }
  },

  deleteUser: async (id: string) => {
    try {
      await axiosInstance.delete(`/api/user/${id}`)
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to delete user',
        error.response?.status
      )
    }
  }
}
