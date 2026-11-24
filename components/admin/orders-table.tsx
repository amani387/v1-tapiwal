"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Send,
  Copy,
  Check,
  Mail,
  Phone,
  Building2,
  User,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
} from "lucide-react"
import type { Order } from "@/lib/types"
import { useRouter } from "next/navigation"

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [invitationLink, setInvitationLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter()

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter ||
      (statusFilter === "pending" && order.status === "pending")

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize)

  const handleGenerateInvitation = async (order: Order) => {
    setIsGenerating(true)
    setSelectedOrder(order)

    try {
      const response = await fetch("/api/admin/generate-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          email: order.email,
          accountType: order.order_type,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const link = `${window.location.origin}/auth/sign-up?invite=${data.invitationCode}`
        setInvitationLink(link)
        router.refresh()
      }
    } catch (error) {
      console.error("Error generating invitation:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(invitationLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCloseDialog = () => {
    setSelectedOrder(null)
    setInvitationLink("")
    setCopied(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600">
            Pending
          </Badge>
        )
      case "invitation_sent":
        return (
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600">
            Invitation Sent
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
            Completed
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customer, email, company..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm bg-background"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("all")}
            className="h-8 text-xs font-medium"
          >
            All ({orders.length})
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("pending")}
            className="h-8 text-xs font-medium"
          >
            Pending ({orders.filter((o) => o.status === "pending").length})
          </Button>
          <Button
            variant={statusFilter === "invitation_sent" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("invitation_sent")}
            className="h-8 text-xs font-medium"
          >
            Invited ({orders.filter((o) => o.status === "invitation_sent").length})
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("completed")}
            className="h-8 text-xs font-medium"
          >
            Completed ({orders.filter((o) => o.status === "completed").length})
          </Button>
        </div>
      </div>

      {/* Scrollable Container with horizontal table wrapper */}
      <div className="rounded-xl border border-border/60 bg-card overflow-x-auto shadow-xs">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                    No orders match your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{order.full_name}</div>
                        {order.company_name && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {order.company_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          <span>{order.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" />
                          <span>{order.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                        {order.order_type === "company" ? (
                          <Building2 className="h-3 w-3" />
                        ) : order.order_type === "hotel" ? (
                          <UtensilsCrossed className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {order.order_type}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {(order.number_of_cards || order.quantity || 1)} card
                      {(order.number_of_cards || order.quantity || 1) > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleGenerateInvitation(order)}
                          disabled={isGenerating}
                          className="h-8 text-xs font-semibold gap-1.5"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Generate Invite
                        </Button>
                      )}
                      {order.status === "invitation_sent" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateInvitation(order)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy Invite Link
                        </Button>
                      )}
                      {order.status === "completed" && (
                        <Badge variant="outline" className="text-[11px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                          Fulfilled
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination & Summary Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
        <div>
          Showing{" "}
          <strong className="text-foreground">
            {filteredOrders.length === 0 ? 0 : startIndex + 1}
          </strong>{" "}
          to{" "}
          <strong className="text-foreground">
            {Math.min(startIndex + pageSize, filteredOrders.length)}
          </strong>{" "}
          of <strong className="text-foreground">{filteredOrders.length}</strong> orders
        </div>

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

      {/* Invitation Generation Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invitation Generated</DialogTitle>
            <DialogDescription>
              Share this unique onboarding link with <span className="font-semibold text-foreground">{selectedOrder?.full_name}</span> ({selectedOrder?.email}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Direct Sign-Up & Activation Link
              </label>
              <div className="flex items-center gap-2">
                <Input value={invitationLink} readOnly className="font-mono text-xs bg-muted" />
                <Button size="icon" onClick={handleCopyLink} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground space-y-1">
              <p>• Account type: <strong className="text-foreground capitalize">{selectedOrder?.order_type}</strong></p>
              <p>• Ordered cards: <strong className="text-foreground">{selectedOrder?.number_of_cards || 1}</strong></p>
              <p>• Upon sign up, this order will automatically be marked completed.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
