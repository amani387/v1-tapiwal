import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"

export default async function HotelCategoriesPage() {
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
    .order("display_order", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto container py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/hotel"
                className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Menu Categories</h1>
              <p className="text-muted-foreground">Organize your menu by categories</p>
            </div>
            <Link href="/dashboard/hotel/categories/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/hotel/categories/${category.id}/edit`}>
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
                  <p className="text-muted-foreground">
                    No categories yet. Create your first category to organize your menu.
                  </p>
                  <Link href="/dashboard/hotel/categories/new" className="mt-4 inline-block">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Category
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
