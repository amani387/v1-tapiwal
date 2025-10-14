import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminManagement } from "@/components/admin/admin-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/admin/users-table"

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
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Full system control and admin management</p>
          </div>

          <div className="space-y-6">
            <AdminStats
              totalUsers={totalUsers}
              activeUsers={activeUsers}
              totalTaps={totalTaps}
              totalVisitors={totalVisitors}
              totalAdmins={totalAdmins}
            />

            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">All Users</TabsTrigger>
                <TabsTrigger value="admins">Admin Management</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <UsersTable users={users || []} isSuperAdmin={true} />
              </TabsContent>

              <TabsContent value="admins" className="space-y-4">
                <AdminManagement admins={admins || []} allUsers={users || []} />
              </TabsContent>   
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
