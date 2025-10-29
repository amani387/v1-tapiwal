"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Globe, Download, Share2, Building, Calendar, Sparkles } from "lucide-react"
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
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 30000)

    // Fade-in animation
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
    { key: "email", icon: Mail, value: user.email, action: () => (window.location.href = `mailto:${user.email}`) },
    { key: "phone", icon: Phone, value: user.phone, action: () => (window.location.href = `tel:${user.phone}`) },
    { key: "location", icon: MapPin, value: user.location },
    { key: "website", icon: Globe, value: user.website, action: () => window.open(user.website, "_blank") },
  ].filter((item) => item.value)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-16 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground/60">Available • {currentTime}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-foreground/20 hover:bg-foreground/5 rounded-lg bg-transparent"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Premium Profile Card */}
            <div className="lg:col-span-1">
              <div className="premium-card p-8 sticky top-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="relative group">
                    {user.profile_image_url ? (
                      <img
                        src={user.profile_image_url || "/placeholder.svg"}
                        alt={user.full_name}
                        className="h-32 w-32 rounded-2xl object-cover border-2 border-primary/20 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:border-primary/40"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-5xl font-light text-primary border-2 border-primary/20 shadow-2xl">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-3 w-full">
                    <h1 className="text-3xl font-light tracking-tight text-foreground">{user.full_name}</h1>
                    {user.job_title && <p className="text-lg font-medium text-primary">{user.job_title}</p>}
                    {user.company && (
                      <div className="flex items-center justify-center gap-2 text-foreground/60">
                        <Building className="h-4 w-4" />
                        <span className="text-sm font-light">{user.company}</span>
                      </div>
                    )}
                  </div>

                  {user.bio && (
                    <p className="text-foreground/70 text-sm leading-relaxed font-light italic border-l-2 border-primary/30 pl-4">
                      "{user.bio}"
                    </p>
                  )}

                  <Button
                    onClick={handleSaveContact}
                    className="w-full mt-6 premium-button bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save Contact
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Social */}
            <div className="lg:col-span-2 space-y-6">
              <div className="premium-card p-8">
                <h2 className="text-xl font-light text-foreground mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Contact Information
                </h2>
                <div className="grid gap-4">
                  {contactItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={item.action}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-foreground/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{item.key}</p>
                        <p className="text-foreground font-light truncate">{item.value}</p>
                      </div>
                      {item.action && (
                        <div className="text-primary/60 group-hover:text-primary transition-colors">→</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div className="premium-card p-8">
                  <h2 className="text-xl font-light text-foreground mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-chart-2 rounded-full" />
                    Digital Presence
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {socialLinks.map((link) => (
                      <div key={link.id} className="min-w-0">
                        <SocialLinkButton link={link} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="premium-card p-8">
                <h2 className="text-xl font-light text-foreground mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-chart-3 rounded-full" />
                  Profile Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-foreground/10 hover:border-foreground/20 transition-colors">
                    <Calendar className="h-5 w-5 text-foreground/40" />
                    <div>
                      <p className="font-medium text-foreground">Profile Created</p>
                      <p className="text-foreground/60 font-light">Recently</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-foreground/10 hover:border-foreground/20 transition-colors">
                    <div className="h-5 w-5 rounded-full bg-primary/60" />
                    <div>
                      <p className="font-medium text-foreground">Status</p>
                      <p className="text-foreground/60 font-light">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center border-t border-foreground/10 pt-8">
            <div className="flex items-center justify-center gap-6 text-sm text-foreground/50 font-light">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Secure Connection</span>
              </div>
              <div className="w-px h-4 bg-foreground/20" />
              <span>
                Powered by{" "}
                <a href="/" className="font-medium text-foreground/70 hover:text-primary transition-colors">
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
