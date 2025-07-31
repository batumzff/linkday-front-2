const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: {
    _id: string
    name: string
    email: string
    username: string
    avatar?: string
    bio?: string
    theme: 'light' | 'dark' | 'colorful'
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface LinkResponse {
  _id: string
  userId: string
  title: string
  url: string
  description?: string
  icon?: string
  order: number
  clicks: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProfileResponse {
  user: {
    _id: string
    name: string
    email: string
    username: string
    avatar?: string
    bio?: string
    theme: 'light' | 'dark' | 'colorful'
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  links: LinkResponse[]
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token)
        // Also set as cookie for SSR
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      } else {
        localStorage.removeItem('token')
        // Remove cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Something went wrong')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const url = `${this.baseURL}/api/auth/login`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.success && data.token && data.user) {
        this.setToken(data.token)
        return data
      }

      throw new Error(data.message || 'Login failed')
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async register(userData: {
    name: string
    email: string
    username: string
    password: string
  }): Promise<AuthResponse> {
    const url = `${this.baseURL}/api/auth/register`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      if (data.success && data.token && data.user) {
        this.setToken(data.token)
        return data
      }

      throw new Error(data.message || 'Registration failed')
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const url = `${this.baseURL}/api/auth/me`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Failed to get current user')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // User profile endpoints
  async updateProfile(profileData: {
    name?: string
    bio?: string
    theme?: 'light' | 'dark' | 'colorful'
    avatar?: string
  }): Promise<AuthResponse['user']> {
    const response = await this.request<AuthResponse['user']>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
    return response.data!
  }

  async updateUsername(username: string): Promise<{ success: boolean; message: string }> {
    const response = await this.request<{ success: boolean; message: string }>('/api/user/username', {
      method: 'PUT',
      body: JSON.stringify({ username }),
    })
    return response.data!
  }

  // Links endpoints
  async getLinks(): Promise<LinkResponse[]> {
    const url = `${this.baseURL}/api/links`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Failed to get links')
      }

      return data.links || []
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async createLink(linkData: {
    title: string
    url: string
    description?: string
    icon?: string
  }): Promise<LinkResponse> {
    const url = `${this.baseURL}/api/links`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(linkData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Failed to create link')
      }

      return data.link
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async updateLink(linkId: string, linkData: {
    title?: string
    url?: string
    description?: string
    icon?: string
    isActive?: boolean
  }): Promise<LinkResponse> {
    const url = `${this.baseURL}/api/links/${linkId}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(linkData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Failed to update link')
      }

      return data.link
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async deleteLink(linkId: string): Promise<{ success: boolean; message: string }> {
    const url = `${this.baseURL}/api/links/${linkId}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        mode: 'cors',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Failed to delete link')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async reorderLinks(linkIds: string[]): Promise<{ success: boolean; message: string }> {
    const url = `${this.baseURL}/api/links/reorder`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ linkIds }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Failed to reorder links')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Public profile endpoints
  async getPublicProfile(username: string): Promise<ProfileResponse> {
    const url = `${this.baseURL}/u/${username}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Profile not found')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async trackClick(linkId: string): Promise<{ success: boolean; message: string; redirectUrl: string }> {
    const url = `${this.baseURL}/api/click/${linkId}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        mode: 'cors',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to track click')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  logout() {
    this.setToken(null)
  }
}

export const apiClient = new ApiClient(API_BASE_URL) 