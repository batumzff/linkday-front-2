import { create } from 'zustand'
import { apiClient } from '@/lib/api'
import type { LinkResponse } from '@/lib/api'

interface LinksState {
  links: LinkResponse[]
  isLoading: boolean
  error: string | null
}

interface LinksActions {
  setLinks: (links: LinkResponse[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchLinks: () => Promise<void>
  createLink: (linkData: { title: string; url: string; description?: string; icon?: string }) => Promise<LinkResponse>
  updateLink: (linkId: string, linkData: { title?: string; url?: string; description?: string; icon?: string; isActive?: boolean }) => Promise<LinkResponse>
  deleteLink: (linkId: string) => Promise<void>
  reorderLinks: (linkIds: string[]) => Promise<void>
  clearError: () => void
}

type LinksStore = LinksState & LinksActions

export const useLinksStore = create<LinksStore>()((set, get) => ({
  links: [],
  isLoading: false,
  error: null,

  setLinks: (links) => set({ links }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchLinks: async () => {
    set({ isLoading: true, error: null })
    try {
      const links = await apiClient.getLinks()
      set({ links, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch links',
      })
      throw error
    }
  },

  createLink: async (linkData) => {
    set({ isLoading: true, error: null })
    try {
      const newLink = await apiClient.createLink(linkData)
      const { links } = get()
      set({ links: [...links, newLink], isLoading: false })
      return newLink
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create link',
      })
      throw error
    }
  },

  updateLink: async (linkId, linkData) => {
    set({ isLoading: true, error: null })
    try {
      const updatedLink = await apiClient.updateLink(linkId, linkData)
      const { links } = get()
      const updatedLinks = links.map(link =>
        link._id === linkId ? updatedLink : link
      )
      set({ links: updatedLinks, isLoading: false })
      return updatedLink
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update link',
      })
      throw error
    }
  },

  deleteLink: async (linkId) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.deleteLink(linkId)
      const { links } = get()
      const filteredLinks = links.filter(link => link._id !== linkId)
      set({ links: filteredLinks, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete link',
      })
      throw error
    }
  },

  reorderLinks: async (linkIds) => {
    try {
      await apiClient.reorderLinks(linkIds)
      const { links } = get()
      const reorderedLinks = linkIds.map(id =>
        links.find(link => link._id === id)
      ).filter(Boolean) as LinkResponse[]
      set({ links: reorderedLinks })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder links',
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),
})) 