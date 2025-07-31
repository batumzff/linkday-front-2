'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link as LinkIcon, BarChart3, Users, TrendingUp, Copy, Globe } from 'lucide-react'
import Link from 'next/link'
import { useLinks } from '@/hooks/useLinks'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { data: links, isLoading } = useLinks()
  const [copied, setCopied] = useState(false)



  const handleCopyPublicUrl = async () => {
    if (!user?.username) return
    
    try {
      const publicUrl = `http://localhost:3001/u/${user.username}`
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  // Calculate stats from real data
  const totalLinks = links?.length || 0
  const totalClicks = links?.reduce((sum, link) => sum + link.clicks, 0) || 0
  const activeLinks = links?.filter(link => link.isActive).length || 0

  const stats = [
    {
      title: 'Total Links',
      value: totalLinks.toString(),
      description: 'Links in your profile',
      icon: LinkIcon,
      color: 'text-blue-600',
    },
    {
      title: 'Active Links',
      value: activeLinks.toString(),
      description: 'Currently active links',
      icon: LinkIcon,
      color: 'text-green-600',
    },
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      description: 'All-time clicks',
      icon: BarChart3,
      color: 'text-purple-600',
    },
    {
      title: 'Profile Views',
      value: '0', // TODO: Implement profile view tracking
      description: 'Views this month',
      icon: Users,
      color: 'text-orange-600',
    },
  ]

  const recentLinks = links?.slice(0, 3).map(link => ({
    id: link._id,
    title: link.title,
    url: link.url,
    clicks: link.clicks,
  })) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your links.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Links</CardTitle>
            <CardDescription>
              Your most clicked links this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))
              ) : recentLinks.length > 0 ? (
                recentLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-muted-foreground">{link.url}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{link.clicks}</p>
                      <p className="text-xs text-muted-foreground">clicks</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No links yet. Create your first link to get started!
                </p>
              )}
            </div>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/links">View All Links</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your profile and links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/links/new">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add New Link
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/profile">
                  <Users className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>
              Share your profile with others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Your Public URL</span>
              </div>
              {authLoading ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value="Loading..."
                    readOnly
                    className="flex-1"
                    disabled
                  />
                  <Button variant="outline" size="sm" disabled>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              ) : user?.username ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={`http://localhost:3001/u/${user.username}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPublicUrl}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    value="Not available"
                    readOnly
                    className="flex-1"
                    disabled
                  />
                  <Button variant="outline" size="sm" disabled>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
                disabled={authLoading || !user?.username}
              >
                <Link href={user?.username ? `/u/${user.username}` : '#'} target="_blank">
                  <Globe className="mr-2 h-4 w-4" />
                  View Public Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 