import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { SocialLinksManager } from "@/components/dashboard/social-links-manager"
import { ProfileEditor } from "@/components/dashboard/profile-editor"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch social links
  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", user.id)
    .order("display_order", { ascending: true })

  // Fetch analytics summary
  const { data: analyticsData } = await supabase
    .from("analytics")
    .select("tap_count, unique_visitors")
    .eq("user_id", user.id)

  const totalTaps = analyticsData?.reduce((sum, day) => sum + (day.tap_count || 0), 0) || 0
  const totalVisitors = analyticsData?.reduce((sum, day) => sum + (day.unique_visitors || 0), 0) || 0

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your digital business card</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Profile Preview */}
            <div className="lg:col-span-1">
              <ProfileCard profile={profile} />
            </div>

            {/* Right Column - Stats and Management */}
            <div className="space-y-6 lg:col-span-2">
              <QuickStats totalTaps={totalTaps} totalVisitors={totalVisitors} uniqueId={profile?.unique_id || ""} />

              <ProfileEditor profile={profile} />

              <SocialLinksManager socialLinks={socialLinks || []} userId={user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
