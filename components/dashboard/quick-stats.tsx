"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Users, Copy, Check } from "lucide-react"
import { useState } from "react"

interface QuickStatsProps {
  totalTaps: number
  totalVisitors: number
  uniqueId: string
}

export function QuickStats({ totalTaps, totalVisitors, uniqueId }: QuickStatsProps) {
  const [copied, setCopied] = useState(false)
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/u/${uniqueId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Taps</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTaps}</div>
          <p className="text-xs text-muted-foreground">Profile views all time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisitors}</div>
          <p className="text-xs text-muted-foreground">Different people reached</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 min-w-0">
            <code className="flex-1 min-w-0 truncate rounded bg-muted px-2 py-1 text-xs font-mono" title={profileUrl}>{profileUrl}</code>
            <Button size="sm" variant="ghost" className="shrink-0 h-8 w-8 p-0" onClick={handleCopy} title="Copy link">
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
