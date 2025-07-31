'use client'

import { useParams } from 'next/navigation'
import { usePublicProfile, useTrackClick } from '@/hooks/useLinks'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Share2, Copy } from 'lucide-react'
import { useState } from 'react'

export default function PublicProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { data: profile, isLoading, error } = usePublicProfile(username)
  const trackClick = useTrackClick()
  const [copied, setCopied] = useState(false)

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      // Track click
      await trackClick.mutateAsync(linkId)
      
      // Open link in new tab
      window.open(url, '_blank')
    } catch (error) {
      // Still open link even if tracking fails
      window.open(url, '_blank')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${profile?.user.name}'s Links`,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to copy URL
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The profile you're looking for doesn't exist or is private.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      profile.user.theme === 'dark' 
        ? 'from-gray-900 to-gray-800' 
        : profile.user.theme === 'colorful'
        ? 'from-purple-50 to-pink-100'
        : 'from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {profile.user.avatar && (
              <img
                src={profile.user.avatar}
                alt={profile.user.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{profile.user.name}</h1>
            {profile.user.bio && (
              <p className="text-muted-foreground mb-4">{profile.user.bio}</p>
            )}
            
            {/* Share Buttons */}
            <div className="flex justify-center space-x-2 mb-8">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            {profile.links && profile.links.length > 0 ? (
              profile.links
                .filter(link => link.isActive)
                .sort((a, b) => a.order - b.order)
                .map((link) => (
                  <Card key={link._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Button
                        variant="ghost"
                        className="w-full h-auto p-4 flex items-center justify-between"
                        onClick={() => handleLinkClick(link._id, link.url)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{link.icon || '🔗'}</span>
                          <div className="text-left">
                            <h3 className="font-semibold">{link.title}</h3>
                            {link.description && (
                              <p className="text-sm text-muted-foreground">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No links available</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Powered by LinkDay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 