import { create } from 'zustand'

interface Article {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

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
      const response = await fetch('/api/articles')
      const data = await response.json()
      set({ articles: data, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch articles', loading: false })
    }
  },

  createArticle: async (articleData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      })
      const newArticle = await response.json()
      set((state) => ({
        articles: [...state.articles, newArticle],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to create article', loading: false })
    }
  },

  updateArticle: async (id, articleData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      })
      const updatedArticle = await response.json()
      set((state) => ({
        articles: state.articles.map((article) =>
          article.id === id ? updatedArticle : article
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
      await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      set((state) => ({
        articles: state.articles.filter((article) => article.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete article', loading: false })
    }
  }
}))
