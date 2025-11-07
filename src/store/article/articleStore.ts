import { create } from 'zustand'
import { articleCrud, type Article } from './crud'

export enum PostTypeEnum {
  NONE = 0,
  LATEST = 1,
  MOST_VIEWED = 2,
  MOST_LIKED = 3,
  MOST_COMMENTED = 4,
  FEATURED_POSTS = 5,
  RELATED_POSTS = 6,
  TRENDING_POSTS = 7,
  TOP_RATED = 8
}

export const postTyes = [
  { key: PostTypeEnum.NONE, label: 'Tất cả' },
  { key: PostTypeEnum.FEATURED_POSTS, label: 'Nổi bật' },
  { key: PostTypeEnum.MOST_VIEWED, label: 'Phổ biến' },
  { key: PostTypeEnum.LATEST, label: 'Gần đây' },
  { key: PostTypeEnum.TRENDING_POSTS, label: 'Xu hướng' }
]

interface ArticleState {
  articles: Article[]
  loading: boolean
  error: string | null
  getArticles: () => Promise<void>
  createArticle: (
    articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>
  updateArticle: (id: string, articleData: Partial<Article>) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  loading: false,
  error: null,

  getArticles: async () => {
    set({ loading: true, error: null })
    try {
      const response = await articleCrud.getArticles()
      set({ articles: response.result, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch articles', loading: false })
    }
  },

  createArticle: async (articleData) => {
    set({ loading: true, error: null })
    try {
      const response = await articleCrud.createArticle(articleData)
      set((state) => ({
        articles: [...state.articles, response.result],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to create article', loading: false })
    }
  },

  updateArticle: async (id, articleData) => {
    set({ loading: true, error: null })
    try {
      const response = await articleCrud.updateArticle(id, articleData)
      set((state) => ({
        articles: state.articles.map((article) =>
          article.id === id ? response.result : article
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update article', loading: false })
    }
  },

  deleteArticle: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await articleCrud.deleteArticle(id)
      set((state) => ({
        articles: state.articles.filter((article) => article.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete article', loading: false })
    }
  }
}))
