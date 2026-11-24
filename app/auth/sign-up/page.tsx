"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, Building2, User, UtensilsCrossed, CheckCircle2, Ticket, AlertCircle } from "lucide-react"

function SignUpForm() {
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [accountType, setAccountType] = useState<"individual" | "company" | "hotel">("individual")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [inviteValid, setInviteValid] = useState<boolean | null>(null)
  const [inviteData, setInviteData] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get("invite")

  // Check invitation validity if code is present
  useEffect(() => {
    if (inviteCode) {
      const validateInvite = async () => {
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from("invitations")
            .select("*")
            .eq("code", inviteCode.trim())
            .single()

          if (error || !data) {
            setInviteValid(false)
            setError("Invitation code is invalid.")
            return
          }

          if (data.used) {
            setInviteValid(false)
            setError("This invitation code has already been redeemed.")
            return
          }

          if (new Date(data.expires_at) < new Date()) {
            setInviteValid(false)
            setError("This invitation code has expired.")
            return
          }

          setInviteValid(true)
          setInviteData(data)
          if (data.email) setEmail(data.email)
          if (data.account_type && ["individual", "company", "hotel"].includes(data.account_type)) {
            setAccountType(data.account_type as any)
          }
        } catch (err) {
          console.error("Error validating invite:", err)
        }
      }

      validateInvite()
    }
  }, [inviteCode])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (accountType === "company" && !companyName.trim()) {
      setError("Please provide a Company Name")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            account_type: accountType,
            company: accountType === "company" ? companyName : undefined,
            role: "user",
          },
        },
      })

      if (signUpError) throw signUpError

      const userId = authData.user?.id
      if (userId) {
        // 1. If invitation was used, redeem it and link to order
        if (inviteData?.id) {
          await supabase
            .from("invitations")
            .update({
              used: true,
              used_by: userId,
              used_at: new Date().toISOString(),
            })
            .eq("id", inviteData.id)

          if (inviteData.order_id) {
            await supabase
              .from("orders")
              .update({ status: "completed" })
              .eq("id", inviteData.order_id)
          }
        }

        // 2. If company tier, create company record
        if (accountType === "company") {
          await supabase.from("companies").insert({
            name: companyName,
            admin_user_id: userId,
            email: email,
            is_active: true,
          })

          await supabase
            .from("users")
            .update({ company: companyName })
            .eq("id", userId)
        }

        // 3. If hotel tier, create initial menu
        if (accountType === "hotel") {
          await supabase.from("hotel_menus").insert([
            {
              user_id: userId,
              hotel_name: `${fullName}'s Hotel Menu`,
              description: "This is your default menu. Add categories and items to get started.",
            },
          ])
        }
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Tapiwal</span>
          </Link>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Get started with your digital NFC business card</CardDescription>

            {/* Invitation Code Banner */}
            {inviteCode && (
              <div className="pt-2">
                {inviteValid === true ? (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Verified invitation code applied: <strong>{inviteCode}</strong></span>
                  </div>
                ) : inviteValid === false ? (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error || "Invalid invitation code."}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-2.5 text-xs text-muted-foreground">
                    <Ticket className="h-4 w-4 shrink-0" />
                    <span>Validating invitation code {inviteCode}...</span>
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                {/* Account Type Selector */}
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">Account Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType("individual")}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                        accountType === "individual"
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/40 text-muted-foreground"
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs">Individual</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType("company")}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                        accountType === "company"
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/40 text-muted-foreground"
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                      <span className="text-xs">Company</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType("hotel")}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                        accountType === "hotel"
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/40 text-muted-foreground"
                      }`}
                    >
                      <UtensilsCrossed className="h-5 w-5" />
                      <span className="text-xs">Hotel / Menu</span>
                    </button>
                  </div>
                </div>

                {/* Company Name if Company Type */}
                {accountType === "company" && (
                  <div className="grid gap-2 animate-in fade-in duration-300">
                    <Label htmlFor="companyName">Company / Organization Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Acme Corporation"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

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
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Confirm Password</Label>
                  <PasswordInput
                    id="repeat-password"
                    placeholder="Confirm your password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>

                {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                <Button type="submit" className="w-full mt-2 font-semibold" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Complete Registration"}
                </Button>
              </div>

              <div className="mt-5 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-primary underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading registration...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
