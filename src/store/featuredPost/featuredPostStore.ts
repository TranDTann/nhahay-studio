import { create } from 'zustand'
import { Article } from '../article/crud'

interface FeaturedPostState {
  isLoading: boolean
  featuredPosts: Article[]
}

export const useFeaturedPostStore = create<FeaturedPostState>(() => ({
  featuredPosts: [],
  isLoading: false
}))
