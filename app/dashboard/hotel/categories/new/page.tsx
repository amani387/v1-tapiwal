"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCategoryPage() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [hotelMenu, setHotelMenu] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Validate user role
      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()
      if (profile?.account_type !== "hotel") {
        router.push("/dashboard")
        return
      }

      // Fetch hotel menu
      const { data: menu } = await supabase.from("hotel_menus").select("*").eq("user_id", user.id).single()
      if (!menu) {
        setError("Hotel menu not found. Please set up your menu first.")
        return
      }

      setHotelMenu(menu)
    }

    fetchData()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!name.trim()) {
      setError("Category name is required.")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("menu_categories").insert({
        name,
        description,
        menu_id: hotelMenu?.id,
      }) 

      if (error) throw error

      router.push("/dashboard/hotel/menu")
    } catch (err: any) {
      setError(err.message || "Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto container py-8">
          <Link
            href="/dashboard/hotel/menu"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>

            <CardContent>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
