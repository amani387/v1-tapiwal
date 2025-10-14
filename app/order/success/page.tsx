import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, CheckCircle2, Mail, Clock } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Tapiwal</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-2xl border-border/50 shadow-xl">
          <CardHeader className="space-y-6 pb-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold">Order Request Received!</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Thank you for your interest in Tapiwal. We've received your order request and will be in touch soon.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Check Your Email</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    You'll receive a confirmation email shortly with your order details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">We'll Contact You Soon</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Our team will reach out within 24 hours to discuss payment options and next steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
              <h3 className="mb-3 font-semibold">What to Expect Next:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. We'll contact you to finalize payment details</li>
                <li>2. After payment, you'll receive an invitation link to create your profile</li>
                <li>3. Your NFC card(s) will be encoded with your unique profile URL</li>
                <li>4. We'll ship your card(s) to your specified address</li>
                <li>5. Start networking with your new digital business card!</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="flex-1">
                <Button variant="outline" size="lg" className="h-12 w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
