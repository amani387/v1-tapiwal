import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { SocialLinksManager } from "@/components/dashboard/social-links-manager"
import { ProfileEditor } from "@/components/dashboard/profile-editor"
import { CompanyTeamManager } from "@/components/dashboard/company-team-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Building2, Users } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch social links
  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", user.id)
    .order("display_order", { ascending: true })

  // Fetch analytics summary
  const { data: analyticsData } = await supabase
    .from("analytics")
    .select("tap_count, unique_visitors")
    .eq("user_id", user.id)

  const totalTaps = analyticsData?.reduce((sum, day) => sum + (day.tap_count || 0), 0) || 0
  const totalVisitors = allVisitors(analyticsData)

  function allVisitors(data: any[] | null) {
    return data?.reduce((sum, day) => sum + (day.unique_visitors || 0), 0) || 0
  }

  // If corporate account, load company and employee records
  const isCompany = profile?.account_type === "company"
  let companyData: any = null
  let employeesData: any[] = []

  if (isCompany) {
    const { data: company } = await supabase
      .from("companies")
      .select("*")
      .eq("admin_user_id", user.id)
      .single()

    companyData = company

    if (company?.id) {
      const { data: employees } = await supabase
        .from("employees")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false })

      employeesData = employees || []
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <DashboardHeader user={profile} />

      <main className="flex-1 pb-16">
        <div className="container py-8 sm:py-10 space-y-8">
          {/* Dashboard Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {isCompany ? "Corporate Dashboard" : "Dashboard"}
                </h1>
                <Badge variant={isCompany ? "default" : "secondary"} className="capitalize text-xs">
                  {isCompany ? (
                    <>
                      <Building2 className="h-3 w-3 mr-1" /> Company Tier
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" /> Individual Card
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isCompany
                  ? `Manage corporate identity and team cards for ${companyData?.name || profile?.company || "your organization"}`
                  : "Manage your digital business card, personal branding, and analytics"}
              </p>
            </div>
          </div>

          {/* Conditional Layout: Company Tabs vs Individual Grid */}
          {isCompany && companyData ? (
            <Tabs defaultValue="company-team" className="space-y-6">
              <TabsList className="bg-background border border-border/60 p-1 rounded-xl shadow-xs">
                <TabsTrigger value="company-team" className="gap-2 rounded-lg data-[state=active]:bg-muted data-[state=active]:font-semibold">
                  <Users className="h-4 w-4" />
                  Team Cards Directory ({employeesData.length})
                </TabsTrigger>
                <TabsTrigger value="primary-card" className="gap-2 rounded-lg data-[state=active]:bg-muted data-[state=active]:font-semibold">
                  <User className="h-4 w-4" />
                  Corporate Admin Card
                </TabsTrigger>
              </TabsList>

              <TabsContent value="company-team" className="space-y-6 focus-visible:outline-none">
                <CompanyTeamManager company={companyData} employees={employeesData} />
              </TabsContent>

              <TabsContent value="primary-card" className="space-y-6 focus-visible:outline-none">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-1 min-w-0">
                    <ProfileCard profile={profile} />
                  </div>
                  <div className="space-y-6 lg:col-span-2 min-w-0">
                    <QuickStats totalTaps={totalTaps} totalVisitors={totalVisitors} uniqueId={profile?.unique_id || ""} />
                    <ProfileEditor profile={profile} />
                    <SocialLinksManager socialLinks={socialLinks || []} userId={user.id} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Profile Preview */}
              <div className="lg:col-span-1 min-w-0">
                <ProfileCard profile={profile} />
              </div>

              {/* Right Column - Stats and Management */}
              <div className="space-y-6 lg:col-span-2 min-w-0">
                <QuickStats totalTaps={totalTaps} totalVisitors={totalVisitors} uniqueId={profile?.unique_id || ""} />
                <ProfileEditor profile={profile} />
                <SocialLinksManager socialLinks={socialLinks || []} userId={user.id} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
