'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

export function useAuthCheck() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setHasChecked(true)
    }
    
    if (!hasChecked) {
      initAuth()
    }
  }, [hasChecked]) // checkAuth dependency'sini kaldırdık

  return { isAuthenticated, isLoading: isLoading || !hasChecked }
} 