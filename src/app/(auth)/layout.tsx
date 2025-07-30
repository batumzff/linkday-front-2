'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
    if (isAuthenticated && !isLoading) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Debug için console log
  useEffect(() => {
    console.log('Auth Layout - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)
  }, [isAuthenticated, isLoading])

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Eğer kullanıcı giriş yapmışsa hiçbir şey gösterme (yönlendirme yapılacak)
  if (isAuthenticated) {
    return null
  }

  // Auth sayfalarını göster
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {children}
    </div>
  )
} 