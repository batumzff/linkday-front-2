import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/api'
import type { AuthResponse } from '@/lib/api'

interface AuthState {
  user: AuthResponse['user'] | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: AuthResponse['user'] | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (userData: { name: string; email: string; username: string; password: string }) => Promise<void>
  logout: () => void
  clearError: () => void
  checkAuth: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setError: (error) =>
        set({ error }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.login(email, password)
          if (response && response.user) {
            console.log('Login successful:', response.user)
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error('Invalid response from server')
          }
        } catch (error) {
          console.error('Login failed:', error)
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.register(userData)
          if (response && response.user) {
            console.log('Registration successful:', response.user)
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error('Invalid response from server')
          }
        } catch (error) {
          console.error('Registration failed:', error)
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          })
          throw error
        }
      },

      logout: () => {
        apiClient.logout()
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () =>
        set({ error: null }),

      checkAuth: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const user = await apiClient.getCurrentUser()
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            throw new Error('Invalid user data')
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // Token geçersizse temizle
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
          }
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 