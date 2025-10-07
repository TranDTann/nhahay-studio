import { create } from 'zustand'
import { userCrud, User, UserFilters } from './crud'
import { message } from 'antd'

interface UserState {
  users: User[]
  loading: boolean
  listLoading: boolean
  error: string | null
  filters: UserFilters
  total: number
  currentPage: number
  pageSize: number
  getUsers: (filters?: UserFilters, isSearch?: boolean) => Promise<void>
  setFilters: (filters: UserFilters, isSearch?: boolean) => void
  setPage: (page: number) => void
  updateUser: (data: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  listLoading: false,
  error: null,
  filters: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,

  getUsers: async (filters?: UserFilters, isSearch = false) => {
    const currentFilters = filters || get().filters
    if (isSearch) {
      set({ listLoading: true, error: null })
    } else {
      set({ loading: true, error: null })
    }
    try {
      const response = await userCrud.getUsers(currentFilters)
      set({
        users: response.result,
        total: response.count,
        loading: false,
        listLoading: false
      })
    } catch (error) {
      set({
        error: 'Không thể tải danh sách người dùng',
        loading: false,
        listLoading: false
      })
      message.error('Không thể tải danh sách người dùng')
    }
  },

  setFilters: (filters: UserFilters, isSearch = false) => {
    const currentState = get()
    const newFilters = {
      ...filters,
      take: 10,
      skip: (currentState.currentPage - 1) * 10
    }
    set({ filters: newFilters })
    get().getUsers(newFilters, isSearch)
  },

  setPage: (page: number) => {
    set({ currentPage: page })
    get().getUsers({
      ...get().filters,
      skip: (page - 1) * 10,
      take: 10
    })
  },

  updateUser: async (data: Partial<User>) => {
    set({ loading: true, error: null })
    try {
      await userCrud.updateUser(data)
      message.success('Cập nhật người dùng thành công')
      // Fetch updated list after updating with current pagination
      const currentState = get()
      const response = await userCrud.getUsers({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        users: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể cập nhật người dùng', loading: false })
      message.error('Không thể cập nhật người dùng')
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await userCrud.deleteUser(id)
      message.success('Xóa người dùng thành công')
      // Fetch updated list after deleting with current pagination
      const currentState = get()
      const response = await userCrud.getUsers({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        users: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể xóa người dùng', loading: false })
      message.error('Không thể xóa người dùng')
    }
  }
}))
