"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  ExternalLink,
  UserX,
  UserCheck,
  Shield,
  Crown,
  Building2,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UsersTableProps {
  users: User[]
  isSuperAdmin?: boolean
}

export function UsersTable({ users, isSuperAdmin = false }: UsersTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.unique_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("users").update({ is_active: !currentStatus }).eq("id", userId)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Failed to update user status:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!isSuperAdmin) return
    setIsLoading(true)
    const supabase = createClient()

    try {
      const newRole = !currentStatus ? "admin" : "user"
      const { error } = await supabase
        .from("users")
        .update({
          is_admin: !currentStatus,
          role: newRole,
        })
        .eq("id", userId)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Failed to update admin status:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Users Directory</CardTitle>
            <CardDescription>View, search, and manage all accounts on the platform</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name, email, ID..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-background h-9 text-sm"
              />
            </div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              aria-label="Rows per page"
              className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scrollable Container with horizontal protection */}
        <div className="rounded-xl border border-border/60 overflow-x-auto shadow-xs">
          <div className="min-w-[760px]">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Tap ID</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => {
                    const isUserSuperAdmin = user.role === "super_admin"
                    const isUserAdmin = user.role === "admin"
                    const canManage = isSuperAdmin ? !isUserSuperAdmin : !isUserSuperAdmin && !isUserAdmin

                    return (
                      <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{user.full_name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <code className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono font-medium text-foreground">
                            {user.unique_id}
                          </code>
                        </TableCell>

                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                            {user.account_type === "company" ? (
                              <Building2 className="h-3 w-3" />
                            ) : (
                              <UserIcon className="h-3 w-3" />
                            )}
                            {user.account_type || "individual"}
                          </span>
                        </TableCell>

                        <TableCell>
                          {user.is_active ? (
                            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-medium">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive font-medium">
                              Deactivated
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {isUserSuperAdmin ? (
                            <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-xs font-semibold">
                              <Crown className="h-3 w-3" /> Super Admin
                            </Badge>
                          ) : isUserAdmin ? (
                            <Badge variant="secondary" className="gap-1 text-xs font-medium">
                              <Shield className="h-3 w-3 text-primary" /> Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              User
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={isLoading} className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/u/${user.unique_id}`} className="cursor-pointer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>

                              {canManage && (
                                <DropdownMenuItem
                                  onClick={() => handleToggleActive(user.id, user.is_active)}
                                  className={user.is_active ? "text-destructive focus:text-destructive cursor-pointer" : "text-emerald-600 focus:text-emerald-600 cursor-pointer"}
                                >
                                  {user.is_active ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Deactivate User
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Activate User
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}

                              {isSuperAdmin && !isUserSuperAdmin && (
                                <DropdownMenuItem
                                  onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                                  className="cursor-pointer"
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  {user.is_admin ? "Demote to User" : "Promote to Admin"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination & Status Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <strong className="text-foreground">
              {filteredUsers.length === 0 ? 0 : startIndex + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-foreground">
              {Math.min(startIndex + pageSize, filteredUsers.length)}
            </strong>{" "}
            of <strong className="text-foreground">{filteredUsers.length}</strong> accounts
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={validCurrentPage === 1}
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="px-2 font-medium text-foreground">
                Page {validCurrentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={validCurrentPage === totalPages}
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
