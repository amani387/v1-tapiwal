"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Copy,
  Check,
  UserX,
  UserCheck,
  Trash2,
  Building2,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import type { Company, Employee } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CompanyTeamManagerProps {
  company: Company
  employees: Employee[]
}

export function CompanyTeamManager({ company, employees }: CompanyTeamManagerProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
  })

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.unique_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize)

  const generateTapId = () => {
    const chars = "0123456789ABCDEF"
    let result = "tap_"
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const uniqueId = generateTapId()

      const { error } = await supabase.from("employees").insert({
        company_id: company.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        title: formData.title || null,
        bio: formData.bio || null,
        unique_id: uniqueId,
        is_active: true,
      })

      if (error) throw error

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        title: "",
        bio: "",
      })
      setIsDialogOpen(false)
      router.refresh()
    } catch (err: unknown) {
      console.error("Error adding employee card:", err)
      alert(err instanceof Error ? err.message : "Failed to add team member")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (employeeId: string, currentStatus: boolean) => {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from("employees")
        .update({ is_active: !currentStatus })
        .eq("id", employeeId)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Error toggling employee status:", err)
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to remove this team member's digital card?")) return

    const supabase = createClient()
    try {
      const { error } = await supabase.from("employees").delete().eq("id", employeeId)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Error deleting employee:", err)
    }
  }

  const copyCardLink = (uniqueId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/u/${uniqueId}`
      navigator.clipboard.writeText(url)
      setCopiedId(uniqueId)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const activeCount = employees.filter((e) => e.is_active).length

  return (
    <div className="space-y-6">
      {/* Company Header & Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Organization
            </CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-foreground truncate">{company.name}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Corporate Account Tier</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Team Cards
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{employees.length}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Assigned digital NFC identities</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Cards
            </CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {employees.length > 0 ? `${Math.round((activeCount / employees.length) * 100)}% operational` : "Ready to assign"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Management Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Team Member Cards</CardTitle>
              <CardDescription>
                Create, manage, and monitor NFC digital cards for each staff member
              </CardDescription>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 font-semibold shadow-xs">
                  <Plus className="h-4 w-4" /> Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Issue New Team Digital Card</DialogTitle>
                  <DialogDescription>
                    Provide employee details. A unique Tap ID will be automatically generated.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="empFullName">Full Name *</Label>
                    <Input
                      id="empFullName"
                      placeholder="Jane Smith"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="empEmail">Corporate Email *</Label>
                    <Input
                      id="empEmail"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="empTitle">Job Title</Label>
                      <Input
                        id="empTitle"
                        placeholder="VP of Operations"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="empPhone">Phone Number</Label>
                      <Input
                        id="empPhone"
                        placeholder="+251 9..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="empBio">Bio / Department</Label>
                    <Textarea
                      id="empBio"
                      placeholder="Leading executive operations..."
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="font-semibold gap-2">
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Generate Digital Card
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search bar and Rows Filter */}
          <div className="flex items-center gap-2 max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff by name, title, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 h-9 text-sm bg-background"
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
            </select>
          </div>

          {/* Scrollable Container with horizontal table wrapper */}
          <div className="rounded-xl border border-border/60 overflow-x-auto shadow-xs">
            <div className="min-w-[720px]">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="font-semibold">Team Member</TableHead>
                    <TableHead className="font-semibold">Job Title</TableHead>
                    <TableHead className="font-semibold">Tap ID</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Issued</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        {employees.length === 0
                          ? "No team cards issued yet. Click 'Add Team Member' to create your first employee card."
                          : "No team members found matching your search."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEmployees.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{emp.full_name}</p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {emp.title || <span className="text-muted-foreground text-xs italic">Not set</span>}
                        </TableCell>
                        <TableCell>
                          <code className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono font-medium text-foreground">
                            {emp.unique_id}
                          </code>
                        </TableCell>
                        <TableCell>
                          {emp.is_active ? (
                            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-medium">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive font-medium">
                              Deactivated
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(emp.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyCardLink(emp.unique_id)}
                              className="h-8 px-2 text-xs gap-1"
                              title="Copy Profile Link"
                            >
                              {copiedId === emp.unique_id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs gap-1">
                              <Link href={`/u/${emp.unique_id}`} target="_blank">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleToggleActive(emp.id, emp.is_active)}>
                                  {emp.is_active ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" /> Deactivate Card
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" /> Activate Card
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteEmployee(emp.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Card
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
            <div>
              Showing{" "}
              <strong className="text-foreground">
                {filteredEmployees.length === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(startIndex + pageSize, filteredEmployees.length)}
              </strong>{" "}
              of <strong className="text-foreground">{filteredEmployees.length}</strong> team cards
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={validCurrentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
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
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={validCurrentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
