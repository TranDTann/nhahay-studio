/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/api/axiosConfig'

export interface Category {
  id?: string
  name: string
  description?: string
  createdAt?: string
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const categoryCrud = {
  getCategories: async () => {
    try {
      const response = await axiosInstance.get<Category[]>('/api/categories')
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to fetch categories',
        error.response?.status
      )
    }
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      const response = await axiosInstance.post<Category>(
        '/api/categories',
        categoryData
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to create category',
        error.response?.status
      )
    }
  },

  updateCategory: async (
    id: string,
    categoryData: Partial<Omit<Category, 'id' | 'createdAt'>>
  ) => {
    try {
      const response = await axiosInstance.put<Category>(
        `/api/categories/${id}`,
        categoryData
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to update category',
        error.response?.status
      )
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await axiosInstance.delete(`/api/categories/${id}`)
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to delete category',
        error.response?.status
      )
    }
  }
}
