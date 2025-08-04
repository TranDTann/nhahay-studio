/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/api/axiosConfig'

export type TContactInfo = {
  userName: string
  phone: string
  email: string
  address: string
  note: string
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
  }
}
