import { create } from 'zustand'
import { bannerCrud, Banner, BannerFilters } from './crud'
import { message } from 'antd'

interface BannerState {
  banners: Banner[]
  loading: boolean
  error: string | null
  filters: BannerFilters
  total: number
  currentPage: number
  pageSize: number
  getBanners: (filters?: BannerFilters) => Promise<void>
  setFilters: (filters: BannerFilters) => void
  setPage: (page: number) => void
  createBanner: (data: Omit<Banner, 'id' | 'createdAt'>) => Promise<void>
  updateBanner: (data: Partial<Banner>) => Promise<void>
  deleteBanner: (id: string) => Promise<void>
}

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  loading: false,
  error: null,
  filters: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,

  getBanners: async (filters?: BannerFilters) => {
    const currentFilters = filters || get().filters
    set({ loading: true, error: null })
    try {
      const response = await bannerCrud.getBanners(currentFilters)
      set({
        banners: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to fetch banners', loading: false })
      message.error('Failed to fetch banners')
    }
  },

  setFilters: (filters: BannerFilters) => {
    const currentState = get()
    const newFilters = {
      ...filters,
      take: 10,
      skip: (currentState.currentPage - 1) * 10
    }
    set({ filters: newFilters })
    get().getBanners(newFilters)
  },

  setPage: (page: number) => {
    set({ currentPage: page })
    get().getBanners({
      ...get().filters,
      skip: (page - 1) * 10,
      take: 10
    })
  },

  createBanner: async (data: Omit<Banner, 'id' | 'createdAt'>) => {
    set({ loading: true, error: null })
    try {
      await bannerCrud.createBanner(data)
      message.success('Banner created successfully')
      // Fetch updated list after creating with current pagination
      const currentState = get()
      const response = await bannerCrud.getBanners({
        ...currentState.filters,
        take: 10,
        skip: (currentState.currentPage - 1) * 10
      })
      set({
        banners: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to create banner', loading: false })
      message.error('Failed to create banner')
    }
  },

  updateBanner: async (data: Partial<Banner>) => {
    set({ loading: true, error: null })
    try {
      await bannerCrud.updateBanner(data)
      message.success('Banner updated successfully')
      // Fetch updated list after updating with current pagination
      const currentState = get()
      const response = await bannerCrud.getBanners({
        ...currentState.filters,
        take: 10,
        skip: (currentState.currentPage - 1) * 10
      })
      set({
        banners: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to update banner', loading: false })
      message.error('Failed to update banner')
    }
  },

  deleteBanner: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await bannerCrud.deleteBanner(id)
      message.success('Banner deleted successfully')
      // Fetch updated list after deleting with current pagination
      const currentState = get()
      const response = await bannerCrud.getBanners({
        ...currentState.filters,
        take: 10,
        skip: (currentState.currentPage - 1) * 10
      })
      set({
        banners: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to delete banner', loading: false })
      message.error('Failed to delete banner')
    }
  }
}))
