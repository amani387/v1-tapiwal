import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"

export default async function HotelMenuPage() {
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
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/hotel"
                className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
              <p className="text-muted-foreground">Manage your hotel menu items</p>
            </div>
            <Link href="/dashboard/hotel/menu/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {menuItems && menuItems.length > 0 ? (
              menuItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{item.name}</CardTitle>
                        {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                      <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/hotel/menu/${item.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No menu items yet. Create your first item to get started.</p>
                  <Link href="/dashboard/hotel/menu/new" className="mt-4 inline-block">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Item
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
