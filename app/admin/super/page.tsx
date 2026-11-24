import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminManagement } from "@/components/admin/admin-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/admin/users-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Users, Shield, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default async function SuperAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Check if user is super admin
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Fetch all users
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  // Fetch all admins
  const { data: admins } = await supabase
    .from("users")
    .select("*")
    .in("role", ["admin", "super_admin"])
    .order("created_at", { ascending: false })

  // Fetch platform-wide analytics
  const { data: allAnalytics } = await supabase.from("analytics").select("tap_count, unique_visitors")

  const totalUsers = users?.length || 0
  const activeUsers = users?.filter((u) => u.is_active).length || 0
  const totalAdmins = admins?.filter((a) => a.role === "admin").length || 0
  const totalTaps = allAnalytics?.reduce((sum, day) => sum + (day.tap_count || 0), 0) || 0
  const totalVisitors = allAnalytics?.reduce((sum, day) => sum + (day.unique_visitors || 0), 0) || 0

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <DashboardHeader user={profile} />

      <main className="flex-1 pb-16">
        <div className="container py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/60">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Super Admin Console
                </h1>
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-xs">
                  <Crown className="h-3 w-3" /> Root Access
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage global users, platform metrics, and administrative permissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/orders">
                <Button variant="outline" size="sm" className="gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  View Orders
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-6">
            <AdminStats
              totalUsers={totalUsers}
              activeUsers={activeUsers}
              totalTaps={totalTaps}
              totalVisitors={totalVisitors}
              totalAdmins={totalAdmins}
            />

            {/* Management Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="bg-background border border-border/60 p-1 rounded-xl shadow-xs">
                <TabsTrigger value="users" className="gap-2 rounded-lg data-[state=active]:bg-muted data-[state=active]:font-semibold">
                  <Users className="h-4 w-4" />
                  All Users Directory ({totalUsers})
                </TabsTrigger>
                <TabsTrigger value="admins" className="gap-2 rounded-lg data-[state=active]:bg-muted data-[state=active]:font-semibold">
                  <Shield className="h-4 w-4" />
                  Admin Roles & Permissions ({admins?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4 focus-visible:outline-none">
                <UsersTable users={users || []} isSuperAdmin={true} />
              </TabsContent>

              <TabsContent value="admins" className="space-y-4 focus-visible:outline-none">
                <AdminManagement admins={admins || []} allUsers={users || []} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
