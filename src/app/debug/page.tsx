'use client'

import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const { user, isAuthenticated, isLoading, error } = useAuth()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
              <p><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</p>
              <p><strong>Error:</strong> {error || 'none'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Token:</strong> {typeof window !== 'undefined' ? localStorage.getItem('token') || 'none' : 'SSR'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('token')
                    window.location.reload()
                  }
                }}
                variant="destructive"
              >
                Clear Token & Reload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 