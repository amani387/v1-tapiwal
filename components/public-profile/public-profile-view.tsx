"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Globe, Download, Share2, Building, Calendar } from "lucide-react"
import { SocialLinkButton } from "./social-link-button"
import type { User, SocialLink } from "@/lib/types"

interface PublicProfileViewProps {
  user: User
  socialLinks: SocialLink[]
}

export function PublicProfileView({ user, socialLinks }: PublicProfileViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Track profile view
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })

    // Set current time for the user's timezone
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    
    updateTime()
    const timer = setInterval(updateTime, 30000)
    
    // Simple fade-in animation
    const animationTimer = setTimeout(() => setIsVisible(true), 100)
    
    return () => {
      clearInterval(timer)
      clearTimeout(animationTimer)
    }
  }, [user.id])

  const handleSaveContact = async () => {
    const vCard = `BEGIN:VCARD
VERSION:4.0
FN:${user.full_name}
${user.job_title ? `TITLE:${user.job_title}` : ""}
${user.company ? `ORG:${user.company}` : ""}
${user.email ? `EMAIL:${user.email}` : ""}
${user.phone ? `TEL:${user.phone}` : ""}
${user.website ? `URL:${user.website}` : ""}
${user.location ? `ADR:;;${user.location};;;` : ""}
END:VCARD`

    const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${user.full_name.replace(/\s+/g, "_")}.vcf`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Contact ${user.full_name}`,
        text: `Check out ${user.full_name}'s contact information`,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const contactItems = [
    { key: 'email', icon: Mail, value: user.email, action: () => window.location.href = `mailto:${user.email}` },
    { key: 'phone', icon: Phone, value: user.phone, action: () => window.location.href = `tel:${user.phone}` },
    { key: 'location', icon: MapPin, value: user.location },
    { key: 'website', icon: Globe, value: user.website, action: () => window.open(user.website, '_blank') },
  ].filter(item => item.value)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header with Time */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Online • {currentTime}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-border hover:bg-accent"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
        </div>

        <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Main Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border-border bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  {/* Profile Header */}
                  <div className="flex flex-col items-center text-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {user.profile_image_url ? (
                        <img
                          src={user.profile_image_url}
                          alt={user.full_name}
                          className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-lg"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-chart-3/20 flex items-center justify-center text-2xl font-bold text-primary border-4 border-background shadow-lg">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Name and Title */}
                    <div className="space-y-2">
                      <h1 className="text-2xl font-bold text-foreground">{user.full_name}</h1>
                      {user.job_title && (
                        <p className="text-primary font-semibold">{user.job_title}</p>
                      )}
                      {user.company && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span className="text-sm">{user.company}</span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <p className="text-muted-foreground text-sm leading-relaxed bg-muted/30 rounded-lg p-4">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {/* Save Contact Button */}
                  <Button 
                    onClick={handleSaveContact} 
                    className="w-full mt-6 bg-primary hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save Contact
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact & Social */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="border-border bg-card shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Contact Information
                  </h2>
                  <div className="grid gap-3">
                    {contactItems.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground capitalize">
                            {item.key}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.value}
                          </p>
                        </div>
                        {item.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={item.action}
                            className="text-primary hover:text-primary/80"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
{/* Social Links */}
{socialLinks.length > 0 && (
  <Card className="border-border bg-card shadow-lg">
    <CardContent className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-chart-2 rounded-full" />
        Digital Presence
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialLinks.map((link) => (
          <div key={link.id} className="min-w-0"> {/* Container to prevent overflow */}
            <SocialLinkButton link={link} />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
              {/* Additional Info */}
              <Card className="border-border bg-card shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-chart-3 rounded-full" />
                    Profile Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Profile Created</p>
                        <p className="text-muted-foreground">Recently</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="h-4 w-4 rounded-full bg-chart-4" />
                      <div>
                        <p className="font-medium text-foreground">Status</p>
                        <p className="text-muted-foreground">Available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center border-t border-border pt-8">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Secure Connection</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <span>
                Powered by{" "}
                <a 
                  href="/" 
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Tapiwal
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}