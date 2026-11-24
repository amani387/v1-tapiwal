"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Download,
  Share2,
  Building2,
  Sparkles,
  ArrowLeft,
  Check,
  Copy,
  Crown,
  Shield,
  ExternalLink,
} from "lucide-react"
import { SocialLinkButton } from "./social-link-button"
import type { User, SocialLink } from "@/lib/types"

interface PublicProfileViewProps {
  user: User
  socialLinks: SocialLink[]
  viewerRole?: string | null
  isOwner?: boolean
}

export function PublicProfileView({ user, socialLinks, viewerRole, isOwner }: PublicProfileViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  useEffect(() => {
    // Track profile view
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    }).catch(() => {})

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
    const animationTimer = setTimeout(() => setIsVisible(true), 80)

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
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${user.full_name} - Digital Business Card`,
          text: `Connect with ${user.full_name} via Tapiwal NFC Card`,
          url: window.location.href,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }
    handleCopyLink()
  }

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const copyContactText = (key: string, text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text)
      setCopiedItem(key)
      setTimeout(() => setCopiedItem(null), 2000)
    }
  }

  const backLink =
    viewerRole === "super_admin"
      ? { href: "/admin/super", label: "Back to Super Admin", icon: Crown }
      : viewerRole === "admin"
      ? { href: "/admin", label: "Back to Admin Dashboard", icon: Shield }
      : isOwner
      ? { href: "/dashboard", label: "Back to My Dashboard", icon: ArrowLeft }
      : { href: "/", label: "Back to Tapiwal", icon: ArrowLeft }

  const contactItems = [
    {
      key: "email",
      label: "Email",
      value: user.email,
      href: `mailto:${user.email}`,
      icon: Mail,
    },
    {
      key: "phone",
      label: "Phone",
      value: user.phone,
      href: user.phone ? `tel:${user.phone}` : undefined,
      icon: Phone,
    },
    {
      key: "location",
      label: "Location",
      value: user.location,
      icon: MapPin,
    },
    {
      key: "website",
      label: "Website",
      value: user.website,
      href: user.website?.startsWith("http") ? user.website : `https://${user.website}`,
      icon: Globe,
      external: true,
    },
  ].filter((item) => item.value)

  return (
    <div className="min-h-screen bg-muted/20 text-foreground relative overflow-hidden flex flex-col justify-between">
      {/* Decorative ambient gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-accent/20 rounded-full blur-3xl opacity-60" />
      </div>

      <div>
        {/* Top Floating Navigation Bar */}
        <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
          <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLink.label}</span>
              {viewerRole === "super_admin" && <Crown className="h-3 w-3 text-amber-500 ml-0.5" />}
              {viewerRole === "admin" && <Shield className="h-3 w-3 text-primary ml-0.5" />}
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-muted/50 border border-border/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available • {currentTime}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-8 gap-1.5 text-xs font-medium rounded-lg border-border/80"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Share"}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Digital Business Card */}
        <main className="container max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Card Container */}
            <div className="rounded-3xl border border-border/70 bg-card shadow-lg shadow-black/5 overflow-hidden">
              {/* Cover Banner */}
              <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/30 relative flex items-end justify-end p-4 border-b border-border/40">
                {user.role === "super_admin" && (
                  <Badge className="bg-amber-600/90 text-white gap-1 text-[11px] shadow-sm">
                    <Crown className="h-3 w-3" /> Super Admin
                  </Badge>
                )}
                {user.role === "admin" && (
                  <Badge variant="secondary" className="gap-1 text-[11px] shadow-sm">
                    <Shield className="h-3 w-3 text-primary" /> Admin
                  </Badge>
                )}
              </div>

              {/* Profile Body */}
              <div className="px-6 sm:px-10 pb-8 sm:pb-10 pt-0">
                {/* Floating Avatar & Save Contact row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
                  {/* Avatar */}
                  <div className="relative inline-block self-center sm:self-start">
                    {user.profile_image_url ? (
                      <img
                        src={user.profile_image_url}
                        alt={user.full_name}
                        className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover border-4 border-card shadow-md"
                      />
                    ) : (
                      <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/40 flex items-center justify-center text-4xl sm:text-5xl font-light text-primary border-4 border-card shadow-md">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Top Action Button */}
                  <Button
                    onClick={handleSaveContact}
                    className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-xs px-6 py-5 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Save Contact (.vcf)
                  </Button>
                </div>

                {/* Identity Information */}
                <div className="space-y-2 text-center sm:text-left mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {user.full_name}
                    </h1>
                    <code className="text-xs text-muted-foreground font-mono self-center sm:self-baseline">
                      @{user.unique_id}
                    </code>
                  </div>

                  {user.job_title && (
                    <p className="text-base sm:text-lg font-medium text-primary">
                      {user.job_title}
                    </p>
                  )}

                  {user.company && (
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                      <span>{user.company}</span>
                    </div>
                  )}

                  {user.bio && (
                    <div className="pt-3">
                      <p className="text-sm leading-relaxed text-muted-foreground font-normal border-l-2 border-primary/40 pl-3.5 italic text-left">
                        "{user.bio}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Tiles */}
                <div className="space-y-3 mb-8">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Direct Contact
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contactItems.map((item) => (
                      <div
                        key={item.key}
                        className="group flex items-center justify-between p-3.5 rounded-xl border border-border/70 hover:border-primary/40 hover:bg-accent/30 transition-all bg-card/60"
                      >
                        <a
                          href={item.href || "#"}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                          className="flex items-center gap-3 min-w-0 flex-1"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              {item.label}
                            </p>
                            <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                          </div>
                        </a>

                        <button
                          type="button"
                          onClick={() => copyContactText(item.key, item.value || "")}
                          aria-label={`Copy ${item.label}`}
                          className="p-1.5 text-muted-foreground/60 hover:text-foreground transition-colors rounded-md hover:bg-muted"
                          title="Copy to clipboard"
                        >
                          {copiedItem === item.key ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digital Presence / Social Links */}
                {socialLinks.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Social & Online Presence
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {socialLinks.map((link) => (
                        <div key={link.id} className="min-w-0">
                          <SocialLinkButton link={link} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="container max-w-3xl mx-auto px-4 py-8 text-center border-t border-border/40 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-medium text-foreground">Verified NFC Profile</span>
          </div>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <span>
            Powered by{" "}
            <Link href="/" className="font-semibold text-foreground hover:text-primary transition-colors">
              Tapiwal Digital Business Cards
            </Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
