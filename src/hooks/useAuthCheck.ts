'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

export function useAuthCheck() {
  const { checkAuth, isAuthenticated, isLoading } = useAuth()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setHasChecked(true)
    }
    
    if (!hasChecked) {
      initAuth()
    }
  }, [checkAuth, hasChecked])

  return { isAuthenticated, isLoading: isLoading || !hasChecked }
} 