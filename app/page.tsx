import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Share2, BarChart3, Shield, Smartphone, Globe } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Tapiwal</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
        <div className="flex max-w-3xl flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
            <Zap className="h-4 w-4" />
            <span>The Future of Networking</span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Share Your Digital Identity with a Single Tap
          </h1>
          <p className="text-balance text-lg text-muted-foreground md:text-xl">
            Transform how you network with NFC-powered digital business cards. Instantly share your contact info, social
            links, and portfolio with just a tap.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your Card
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative mt-8 w-full max-w-4xl">
          <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
            <img
              src="/modern-digital-business-card-on-smartphone-with-nf.jpg"
              alt="Tapiwal NFC Digital Business Card"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <div className="mb-16 flex flex-col items-center gap-4 text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need to Network Smarter
            </h2>
            <p className="max-w-2xl text-balance text-lg text-muted-foreground">
              Powerful features designed to make networking effortless and professional
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Instant Sharing</h3>
                <p className="text-muted-foreground">
                  Share your complete profile with a single tap using NFC technology. No apps required for recipients.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">All Your Links</h3>
                <p className="text-muted-foreground">
                  Connect all your social profiles, website, and contact info in one beautiful digital card.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Track Analytics</h3>
                <p className="text-muted-foreground">
                  See who viewed your profile, when they tapped, and track your networking success over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Mobile Optimized</h3>
                <p className="text-muted-foreground">
                  Your digital card looks perfect on any device. Responsive design ensures a great experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Custom URL</h3>
                <p className="text-muted-foreground">
                  Get your unique tapiwal.com/u/your-id link that you can share anywhere, anytime.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and secure. Control what you share and who can see your information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <div className="mb-16 flex flex-col items-center gap-4 text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
            <p className="max-w-2xl text-balance text-lg text-muted-foreground">
              Get started in minutes and start networking like a pro
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and add your contact info, social links, bio, and profile picture in minutes.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold">Get Your NFC Card</h3>
              <p className="text-muted-foreground">
                Order your custom NFC card or use your unique link to share your profile digitally.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold">Start Networking</h3>
              <p className="text-muted-foreground">
                Tap your card on any smartphone to instantly share your profile. Track views in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex max-w-2xl flex-col gap-4">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Transform Your Networking?
              </h2>
              <p className="text-balance text-lg text-muted-foreground">
                Join thousands of professionals who are already networking smarter with Tapiwal
              </p>
            </div>
            <Link href="/auth/sign-up">
              <Button size="lg">Create Your Free Card Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Tapiwal</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Tapiwal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
