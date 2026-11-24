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

  // 1. Try users table
  const { data: user } = await supabase
    .from("users")
    .select("full_name, bio, job_title, company, account_type")
    .eq("unique_id", uniqueId)
    .eq("is_active", true)
    .single()

  if (user) {
    return {
      title: `${user.full_name} - Tapiwal`,
      description: user.bio || `${user.job_title ? user.job_title + " at " : ""}${user.company || "Professional"}`,
    }
  }

  // 2. Try employees table
  const { data: employee } = await supabase
    .from("employees")
    .select("full_name, bio, title, companies(name)")
    .eq("unique_id", uniqueId)
    .eq("is_active", true)
    .single()

  if (employee) {
    const compName = (employee.companies as any)?.name
    return {
      title: `${employee.full_name} - Tapiwal`,
      description: employee.bio || `${employee.title ? employee.title + " at " : ""}${compName || "Professional"}`,
    }
  }

  return {
    title: "Profile Not Found - Tapiwal",
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { uniqueId } = await params
  const supabase = await createClient()

  // 1. Fetch user profile from users
  let profileRecord: any = null
  let isFromEmployees = false

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("unique_id", uniqueId)
    .eq("is_active", true)
    .single()

  if (user) {
    profileRecord = user
  } else {
    // 2. Fetch from employees table with company details
    const { data: employee } = await supabase
      .from("employees")
      .select("*, companies(name, website, logo_url)")
      .eq("unique_id", uniqueId)
      .eq("is_active", true)
      .single()

    if (employee) {
      isFromEmployees = true
      const companyName = (employee.companies as any)?.name || null
      const companyWebsite = (employee.companies as any)?.website || null

      profileRecord = {
        id: employee.id,
        unique_id: employee.unique_id,
        full_name: employee.full_name,
        email: employee.email,
        phone: employee.phone,
        company: companyName,
        job_title: employee.title,
        bio: employee.bio,
        profile_image_url: employee.profile_image_url,
        cover_image_url: null,
        location: null,
        website: companyWebsite,
        is_admin: false,
        is_active: employee.is_active,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
        account_type: "company",
        company_id: employee.company_id,
        role: "user",
      }
    }
  }

  if (!profileRecord) {
    notFound()
  }

  // Check if viewer is an authenticated admin, super_admin, or owner
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let viewerRole: string | null = null
  let isOwner = false

  if (authUser) {
    if (authUser.id === profileRecord.id || authUser.id === profileRecord.user_id) {
      isOwner = true
    }
    const { data: viewerData } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single()
    viewerRole = viewerData?.role || null
  }

  if (profileRecord.account_type === "hotel" && !isFromEmployees) {
    // Fetch hotel menu
    const { data: hotelMenu } = await supabase
      .from("hotel_menus")
      .select("*")
      .eq("user_id", profileRecord.id)
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
      <HotelProfileView
        user={profileRecord}
        hotelMenu={hotelMenu}
        categories={categories || []}
        menuItems={menuItems || []}
        viewerRole={viewerRole}
        isOwner={isOwner}
      />
    )
  }

  // Fetch social links for regular profiles (or empty for standalone employee cards)
  let socialLinks: any[] = []
  if (!isFromEmployees) {
    const { data: links } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", profileRecord.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    socialLinks = links || []
  }

  return (
    <PublicProfileView
      user={profileRecord}
      socialLinks={socialLinks}
      viewerRole={viewerRole}
      isOwner={isOwner}
    />
  )
}
