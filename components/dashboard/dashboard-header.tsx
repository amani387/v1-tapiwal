"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import {
  Zap,
  User,
  LogOut,
  BarChart3,
  Settings,
  Shield,
  ShoppingBag,
  Crown,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import type { User as UserType } from "@/lib/types"

interface DashboardHeaderProps {
  user: UserType | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isCurrent = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(path)
  }

  const isSuperAdmin = user?.role === "super_admin"
  const isAdmin = user?.role === "admin"
  const isHotel = user?.account_type === "hotel"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-xs">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">Tapiwal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link href="/dashboard">
            <Button
              variant={isCurrent("/dashboard") ? "secondary" : "ghost"}
              size="sm"
              className={isCurrent("/dashboard") ? "font-semibold bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}
            >
              <User className="mr-1.5 h-4 w-4" />
              Profile
            </Button>
          </Link>

          <Link href="/dashboard/analytics">
            <Button
              variant={isCurrent("/dashboard/analytics") ? "secondary" : "ghost"}
              size="sm"
              className={isCurrent("/dashboard/analytics") ? "font-semibold bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}
            >
              <BarChart3 className="mr-1.5 h-4 w-4" />
              Analytics
            </Button>
          </Link>

          {isHotel && (
            <Link href="/dashboard/hotel">
              <Button
                variant={isCurrent("/dashboard/hotel") ? "secondary" : "ghost"}
                size="sm"
                className={isCurrent("/dashboard/hotel") ? "font-semibold bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                <UtensilsCrossed className="mr-1.5 h-4 w-4" />
                Hotel Menu
              </Button>
            </Link>
          )}

          {/* Orders visible to both Admin and Super Admin */}
          {(isAdmin || isSuperAdmin) && (
            <Link href="/admin/orders">
              <Button
                variant={isCurrent("/admin/orders") ? "secondary" : "ghost"}
                size="sm"
                className={isCurrent("/admin/orders") ? "font-semibold bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                <ShoppingBag className="mr-1.5 h-4 w-4" />
                Orders
              </Button>
            </Link>
          )}

          {/* Super Admin gets dedicated Super Admin link */}
          {isSuperAdmin && (
            <Link href="/admin/super">
              <Button
                variant={isCurrent("/admin/super") ? "default" : "outline"}
                size="sm"
                className={`gap-1.5 font-medium ${
                  isCurrent("/admin/super")
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border-primary/20 text-primary hover:bg-primary/10"
                }`}
              >
                <Crown className="h-4 w-4 text-amber-500" />
                Super Admin
              </Button>
            </Link>
          )}

          {/* Regular Admin gets standard Admin link */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant={isCurrent("/admin") ? "secondary" : "ghost"}
                size="sm"
                className={isCurrent("/admin") ? "font-semibold bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                <Shield className="mr-1.5 h-4 w-4 text-primary" />
                Admin
              </Button>
            </Link>
          )}

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 rounded-full ring-offset-background hover:bg-accent">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{user?.full_name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  <div className="pt-1">
                    {isSuperAdmin ? (
                      <Badge variant="default" className="text-[10px] gap-1 px-1.5 py-0 bg-amber-600">
                        <Crown className="h-2.5 w-2.5" /> Super Admin
                      </Badge>
                    ) : isAdmin ? (
                      <Badge variant="secondary" className="text-[10px] gap-1 px-1.5 py-0">
                        <Shield className="h-2.5 w-2.5" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Member
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  My Digital Card
                </Link>
              </DropdownMenuItem>
              {user?.unique_id && (
                <DropdownMenuItem asChild>
                  <Link href={`/u/${user.unique_id}`} target="_blank" className="cursor-pointer">
                    <Zap className="mr-2 h-4 w-4 text-primary" />
                    Preview Public Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/analytics" className="cursor-pointer">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </DropdownMenuItem>
              {isSuperAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/super" className="cursor-pointer text-amber-600 font-medium">
                    <Crown className="mr-2 h-4 w-4" />
                    Super Admin Console
                  </Link>
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              {(isAdmin || isSuperAdmin) && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/orders" className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders & Invites
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden space-y-1">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              isCurrent("/dashboard") ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/dashboard/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              isCurrent("/dashboard/analytics") ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          {isHotel && (
            <Link
              href="/dashboard/hotel"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                isCurrent("/dashboard/hotel") ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              <UtensilsCrossed className="h-4 w-4" />
              Hotel Menu
            </Link>
          )}
          {(isAdmin || isSuperAdmin) && (
            <Link
              href="/admin/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                isCurrent("/admin/orders") ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Orders
            </Link>
          )}
          {isSuperAdmin && (
            <Link
              href="/admin/super"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                isCurrent("/admin/super") ? "bg-primary text-primary-foreground font-medium" : "text-amber-600"
              }`}
            >
              <Crown className="h-4 w-4" />
              Super Admin
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                isCurrent("/admin") ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
          <Link
            href="/dashboard/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              handleLogout()
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
