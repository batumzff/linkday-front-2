import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { LinkResponse } from '@/lib/api'

export const useLinks = () => {
  return useQuery({
    queryKey: ['links'],
    queryFn: () => apiClient.getLinks(),
  })
}

export const useCreateLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (linkData: { title: string; url: string; description?: string; icon?: string }) =>
      apiClient.createLink(linkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })
}

export const useUpdateLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      linkId,
      linkData,
    }: {
      linkId: string
      linkData: { title?: string; url?: string; description?: string; icon?: string; isActive?: boolean }
    }) => apiClient.updateLink(linkId, linkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })
}

export const useDeleteLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (linkId: string) => apiClient.deleteLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })
}

export const useReorderLinks = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (linkIds: string[]) => apiClient.reorderLinks(linkIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })
}

export const usePublicProfile = (username: string) => {
  return useQuery({
    queryKey: ['publicProfile', username],
    queryFn: () => apiClient.getPublicProfile(username),
    enabled: !!username,
  })
}

export const useTrackClick = () => {
  return useMutation({
    mutationFn: (linkId: string) => apiClient.trackClick(linkId),
  })
} 