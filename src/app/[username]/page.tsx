'use client'

import { usePublicProfile, useTrackClick } from '@/hooks/useLinks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Eye } from 'lucide-react'
import { useEffect } from 'react'

interface PublicProfilePageProps {
  params: {
    username: string
  }
}

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = params
  const { data: profile, isLoading, error } = usePublicProfile(username)
  const trackClick = useTrackClick()

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      // Track the click
      await trackClick.mutateAsync(linkId)
      
      // Open the link in a new tab
      window.open(url, '_blank')
    } catch (error) {
      // Still open the link even if tracking fails
      window.open(url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or is private.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {profile.user.avatar && (
              <div className="mb-4">
                <img
                  src={profile.user.avatar}
                  alt={profile.user.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-background shadow-lg"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{profile.user.name}</h1>
            {profile.user.bio && (
              <p className="text-muted-foreground mb-4">{profile.user.bio}</p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {profile.links
              .filter(link => link.isActive)
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <Card key={link._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      className="w-full h-auto p-4 justify-start text-left hover:bg-muted/50"
                      onClick={() => handleLinkClick(link._id, link.url)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        {link.icon && (
                          <span className="text-2xl flex-shrink-0">{link.icon}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{link.title}</p>
                          {link.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {link.description}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Empty State */}
          {profile.links.filter(link => link.isActive).length === 0 && (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No links available</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Powered by LinkDay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 