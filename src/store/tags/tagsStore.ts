import { create } from 'zustand'
import { tagCrud, Tag } from './crud'
import { message } from 'antd'

interface TagsState {
  tags: Tag[]
  loading: boolean
  error: string | null
  getTags: () => Promise<void>
  createTag: (name: string) => Promise<void>
  updateTag: (data: { id: string; name: string }) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  loading: false,
  error: null,

  getTags: async () => {
    set({ loading: true, error: null })
    try {
      const response = await tagCrud.getTags()
      set({ tags: response.result, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch tags', loading: false })
      message.error('Failed to fetch tags')
    }
  },

  createTag: async (name: string) => {
    set({ loading: true, error: null })
    try {
      await tagCrud.createTag(name)
      message.success('Tag created successfully')
      // Fetch updated list after creating
      const response = await tagCrud.getTags()
      set({ tags: response.result, loading: false })
    } catch (error) {
      set({ error: 'Failed to create tag', loading: false })
      message.error('Failed to create tag')
    }
  },

  updateTag: async (data: { id: string; name: string }) => {
    set({ loading: true, error: null })
    try {
      await tagCrud.updateTag(data)
      message.success('Tag updated successfully')
      // Fetch updated list after updating
      const response = await tagCrud.getTags()
      set({ tags: response.result, loading: false })
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
      // Fetch updated list after deleting
      const response = await tagCrud.getTags()
      set({ tags: response.result, loading: false })
    } catch (error) {
      set({ error: 'Failed to delete tag', loading: false })
      message.error('Failed to delete tag')
    }
  }
}))
