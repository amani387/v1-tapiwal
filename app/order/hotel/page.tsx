"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Zap, ArrowLeft, Loader2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export default function HotelOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    number_of_cards: 1,
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createBrowserClient()

      const { error } = await supabase.from("orders").insert({
        order_type: "hotel",
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company_name,
        number_of_cards: formData.number_of_cards,
        message: formData.message,
        status: "pending",
      })

      if (error) throw error

      router.push("/order/success")
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("Failed to submit order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="c flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Tapiwal</span>
          </Link>
        </div>
      </header>

      <main className=" flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-2xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-3 pb-8">
              <CardTitle className="text-3xl font-bold">Order Digital Menu Cards for Your Hotel</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Create beautiful digital menu cards for your guests. Fill out the form and we'll contact you with
                pricing and next steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-base">
                    Hotel Name *
                  </Label>
                  <Input
                    id="company_name"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Your Hotel Name"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-base">
                    Your Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@hotel.com"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number_of_cards" className="text-base">
                    Number of Menu Cards Needed *
                  </Label>
                  <Input
                    id="number_of_cards"
                    type="number"
                    min="1"
                    required
                    value={formData.number_of_cards}
                    onChange={(e) => setFormData({ ...formData, number_of_cards: Number.parseInt(e.target.value) })}
                    className="h-12 text-base"
                  />
                  <p className="text-sm text-muted-foreground">How many NFC menu cards do you need?</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base">
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your menu, special requirements, or any questions..."
                    rows={4}
                    className="resize-none text-base"
                  />
                </div>

                <div className="rounded-lg bg-muted/50 p-6">
                  <h3 className="mb-2 font-semibold">What happens next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• We'll contact you within 24 hours with a custom quote</li>
                    <li>• After payment, you'll receive an invitation to set up your hotel account</li>
                    <li>• Create and manage your digital menu from your dashboard</li>
                    <li>• We'll encode and ship all NFC cards to your location</li>
                    <li>• Your guests can scan the card to view your menu instantly</li>
                  </ul>
                </div>

                <Button type="submit" size="lg" className="h-14 w-full text-base shadow-lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Order Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
