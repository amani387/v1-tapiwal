import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { AnalyticsChart } from "@/components/analytics/analytics-chart"
import { RecentViews } from "@/components/analytics/recent-views"

export default async function AnalyticsPage() {
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

  // Fetch analytics data for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: analyticsData } = await supabase
    .from("analytics")
    .select("*")
    .eq("user_id", user.id)
    .gte("tap_date", thirtyDaysAgo.toISOString().split("T")[0])
    .order("tap_date", { ascending: true })

  // Fetch recent profile views
  const { data: recentViews } = await supabase
    .from("profile_views")
    .select("*")
    .eq("user_id", user.id)
    .order("viewed_at", { ascending: false })
    .limit(10)

  // Calculate totals
  const totalTaps = analyticsData?.reduce((sum, day) => sum + (day.tap_count || 0), 0) || 0
  const totalVisitors = analyticsData?.reduce((sum, day) => sum + (day.unique_visitors || 0), 0) || 0

  // Calculate today's stats
  const today = new Date().toISOString().split("T")[0]
  const todayStats = analyticsData?.find((day) => day.tap_date === today)
  const todayTaps = todayStats?.tap_count || 0
  const todayVisitors = todayStats?.unique_visitors || 0

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Track your profile performance and engagement</p>
          </div>

          <div className="space-y-6">
            <AnalyticsOverview
              totalTaps={totalTaps}
              totalVisitors={totalVisitors}
              todayTaps={todayTaps}
              todayVisitors={todayVisitors}
            />

            <AnalyticsChart data={analyticsData || []} />

            <RecentViews views={recentViews || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
