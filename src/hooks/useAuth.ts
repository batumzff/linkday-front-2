import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/useAuthStore'
import { apiClient } from '@/lib/api'

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, register, logout, checkAuth, clearError } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  }
}

export const useLogin = () => {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  })
}

export const useRegister = () => {
  const { register } = useAuthStore()

  return useMutation({
    mutationFn: (userData: { name: string; email: string; username: string; password: string }) =>
      register(userData),
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiClient.getCurrentUser(),
    enabled: !!localStorage.getItem('token'),
    retry: false,
  })
} 