import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminStats } from "@/components/admin/admin-stats"
import { UsersTable } from "@/components/admin/users-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ShoppingBag, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  const isSuperAdmin = profile?.role === "super_admin"

  // Fetch all users
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  // Fetch platform-wide analytics
  const { data: allAnalytics } = await supabase.from("analytics").select("tap_count, unique_visitors")

  const totalUsers = users?.length || 0
  const activeUsers = users?.filter((u) => u.is_active).length || 0
  const totalTaps = allAnalytics?.reduce((sum, day) => sum + (day.tap_count || 0), 0) || 0
  const totalVisitors = allAnalytics?.reduce((sum, day) => sum + (day.unique_visitors || 0), 0) || 0

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <DashboardHeader user={profile} />

      <main className="flex-1 pb-16">
        <div className="container py-8 sm:py-10 space-y-8">
          {/* Super Admin Notice if viewing standard admin page */}
          {isSuperAdmin && (
            <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200 shadow-xs">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-600" />
                <span>You have full Super Admin access. Switch to the primary console for role management.</span>
              </div>
              <Link href="/admin/super">
                <Button size="sm" variant="outline" className="border-amber-500/40 text-xs gap-1 hover:bg-amber-500/20">
                  Super Admin Console <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/60">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Admin Dashboard
                </h1>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Shield className="h-3 w-3 text-primary" /> Staff Access
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage regular user accounts, card invitations, and platform activity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/orders">
                <Button variant="outline" size="sm" className="gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  Orders & Invites
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <AdminStats
              totalUsers={totalUsers}
              activeUsers={activeUsers}
              totalTaps={totalTaps}
              totalVisitors={totalVisitors}
            />

            <UsersTable users={users || []} isSuperAdmin={isSuperAdmin} />
          </div>
        </div>
      </main>
    </div>
  )
}
