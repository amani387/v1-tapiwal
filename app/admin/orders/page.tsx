import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Only allow super_admin and admin roles to access orders
  if (profile?.role !== "super_admin" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all orders
const { data: orders, error: ordersError } = await supabase
  .from("orders")
  .select("*")
  .order("created_at", { ascending: false })

console.log("orders:", orders)
console.log("ordersError:", ordersError)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground">Review orders and send invitation links to customers</p>
          </div>

          <OrdersTable orders={orders || []} />
        </div>
      </main>
    </div>
  )
}
