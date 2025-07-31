'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  BarChart3, 
  User, 
  Settings,
  Plus
} from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect } from 'react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Links', href: '/dashboard/links', icon: LinkIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    // Token varsa auth check yap
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token && !isAuthenticated && !isLoading) {
      checkAuth()
    } else if (!token && !isLoading) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router, checkAuth])

  // Show loading state while checking authentication
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

  // Eğer kullanıcı giriş yapmamışsa hiçbir şey gösterme (yönlendirme yapılacak)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card">
          <div className="p-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold">LinkDay</span>
            </Link>
          </div>
          
          <nav className="px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start mb-1"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 mt-8">
            <Button className="w-full" asChild>
              <Link href="/dashboard/links/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Link
              </Link>
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 