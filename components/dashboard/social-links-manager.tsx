"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Linkedin, Instagram, Twitter, Facebook, Github, Globe } from "lucide-react"
import type { SocialLink, SocialPlatform } from "@/lib/types"

interface SocialLinksManagerProps {
  socialLinks: SocialLink[]
  userId: string
}

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  linkedin: <Linkedin className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  github: <Github className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
  youtube: <Globe className="h-4 w-4" />,
  tiktok: <Globe className="h-4 w-4" />,
  whatsapp: <Globe className="h-4 w-4" />,
  telegram: <Globe className="h-4 w-4" />,
  other: <Globe className="h-4 w-4" />,
}

export function SocialLinksManager({ socialLinks, userId }: SocialLinksManagerProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState({ platform: "linkedin" as SocialPlatform, url: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddLink = async () => {
    if (!newLink.url) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("social_links").insert({
        user_id: userId,
        platform: newLink.platform,
        url: newLink.url,
        display_order: socialLinks.length,
      })

      if (error) throw error

      setNewLink({ platform: "linkedin", url: "" })
      setIsAdding(false)
      router.refresh()
    } catch (err) {
      console.error("Failed to add social link:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("social_links").delete().eq("id", linkId)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error("Failed to delete social link:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>Manage your social media profiles and contact links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinks.length > 0 && (
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2 rounded-lg border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                  {platformIcons[link.platform as SocialPlatform]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{link.platform}</p>
                  <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleDeleteLink(link.id)} disabled={isLoading}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {isAdding ? (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={newLink.platform}
                onValueChange={(value) => setNewLink({ ...newLink, platform: value as SocialPlatform })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddLink} disabled={isLoading || !newLink.url}>
                {isLoading ? "Adding..." : "Add Link"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                disabled={isLoading}
                className="bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Social Link
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
