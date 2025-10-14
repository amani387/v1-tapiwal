"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function setupSuperAdmin(formData: {
  fullName: string
  email: string
  password: string
  phone: string
}) {
  try {
    console.log("[v0] Server: Starting super admin setup...")

    const adminClient = createAdminClient()

    const { data: existingAdmins, error: checkError } = await adminClient
      .from("users")
      .select("id")
      .eq("role", "super_admin")

    if (existingAdmins && existingAdmins.length > 0) {
      console.log("[v0] Server: Super admin already exists")
      return { success: false, error: "Super admin already exists" }
    }

    console.log("[v0] Server: Creating auth user...")

    const { data: authData, error: signUpError } = await adminClient.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true,
      user_metadata: {
        full_name: formData.fullName,
        phone: formData.phone,
        role: "super_admin",
      },
    })

    let userId: string | null = null

    if (signUpError && signUpError.message.includes("already been registered")) {
      console.log("[v0] Server: User already exists in Auth, looking up user...")

      // Get the existing user by email
      const { data: existingUser, error: getUserError } = await adminClient.auth.admin.listUsers()

      if (getUserError) {
        console.error("[v0] Server: Failed to list users:", getUserError)
        return { success: false, error: getUserError.message }
      }

      const user = existingUser.users.find((u) => u.email === formData.email)

      if (!user) {
        console.error("[v0] Server: User exists but couldn't find them")
        return { success: false, error: "User exists but couldn't be found. Please contact support." }
      }

      userId = user.id
      console.log("[v0] Server: Found existing user:", userId)

      // Update the user's metadata and password
      const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          full_name: formData.fullName,
          phone: formData.phone,
          role: "super_admin",
        },
      })

      if (updateError) {
        console.error("[v0] Server: Failed to update user:", updateError)
      }
    } else if (signUpError) {
      console.error("[v0] Server: Auth creation error:", signUpError)
      return { success: false, error: signUpError.message }
    } else if (authData?.user) {
      userId = authData.user.id
      console.log("[v0] Server: Auth user created:", userId)
    }

    if (!userId) {
      console.error("[v0] Server: No user ID available")
      return { success: false, error: "Failed to create or find user" }
    }

    // Wait a bit for trigger to fire
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user was created in users table by trigger
    const { data: userData, error: userCheckError } = await adminClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    console.log("[v0] Server: User in table:", userData)

    if (!userData) {
      console.log("[v0] Server: Trigger didn't create user, creating manually...")

      // Manually create user in users table
      const { error: insertError } = await adminClient.from("users").insert({
        id: userId,
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        role: "super_admin",
        is_admin: true,
        is_active: true,
      })

      if (insertError) {
        console.error("[v0] Server: Failed to insert user:", insertError)
        return { success: false, error: insertError.message }
      }
    } else if (userData.role !== "super_admin") {
      console.log("[v0] Server: Updating user role to super_admin...")

      // Update role if not set correctly
      const { error: updateError } = await adminClient
        .from("users")
        .update({ role: "super_admin", is_admin: true })
        .eq("id", userId)

      if (updateError) {
        console.error("[v0] Server: Failed to update role:", updateError)
      }
    }

    console.log("[v0] Server: Super admin setup complete!")

    return { success: true, userId }
  } catch (error: any) {
    console.error("[v0] Server: Unexpected error:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

export async function checkSuperAdminExists() {
  try {
    const adminClient = createAdminClient()

    const { data, error } = await adminClient.from("users").select("id").eq("role", "super_admin").maybeSingle()

    // maybeSingle returns null if no rows found, which is not an error
    return { exists: !!data, checkError: error?.message }
  } catch (error: any) {
    return { exists: false, checkError: error.message }
  }
}
