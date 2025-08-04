import { create } from 'zustand'
import { advertisementCrud, Advertisement, AdvertisementFilters } from './crud'
import { message } from 'antd'

interface AdvertisementState {
  advertisements: Advertisement[]
  loading: boolean
  listLoading: boolean
  error: string | null
  filters: AdvertisementFilters
  total: number
  currentPage: number
  pageSize: number
  getAdvertisements: (
    filters?: AdvertisementFilters,
    isSearch?: boolean
  ) => Promise<void>
  setFilters: (filters: AdvertisementFilters, isSearch?: boolean) => void
  setPage: (page: number) => void
  createAdvertisement: (
    data: Omit<Advertisement, 'id' | 'createdAt'>
  ) => Promise<void>
  updateAdvertisement: (data: Partial<Advertisement>) => Promise<void>
  deleteAdvertisement: (id: string) => Promise<void>
}

export const useAdvertisementStore = create<AdvertisementState>((set, get) => ({
  advertisements: [],
  loading: false,
  listLoading: false,
  error: null,
  filters: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,

  getAdvertisements: async (
    filters?: AdvertisementFilters,
    isSearch = false
  ) => {
    const currentFilters = filters || get().filters
    if (isSearch) {
      set({ listLoading: true, error: null })
    } else {
      set({ loading: true, error: null })
    }
    try {
      const response = await advertisementCrud.getAdvertisements(currentFilters)
      set({
        advertisements: response.result,
        total: response.count,
        loading: false,
        listLoading: false
      })
    } catch (error) {
      set({
        error: 'Không thể tải danh sách quảng cáo',
        loading: false,
        listLoading: false
      })
      message.error('Không thể tải danh sách quảng cáo')
    }
  },

  setFilters: (filters: AdvertisementFilters, isSearch = false) => {
    const currentState = get()
    const newFilters = {
      ...filters,
      take: 10,
      skip: (currentState.currentPage - 1) * 10
    }
    set({ filters: newFilters })
    get().getAdvertisements(newFilters, isSearch)
  },

  setPage: (page: number) => {
    set({ currentPage: page })
    get().getAdvertisements({
      ...get().filters,
      skip: (page - 1) * 10,
      take: 10
    })
  },

  createAdvertisement: async (
    data: Omit<Advertisement, 'id' | 'createdAt'>
  ) => {
    set({ loading: true, error: null })
    try {
      await advertisementCrud.createAdvertisement(data)
      message.success('Tạo quảng cáo thành công')
      // Fetch updated list after creating with current pagination
      const currentState = get()
      const response = await advertisementCrud.getAdvertisements({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        advertisements: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể tạo quảng cáo', loading: false })
      message.error('Không thể tạo quảng cáo')
    }
  },

  updateAdvertisement: async (data: Partial<Advertisement>) => {
    set({ loading: true, error: null })
    try {
      await advertisementCrud.updateAdvertisement(data)
      message.success('Cập nhật quảng cáo thành công')
      // Fetch updated list after updating with current pagination
      const currentState = get()
      const response = await advertisementCrud.getAdvertisements({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        advertisements: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể cập nhật quảng cáo', loading: false })
      message.error('Không thể cập nhật quảng cáo')
    }
  },

  deleteAdvertisement: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await advertisementCrud.deleteAdvertisement(id)
      message.success('Xóa quảng cáo thành công')
      // Fetch updated list after deleting with current pagination
      const currentState = get()
      const response = await advertisementCrud.getAdvertisements({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        advertisements: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể xóa quảng cáo', loading: false })
      message.error('Không thể xóa quảng cáo')
    }
  }
}))
