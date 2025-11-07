import { create } from 'zustand'
import { categoryCrud, Category, CategoryFilters } from './crud'
import { message } from 'antd'

interface CategoriesState {
  categories: Category[]
  loading: boolean
  listLoading: boolean
  error: string | null
  filters: CategoryFilters
  total: number
  currentPage: number
  pageSize: number
  getCategories: (
    filters?: CategoryFilters,
    isSearch?: boolean
  ) => Promise<void>
  setFilters: (filters: CategoryFilters, isSearch?: boolean) => void
  setPage: (page: number) => void
  createCategory: (data: {
    name: string
    description?: string
    urlThumbnail?: string
    bannerIds?: string[]
  }) => Promise<void>
  updateCategory: (
    id: string,
    data: {
      name: string
      description?: string
      urlThumbnail?: string
      bannerIds?: string[]
    }
  ) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  listLoading: false,
  error: null,
  filters: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,

  getCategories: async (filters?: CategoryFilters, isSearch = false) => {
    const currentFilters = filters || get().filters
    if (isSearch) {
      set({ listLoading: true, error: null })
    } else {
      set({ loading: true, error: null })
    }
    try {
      const response = await categoryCrud.getCategory(currentFilters)
      set({
        categories: response.result,
        total: response.count,
        loading: false,
        listLoading: false
      })
    } catch (error) {
      set({
        error: 'Failed to fetch categories',
        loading: false,
        listLoading: false
      })
      message.error('Failed to fetch categories')
    }
  },

  setFilters: (filters: CategoryFilters, isSearch = false) => {
    const currentState = get()
    const newFilters = {
      ...filters,
      take: 10,
      skip: (currentState.currentPage - 1) * 10
    }
    set({ filters: newFilters })
    get().getCategories(newFilters, isSearch)
  },

  setPage: (page: number) => {
    set({ currentPage: page })
    get().getCategories({
      ...get().filters,
      skip: (page - 1) * 10,
      take: 10
    })
  },

  createCategory: async (data: {
    name: string
    description?: string
    urlThumbnail?: string
    bannerIds?: string[]
  }) => {
    set({ loading: true, error: null })
    try {
      await categoryCrud.createCategory(data)
      message.success('Category created successfully')
      // Fetch updated list after creating with current pagination
      const currentState = get()
      const response = await categoryCrud.getCategory({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        categories: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to create category', loading: false })
      message.error('Failed to create category')
    }
  },

  updateCategory: async (
    id: string,
    data: {
      name: string
      description?: string
      urlThumbnail?: string
      bannerIds?: string[]
    }
  ) => {
    set({ loading: true, error: null })
    try {
      await categoryCrud.updateCategory(id, data)
      message.success('Category updated successfully')
      // Fetch updated list after updating with current pagination
      const currentState = get()
      const response = await categoryCrud.getCategory({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        categories: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to update category', loading: false })
      message.error('Failed to update category')
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await categoryCrud.deleteCategory(id)
      message.success('Category deleted successfully')
      // Fetch updated list after deleting with current pagination
      const currentState = get()
      const response = await categoryCrud.getCategory({
        ...currentState.filters,
        take: currentState.pageSize,
        skip: (currentState.currentPage - 1) * currentState.pageSize
      })
      set({
        categories: response.result,
        total: response.count,
        loading: false
      })
    } catch (error) {
      set({ error: 'Failed to delete category', loading: false })
      message.error('Failed to delete category')
    }
  }
}))
