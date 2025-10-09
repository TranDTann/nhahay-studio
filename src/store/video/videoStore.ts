import { create } from 'zustand'
import { videoCrud, Video, VideoFilters } from './crud'
import { message } from 'antd'

interface VideoState {
  videos: Video[]
  loading: boolean
  listLoading: boolean
  error: string | null
  filters: VideoFilters
  total: number
  currentPage: number
  pageSize: number
  getVideos: (filters?: VideoFilters, isSearch?: boolean) => Promise<void>
  setFilters: (filters: VideoFilters, isSearch?: boolean) => void
  setPage: (page: number) => void
  createVideo: (data: Omit<Video, 'id' | 'createdAt'>) => Promise<void>
  updateVideo: (data: Partial<Video>) => Promise<void>
  deleteVideo: (id: string) => Promise<void>
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  loading: false,
  listLoading: false,
  error: null,
  filters: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,

  getVideos: async (filters?: VideoFilters, isSearch = false) => {
    const currentFilters = filters || get().filters
    if (isSearch) {
      set({ listLoading: true, error: null })
    } else {
      set({ loading: true, error: null })
    }
    try {
      const response = await videoCrud.getVideos(currentFilters)
      set({
        videos: response.result,
        total: response.count,
        loading: false,
        listLoading: false
      })
    } catch (error) {
      set({
        error: 'Không thể tải danh sách video',
        loading: false,
        listLoading: false
      })
      message.error('Không thể tải danh sách video')
    }
  },

  setFilters: (filters: VideoFilters, isSearch = false) => {
    const currentState = get()
    const newFilters = {
      ...filters,
      take: 10,
      skip: (currentState.currentPage - 1) * 10
    }
    set({ filters: newFilters })
    get().getVideos(newFilters, isSearch)
  },

  setPage: (page: number) => {
    set({ currentPage: page })
    get().getVideos({
      ...get().filters,
      skip: (page - 1) * 10,
      take: 10
    })
  },

  createVideo: async (data: Omit<Video, 'id' | 'createdAt'>) => {
    set({ loading: true, error: null })
    try {
      await videoCrud.createVideo(data)
      message.success('Tạo video thành công')
      // Fetch updated list after creating with current pagination
      const currentState = get()
      const response = await videoCrud.getVideos({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        videos: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể tạo video', loading: false })
      message.error('Không thể tạo video')
    }
  },

  updateVideo: async (data: Partial<Video>) => {
    set({ loading: true, error: null })
    try {
      await videoCrud.updateVideo(data)
      message.success('Cập nhật video thành công')
      // Fetch updated list after updating with current pagination
      const currentState = get()
      const response = await videoCrud.getVideos({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        videos: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể cập nhật video', loading: false })
      message.error('Không thể cập nhật video')
    }
  },

  deleteVideo: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await videoCrud.deleteVideo(id)
      message.success('Xóa video thành công')
      // Fetch updated list after deleting with current pagination
      const currentState = get()
      const response = await videoCrud.getVideos({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        videos: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Không thể xóa video', loading: false })
      message.error('Không thể xóa video')
    }
  }
}))
