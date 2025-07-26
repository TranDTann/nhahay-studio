import { create } from 'zustand'
import { tagCrud, Tag, TagFilters } from './crud'
import { message } from 'antd'

interface TagsState {
  tags: Tag[]
  loading: boolean
  error: string | null
  filters: TagFilters
  total: number
  currentPage: number
  pageSize: number
  getTags: (filters?: TagFilters) => Promise<void>
  setFilters: (filters: TagFilters) => void
  setPage: (page: number) => void
  createTag: (data: { name: string; description?: string }) => Promise<void>
  updateTag: (data: {
    id: string
    name: string
    description?: string
  }) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  loading: false,
  error: null,
  filters: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,

  getTags: async (filters?: TagFilters) => {
    const currentFilters = filters || get().filters
    set({ loading: true, error: null })
    try {
      const response = await tagCrud.getTags(currentFilters)
      set({
        tags: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to fetch tags', loading: false })
      message.error('Failed to fetch tags')
    }
  },

  setFilters: (filters: TagFilters) => {
    const currentState = get()
    const newFilters = {
      ...filters,
      take: 10,
      skip: (currentState.currentPage - 1) * 10
    }
    set({ filters: newFilters })
    get().getTags(newFilters)
  },

  setPage: (page: number) => {
    set({ currentPage: page })
    get().getTags({
      ...get().filters,
      skip: (page - 1) * 10,
      take: 10
    })
  },

  createTag: async (data: { name: string; description?: string }) => {
    set({ loading: true, error: null })
    try {
      await tagCrud.createTag(data)
      message.success('Tag created successfully')
      // Fetch updated list after creating with current pagination
      const currentState = get()
      const response = await tagCrud.getTags({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        tags: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to create tag', loading: false })
      message.error('Failed to create tag')
    }
  },

  updateTag: async (data: {
    id: string
    name: string
    description?: string
  }) => {
    set({ loading: true, error: null })
    try {
      await tagCrud.updateTag(data)
      message.success('Tag updated successfully')
      // Fetch updated list after updating with current pagination
      const currentState = get()
      const response = await tagCrud.getTags({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        tags: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to update tag', loading: false })
      message.error('Failed to update tag')
    }
  },

  deleteTag: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await tagCrud.deleteTag(id)
      message.success('Tag deleted successfully')
      // Fetch updated list after deleting with current pagination
      const currentState = get()
      const response = await tagCrud.getTags({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        tags: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to delete tag', loading: false })
      message.error('Failed to delete tag')
    }
  }
}))
