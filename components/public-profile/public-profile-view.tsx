"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react"
import { SocialLinkButton } from "./social-link-button"
import type { User, SocialLink } from "@/lib/types"

interface PublicProfileViewProps {
  user: User
  socialLinks: SocialLink[]
}

export function PublicProfileView({ user, socialLinks }: PublicProfileViewProps) {
  useEffect(() => {
    // Track profile view
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
  }, [user.id])

  const handleContactClick = (type: string, value: string) => {
    if (type === "email") {
      window.location.href = `mailto:${value}`
    } else if (type === "phone") {
      window.location.href = `tel:${value}`
    }
  }

  const handleSaveContact = () => {
    // Generate vCard
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${user.full_name}
${user.job_title ? `TITLE:${user.job_title}` : ""}
${user.company ? `ORG:${user.company}` : ""}
${user.email ? `EMAIL:${user.email}` : ""}
${user.phone ? `TEL:${user.phone}` : ""}
${user.website ? `URL:${user.website}` : ""}
${user.location ? `ADR:;;${user.location};;;` : ""}
END:VCARD`

    const blob = new Blob([vCard], { type: "text/vcard" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${user.full_name.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32 max-w-2xl py-12">
        <Card className="overflow-hidden py-20">
          {/* Cover Image */}
          {user.cover_image_url && (
            <div className="h-32 w-full bg-gradient-to-r from-primary/20 to-primary/10">
              <img
                src={user.cover_image_url || "/placeholder.svg"}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative -mt-20">
                {user.profile_image_url ? (
                  <img
                    src={user.profile_image_url || "/placeholder.svg"}
                    alt={user.full_name}
                    className="h-32 w-32 rounded-full border-4 border-background object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-5xl font-bold text-primary shadow-lg">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{user.full_name}</h1>
                {user.job_title && (
                  <p className="text-lg text-muted-foreground">
                    {user.job_title}
                    {user.company && ` at ${user.company}`}
                  </p>
                )}
              </div>

              {user.bio && <p className="max-w-md text-muted-foreground">{user.bio}</p>}

              {/* Contact Info */}
              <div className="w-full space-y-3 pt-4">
                {user.email && (
                  <button
                    onClick={() => handleContactClick("email", user.email!)}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                {user.phone && (
                  <button
                    onClick={() => handleContactClick("phone", user.phone!)}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                {user.location && (
                  <div className="flex w-full items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                  </div>
                )}

                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Website</p>
                      <p className="truncate text-sm text-muted-foreground">{user.website}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="w-full space-y-3 pt-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Connect With Me
                  </h2>
                  <div className="grid gap-2">
                    {socialLinks.map((link) => (
                      <SocialLinkButton key={link.id} link={link} />
                    ))}
                  </div>
                </div>
              )}

              {/* Save Contact Button */}
              <Button onClick={handleSaveContact} size="lg" className="w-full">
                Save Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Powered by Tapiwal */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a href="/" className="font-medium underline underline-offset-4">
              Tapiwal
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
