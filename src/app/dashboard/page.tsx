import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon, BarChart3, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Mock data - in real app this would come from API
  const stats = [
    {
      title: 'Total Links',
      value: '12',
      description: 'Active links in your profile',
      icon: LinkIcon,
      color: 'text-blue-600',
    },
    {
      title: 'Total Clicks',
      value: '1,234',
      description: 'Clicks this month',
      icon: BarChart3,
      color: 'text-green-600',
    },
    {
      title: 'Profile Views',
      value: '567',
      description: 'Views this month',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Growth',
      value: '+23%',
      description: 'Compared to last month',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  const recentLinks = [
    { id: '1', title: 'My Portfolio', url: 'https://example.com', clicks: 45 },
    { id: '2', title: 'LinkedIn', url: 'https://linkedin.com', clicks: 32 },
    { id: '3', title: 'GitHub', url: 'https://github.com', clicks: 28 },
  ]

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
        {stats.map((stat) => (
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
        ))}
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
              {recentLinks.map((link) => (
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
              ))}
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
      </div>
    </div>
  )
} 