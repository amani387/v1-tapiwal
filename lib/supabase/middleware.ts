import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: request.cookies, // just pass cookies; do NOT mutate
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("Supabase getUser error:", userError)
    }

    const url = request.nextUrl.clone()

    // Setup page
    if (url.pathname === "/setup/super-admin") {
      const { data: superAdminExists, error } = await supabase.rpc("super_admin_exists")
      if (error) console.error("RPC error:", error)
      if (superAdminExists) {
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    // Super admin routes
    if (url.pathname.startsWith("/admin/super")) {
      if (!user) {
        url.pathname = "/auth/login"
        return NextResponse.redirect(url)
      }

      const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
      if (profile?.role !== "super_admin") {
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    // Admin routes
    if (url.pathname.startsWith("/admin")) {
      if (!user) {
        url.pathname = "/auth/login"
        return NextResponse.redirect(url)
      }

      const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
      if (!["admin", "super_admin"].includes(profile?.role || "")) {
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    // Protected dashboard
    if (url.pathname.startsWith("/dashboard") && !user) {
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    // Auth pages
    if (
      user &&
      (url.pathname.startsWith("/auth/login") || url.pathname.startsWith("/auth/sign-up"))
    ) {
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (err) {
    console.error("Middleware error:", err)
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}
