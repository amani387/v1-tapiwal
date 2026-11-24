import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { EmailOtpType } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/dashboard"

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardUrl = next.startsWith("/") ? `${origin}${next}` : next
      return NextResponse.redirect(forwardUrl)
    }
    console.error("[Auth Callback] exchangeCodeForSession error:", error)
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      const forwardUrl = next.startsWith("/") ? `${origin}${next}` : next
      return NextResponse.redirect(forwardUrl)
    }
    console.error("[Auth Callback] verifyOtp error:", error)
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Invalid%20or%20expired%20auth%20link`)
}
