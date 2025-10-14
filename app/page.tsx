import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Share2, BarChart3, Shield, Smartphone, Globe, Building2, User, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Tapiwal</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="lg" className="text-base">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

     <section className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
        <div className="flex max-w-4xl flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-5 py-2 text-sm font-medium shadow-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">The Future of Professional Networking</span>
          </div>
          <h1 className="text-balance font-sans text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Share Your Digital Identity with a Single Tap
          </h1>
          <p className="max-w-2xl text-balance text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Transform how you network with NFC-powered digital business cards. Instantly share your contact info, social
            links, and portfolio with just a tap.
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
          <Link href="/order/company" className="flex-1">
            <Button
              size="lg"
              className="group h-auto w-full flex-col gap-2 py-6 text-base shadow-lg transition-all hover:shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span className="font-semibold">For Companies</span>
              </div>
              <span className="text-xs font-normal text-primary-foreground/80">Manage team cards & analytics</span>
              <ArrowRight className="mt-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/order/individual" className="flex-1">
            <Button
              size="lg"
              variant="outline"
              className="group h-auto w-full flex-col gap-2 border-2 py-6 text-base shadow-sm transition-all hover:bg-accent hover:shadow-md bg-transparent"
            >
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-semibold">For Individuals</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground">Get your personal digital card</span>
              <ArrowRight className="mt-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative mt-8 w-full max-w-5xl">
          <div className="aspect-video overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-2xl">
            <img
              src="/modern-digital-business-card-on-smartphone-with-nf.jpg"
              alt="Tapiwal NFC Digital Business Card"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30 py-24 lg:py-32">
        <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <div className="mb-20 flex flex-col items-center gap-6 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Everything You Need to Network Smarter
            </h2>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
              Powerful features designed to make networking effortless and professional
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-border/50 shadow-sm transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-5 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Instant Sharing</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Share your complete profile with a single tap using NFC technology. No apps required for recipients.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 shadow-sm transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-5 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Share2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">All Your Links</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Connect all your social profiles, website, and contact info in one beautiful digital card.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 shadow-sm transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-5 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Track Analytics</h3>
                <p className="leading-relaxed text-muted-foreground">
                  See who viewed your profile, when they tapped, and track your networking success over time.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 shadow-sm transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-5 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Smartphone className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Mobile Optimized</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Your digital card looks perfect on any device. Responsive design ensures a great experience.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 shadow-sm transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-5 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Custom URL</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Get your unique tapiwal.com/u/your-id link that you can share anywhere, anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 shadow-sm transition-all hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-5 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Secure & Private</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Your data is encrypted and secure. Control what you share and who can see your information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 lg:py-32">
       <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <div className="mb-20 flex flex-col items-center gap-6 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">How It Works</h2>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
              Get started in minutes and start networking like a pro
            </p>
          </div>

          <div className="grid gap-16 md:grid-cols-3">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-semibold">Place Your Order</h3>
              <p className="leading-relaxed text-muted-foreground">
                Choose individual or company plan. Fill out the order form and we'll contact you to finalize details.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-semibold">Create Your Profile</h3>
              <p className="leading-relaxed text-muted-foreground">
                After payment, receive your invitation link. Set up your profile with contact info, social links, and
                bio.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-semibold">Start Networking</h3>
              <p className="leading-relaxed text-muted-foreground">
                Receive your NFC card and tap it on any smartphone to instantly share your profile. Track views in your
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-muted/30 py-24 lg:py-32">
         <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <div className="flex flex-col items-center gap-10 text-center">
            <div className="flex max-w-3xl flex-col gap-6">
              <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Ready to Transform Your Networking?
              </h2>
              <p className="text-balance text-xl leading-relaxed text-muted-foreground">
                Join professionals who are already networking smarter with Tapiwal
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/order/company">
                <Button size="lg" className="h-14 px-8 text-base shadow-lg">
                  Order for Company
                </Button>
              </Link>
              <Link href="/order/individual">
                <Button size="lg" variant="outline" className="h-14 border-2 px-8 text-base bg-transparent">
                  Order Individual Card
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
       <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Tapiwal</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Tapiwal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
