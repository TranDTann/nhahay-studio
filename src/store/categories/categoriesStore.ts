import { create } from 'zustand'
import { categoryCrud, Category, ApiError } from './crud'

interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
  getCategories: () => Promise<void>
  createCategory: (
    categoryData: Omit<Category, 'id' | 'createdAt'>
  ) => Promise<void>
  updateCategory: (
    id: string,
    categoryData: Partial<Omit<Category, 'id' | 'createdAt'>>
  ) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  getCategories: async () => {
    set({ loading: true, error: null })
    try {
      const data = await categoryCrud.getCategories()
      set({ categories: data, loading: false })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to fetch categories'
      set({ error: message, loading: false })
      throw error
    }
  },

  createCategory: async (categoryData) => {
    set({ loading: true, error: null })
    try {
      const newCategory = await categoryCrud.createCategory(categoryData)
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false
      }))
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to create category'
      set({ error: message, loading: false })
      throw error
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ loading: true, error: null })
    try {
      const updatedCategory = await categoryCrud.updateCategory(
        id,
        categoryData
      )
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        loading: false
      }))
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to update category'
      set({ error: message, loading: false })
      throw error
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null })
    try {
      await categoryCrud.deleteCategory(id)
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false
      }))
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to delete category'
      set({ error: message, loading: false })
      throw error
    }
  }
}))
