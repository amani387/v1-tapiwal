import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"

interface ProfileCardProps {
  profile: User | null
}

export function ProfileCard({ profile }: ProfileCardProps) {
  if (!profile) return null

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/u/${profile.unique_id}`

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url || "/placeholder.svg"}
                alt={profile.full_name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            {profile.job_title && <p className="text-sm text-muted-foreground">{profile.job_title}</p>}
            {profile.company && <p className="text-sm text-muted-foreground">{profile.company}</p>}
          </div>

          {profile.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}

          <div className="w-full space-y-2 text-left text-sm">
            {profile.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.company && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{profile.company}</span>
              </div>
            )}
          </div>

          <Link href={`/u/${profile.unique_id}`} target="_blank" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
