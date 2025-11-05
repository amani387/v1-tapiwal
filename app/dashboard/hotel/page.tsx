import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, UtensilsCrossed, FolderOpen } from "lucide-react"

export default async function HotelDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (profile?.account_type !== "hotel") {
    redirect("/dashboard")
  }

  const { data: hotelMenu } = await supabase.from("hotel_menus").select("*").eq("user_id", user.id).single()

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("menu_id", hotelMenu?.id || "")

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .in("category_id", categories?.map((c) => c.id) || [])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Hotel Menu Dashboard</h1>
            <p className="text-muted-foreground">Manage your digital menu and categories</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{menuItems?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total items in menu</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{categories?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Menu categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Hotel Name</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold truncate">{hotelMenu?.hotel_name || "Not set"}</div>
                <p className="text-xs text-muted-foreground">Your hotel name</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link href="/dashboard/hotel/menu">
              <Card className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5" />
                    Manage Menu Items
                  </CardTitle>
                  <CardDescription>Add, edit, or remove menu items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Go to Menu Items
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/hotel/categories">
              <Card className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Manage Categories
                  </CardTitle>
                  <CardDescription>Organize your menu by categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Go to Categories
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
