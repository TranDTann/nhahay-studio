import { message } from 'antd'
import { create } from 'zustand'
import { contactCrud, TContactInfo } from './crud'

interface ContactState {
  loading: boolean
  error: string | null
  sendContact: (contactInfo: TContactInfo) => Promise<void>
}

export const useContactStore = create<ContactState>((set, get) => ({
  loading: false,
  error: null,
  sendContact: async (contactInfo: TContactInfo) => {
    set({ loading: true, error: null })
    try {
      await contactCrud.sendContact(contactInfo)
      message.success('Thông tin của bạn đã được gửi đến Admin')
      set({
        loading: false
      })
    } catch (error) {
      const errorMessage = 'Gửi thông tin thất bại'
      set({ error: errorMessage, loading: false })
      message.error(errorMessage)
    }
  }
}))
