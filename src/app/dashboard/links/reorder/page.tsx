'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLinks, useReorderLinks } from '@/hooks/useLinks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, GripVertical, Move } from 'lucide-react'
import Link from 'next/link'

export default function ReorderLinksPage() {
  const router = useRouter()
  const { data: links, isLoading } = useLinks()
  const reorderLinks = useReorderLinks()
  const [orderedLinks, setOrderedLinks] = useState<any[]>([])
  const [isReordering, setIsReordering] = useState(false)

  // Links yüklendiğinde sıralamayı ayarla
  if (links && orderedLinks.length === 0) {
    setOrderedLinks([...links].sort((a, b) => a.order - b.order))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...orderedLinks]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index - 1]
    newOrder[index - 1] = temp
    setOrderedLinks(newOrder)
  }

  const handleMoveDown = (index: number) => {
    if (index === orderedLinks.length - 1) return
    const newOrder = [...orderedLinks]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index + 1]
    newOrder[index + 1] = temp
    setOrderedLinks(newOrder)
  }

  const handleSaveOrder = async () => {
    if (orderedLinks.length === 0) return

    setIsReordering(true)
    try {
      const linkIds = orderedLinks.map(link => link._id)
      await reorderLinks.mutateAsync(linkIds)
      router.push('/dashboard/links')
    } catch (error) {
      console.error('Failed to reorder links:', error)
    } finally {
      setIsReordering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/dashboard/links">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Links
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/links">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Links
            </Button>
          </Link>
          <Button 
            onClick={handleSaveOrder}
            disabled={isReordering || orderedLinks.length === 0}
          >
            {isReordering ? 'Saving...' : 'Save Order'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reorder Links</CardTitle>
            <p className="text-sm text-muted-foreground">
              Drag and drop or use the arrows to reorder your links. The order will be saved when you click "Save Order".
            </p>
          </CardHeader>
          <CardContent>
            {orderedLinks.length > 0 ? (
              <div className="space-y-2">
                {orderedLinks.map((link, index) => (
                  <div
                    key={link._id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-background"
                  >
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl">{link.icon || '🔗'}</span>
                      <div>
                        <h3 className="font-semibold">{link.title}</h3>
                        <p className="text-sm text-muted-foreground">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === orderedLinks.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Move className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No links to reorder</h3>
                <p className="text-muted-foreground mb-4">
                  Add some links first to reorder them.
                </p>
                <Link href="/dashboard/links/new">
                  <Button>Add Your First Link</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 