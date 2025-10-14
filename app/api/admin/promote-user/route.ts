import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is super admin
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (profile?.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user role
    const { error: updateError } = await supabase
      .from("users")
      .update({
        role,
        is_admin: role === "admin" || role === "super_admin",
      })
      .eq("id", userId)

    if (updateError) throw updateError

    // Log the activity
    await supabase.from("admin_activity_log").insert({
      admin_id: user.id,
      action: role === "admin" ? "promote_to_admin" : "demote_to_user",
      target_user_id: userId,
      details: { role },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
