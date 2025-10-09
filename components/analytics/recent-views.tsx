import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Globe, Clock } from "lucide-react"
import type { ProfileView } from "@/lib/types"

interface RecentViewsProps {
  views: ProfileView[]
}

export function RecentViews({ views }: RecentViewsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return "Just now"
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const getBrowserFromUserAgent = (userAgent?: string) => {
    if (!userAgent) return "Unknown"
    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Safari")) return "Safari"
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("Edge")) return "Edge"
    return "Other"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Profile Views</CardTitle>
        <CardDescription>Latest visitors to your profile</CardDescription>
      </CardHeader>
      <CardContent>
        {views.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Eye className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No profile views yet</p>
            <p className="text-xs text-muted-foreground">Share your profile link to start tracking views</p>
          </div>
        ) : (
          <div className="space-y-3">
            {views.map((view) => (
              <div key={view.id} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <p className="text-sm font-medium">{getBrowserFromUserAgent(view.viewer_user_agent)}</p>
                  </div>
                  {view.referrer && <p className="truncate text-xs text-muted-foreground">From: {view.referrer}</p>}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(view.viewed_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
