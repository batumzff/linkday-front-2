export interface User {
  id: string
  email: string
  username: string
  googleId?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  subscriptionTier: 'free' | 'premium'
  themePreference: 'light' | 'dark' | 'auto'
}

export interface Profile {
  id: string
  userId: string
  displayName: string
  bio?: string
  profileImageUrl?: string
  backgroundColor: string
  textColor: string
  buttonStyle: 'rounded' | 'square' | 'pill'
  isPublic: boolean
  customDomain?: string
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

export interface Link {
  id: string
  userId: string
  title: string
  description?: string
  url: string
  iconType: 'emoji' | 'font_awesome' | 'lucide' | 'custom_image'
  iconValue: string
  buttonText: string
  isActive: boolean
  sortOrder: number
  clickCount: number
  backgroundColor?: string
  textColor?: string
  createdAt: Date
  updatedAt: Date
}

export interface LinkClick {
  id: string
  linkId: string
  userId: string
  clickedAt: Date
  ipAddress: string
  userAgent: string
  referrer?: string
  country?: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  lastAccessed: Date
  ipAddress: string
  userAgent: string
}

export interface AnalyticsData {
  totalClicks: number
  uniqueVisitors: number
  topLinks: Array<{
    id: string
    title: string
    clicks: number
  }>
  clicksByDate: Array<{
    date: string
    clicks: number
  }>
  deviceTypes: {
    mobile: number
    tablet: number
    desktop: number
  }
  countries: Array<{
    country: string
    clicks: number
  }>
}

export interface FormData {
  title: string
  url: string
  description?: string
  iconType: 'emoji' | 'font_awesome' | 'lucide' | 'custom_image'
  iconValue: string
  buttonText: string
  backgroundColor?: string
  textColor?: string
}

export interface ProfileFormData {
  displayName: string
  bio?: string
  backgroundColor: string
  textColor: string
  buttonStyle: 'rounded' | 'square' | 'pill'
  isPublic: boolean
  seoTitle?: string
  seoDescription?: string
} 