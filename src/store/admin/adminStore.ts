import { create } from 'zustand'

interface AdminState {
  admins: any[]
  loading: boolean
  error: string | null
  getAdmins: () => Promise<void>
  createAccount: (adminData: any) => Promise<void>
  updateAccount: (id: string, adminData: any) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
}

export const useAdminStore = create<AdminState>((set) => ({
  admins: [],
  loading: false,
  error: null,

  getAdmins: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/admins')
      const data = await response.json()
      set({ admins: data, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch admins', loading: false })
    }
  },

  createAccount: async (adminData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      })
      const newAdmin = await response.json()
      set((state) => ({ admins: [...state.admins, newAdmin], loading: false }))
    } catch (error) {
      set({ error: 'Failed to create admin', loading: false })
    }
  },

  updateAccount: async (id, adminData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      })
      const updatedAdmin = await response.json()
      set((state) => ({
        admins: state.admins.map((admin) =>
          admin.id === id ? updatedAdmin : admin
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update admin', loading: false })
    }
  },

  deleteAccount: async (id) => {
    set({ loading: true, error: null })
    try {
      await fetch(`/api/admins/${id}`, { method: 'DELETE' })
      set((state) => ({
        admins: state.admins.filter((admin) => admin.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete admin', loading: false })
    }
  }
}))
