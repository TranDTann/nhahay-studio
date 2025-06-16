import axiosInstance from '@/api/axiosConfig'
import { handleApiError } from '@/api/error'

export const imageCrud = {
  createImage: async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/api/image', formData)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  detailImage: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/image/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  deleteImage: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/image/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  }
}
