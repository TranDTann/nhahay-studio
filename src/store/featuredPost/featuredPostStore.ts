import { create } from 'zustand'
import { Article } from '../article/crud'

interface FeaturedPostState {
  featuredPosts: Article[]
}

export const useFeaturedPostStore = create<FeaturedPostState>(() => ({
  featuredPosts: []
}))
