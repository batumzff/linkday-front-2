'use client'

import { useLinks } from '@/hooks/useLinks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ExternalLink, Edit, Trash2, Move } from 'lucide-react'
import Link from 'next/link'

export default function LinksPage() {
  const { data: links, isLoading, error } = useLinks()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Links</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">My Links</h1>
          <p className="text-muted-foreground">Failed to load links</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Links</h1>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/links/reorder">
            <Button variant="outline">
              <Move className="mr-2 h-4 w-4" />
              Reorder
            </Button>
          </Link>
          <Link href="/dashboard/links/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </Link>
        </div>
      </div>

      {links && links.length > 0 ? (
        <div className="grid gap-4">
          {links.map((link) => (
            <Card key={link._id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{link.icon || '🔗'}</span>
                    <div>
                      <h3 className="font-semibold">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.url}</p>
                      {link.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {link.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {link.clicks} clicks
                    </span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No links yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your link collection by adding your first link.
            </p>
            <Link href="/dashboard/links/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 