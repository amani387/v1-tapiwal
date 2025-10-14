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
import { Search, Send, Copy, Check, Mail, Phone } from "lucide-react"
import type { Order } from "@/lib/types"
import { useRouter } from "next/navigation"

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [invitationLink, setInvitationLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const filteredOrders = orders.filter(
    (order) =>
      order.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.company_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
    navigator.clipboard.writeText(invitationLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCloseDialog = () => {
    setSelectedOrder(null)
    setInvitationLink("")
    setCopied(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "invitation_sent":
        return <Badge className="bg-blue-500">Invitation Sent</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.full_name}</div>
                      {order.company_name && <div className="text-sm text-muted-foreground">{order.company_name}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{order.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{order.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.order_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {order.quantity} card{order.quantity > 1 ? "s" : ""}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === "pending" && (
                      <Button size="sm" onClick={() => handleGenerateInvitation(order)} disabled={isGenerating}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Invitation
                      </Button>
                    )}
                    {order.status === "invitation_sent" && (
                      <Button size="sm" variant="outline" onClick={() => handleGenerateInvitation(order)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Resend
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!invitationLink} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitation Link Generated</DialogTitle>
            <DialogDescription>
              Share this link with {selectedOrder?.full_name} to complete their registration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted p-4">
              <p className="break-all text-sm font-mono">{invitationLink}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Customer Email:</strong> {selectedOrder?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Phone:</strong> {selectedOrder?.phone}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
            <Button onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
