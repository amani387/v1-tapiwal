"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Zap } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const err = params.get("error")
      if (err) {
        setError(decodeURIComponent(err))
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (!data.user) {
        setError("Unable to authenticate user")
        return
      }

      // ✅ Fetch the user profile to check the role and status
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, is_active, account_type")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        console.error("[v0] Error fetching user profile:", profileError)
        setError("Failed to fetch user profile")
        return
      }

      if (profile?.is_active === false) {
        setError("Your profile is deactivated. Please contact Tapiwal Company.")
        await supabase.auth.signOut() // make sure they’re logged out
        return
      }

      // ✅ Redirect based on role
      if (profile?.role === "super_admin") {
        console.log("[v0] Redirecting to super admin dashboard")
        router.push("/admin/super")
      } else if (profile?.role === "admin" && profile?.account_type === "hotel") {
        console.log("[v0] Redirecting to hotel dashboard")
        router.push("/dashboard/hotel")
      } else if (profile?.role === "admin") {
        console.log("Redirecting to admin dashboard", profile?.account_type)
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Tapiwal</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="mt-6 flex flex-col gap-2 text-center text-sm">
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="font-semibold text-primary underline-offset-4 hover:underline">
                    Sign up
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  Need a digital card?{" "}
                  <Link href="/order/individual" className="text-primary/80 hover:text-primary hover:underline">
                    Order your NFC card
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
