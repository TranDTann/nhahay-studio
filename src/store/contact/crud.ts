/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/api/axiosConfig'

export type TContactInfo = {
  userName: string
  phone: string
  email: string
  note: string
}

export type TContact = TContactInfo & { id: string }

export type TContactListResponse = {
  result: TContact[]
  count: number
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const contactCrud = {
  sendContact: async (contactInfo: TContactInfo) => {
    try {
      const response = await axiosInstance.post<TContactInfo>(
        '/api/customercontact',
        contactInfo
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Gửi thông tin thất bại',
        error.response?.status
      )
    }
  },
  getContacts: async (page = 1, take = 10, search?: string) => {
    try {
      const skip = page > 1 ? (page - 1) * take : 0
      const params = new URLSearchParams()
      params.append('take', String(take))
      params.append('skip', String(skip))
      if (search && search.trim()) params.append('search', search.trim())
      const url = `/api/customercontact?${params.toString()}`
      const response = await axiosInstance.get<TContactListResponse>(url)
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Lấy danh sách liên hệ thất bại',
        error.response?.status
      )
    }
  },
  getContactById: async (id: string) => {
    try {
      const response = await axiosInstance.get<TContact>(
        `/api/customercontact/${id}`
      )
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Lấy thông tin liên hệ thất bại',
        error.response?.status
      )
    }
  }
}
