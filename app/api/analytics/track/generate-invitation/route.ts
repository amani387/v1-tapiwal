import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { orderId, email, accountType } = await request.json()

    // Generate unique invitation code
    const invitationCode = `INV-${nanoid(12).toUpperCase()}`

    // Create invitation record
    const { error: inviteError } = await supabase.from("invitations").insert({
      code: invitationCode,
      email,
      account_type: accountType,
      order_id: orderId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })

    if (inviteError) {
      console.error("Error creating invitation:", inviteError)
      return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
    }

    // Update order status
    await supabase.from("orders").update({ status: "invitation_sent" }).eq("id", orderId)

    return NextResponse.json({
      success: true,
      invitationCode,
    })
  } catch (error) {
    console.error("Error generating invitation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
