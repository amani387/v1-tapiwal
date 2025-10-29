import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PublicProfileView } from "@/components/public-profile/public-profile-view"
import { HotelProfileView } from "@/components/public-profile/hotel-profile-view"

interface PageProps {
  params: Promise<{
    uniqueId: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { uniqueId } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from("users")
    .select("full_name, bio, job_title, company, account_type")
    .eq("unique_id", uniqueId)
    .eq("is_active", true)
    .single()

  if (!user) {
    return {
      title: "Profile Not Found - Tapiwal",
    }
  }

  return {
    title: `${user.full_name} - Tapiwal`,
    description: user.bio || `${user.job_title ? user.job_title + " at " : ""}${user.company || "Professional"}`,
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { uniqueId } = await params
  const supabase = await createClient()

  // Fetch user profile
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("unique_id", uniqueId)
    .eq("is_active", true)
    .single()

  if (error || !user) {
    notFound()
  }

  if (user.account_type === "hotel") {
    // Fetch hotel menu
    const { data: hotelMenu } = await supabase
      .from("hotel_menus")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    // Fetch menu categories
    const { data: categories } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("menu_id", hotelMenu?.id || "")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    // Fetch menu items
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("*")
      .in("category_id", categories?.map((c) => c.id) || [])
      .eq("is_available", true)
      .order("display_order", { ascending: true })

    return (
      <HotelProfileView user={user} hotelMenu={hotelMenu} categories={categories || []} menuItems={menuItems || []} />
    )
  }

  // Fetch social links for regular profiles
  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return <PublicProfileView user={user} socialLinks={socialLinks || []} />
}
