import { create } from 'zustand'
import { Article, ArticleFilters } from '../article/crud'

export enum EViewMode {
  GRID = 'grid',
  LIST = 'list'
}

interface CategoryPostsState {
  categoryPosts: Article[]
  filters: ArticleFilters
  total: number
  currentPage: number
  pageSize: number
  viewMode: EViewMode
}

export const useCategoryPostsStore = create<CategoryPostsState>((set, get) => ({
  categoryPosts: [],
  filters: {
    isPublished: true
  },
  total: 0,
  currentPage: 1,
  pageSize: 10,
  viewMode: EViewMode.GRID
}))
