import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Eye, TrendingUp, Shield, Crown } from "lucide-react"

interface AdminStatsProps {
  totalUsers: number
  activeUsers: number
  totalTaps: number
  totalVisitors: number
  totalAdmins?: number
}

export function AdminStats({ totalUsers, activeUsers, totalTaps, totalVisitors, totalAdmins }: AdminStatsProps) {
  const isSuperAdminView = totalAdmins !== undefined

  return (
    <div
      className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${
        isSuperAdminView ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4"
      }`}
    >
      {/* Total Users */}
      <Card className="border-border/60 shadow-xs hover:border-border transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Users
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{totalUsers}</div>
          <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="border-border/60 shadow-xs hover:border-border transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Users
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <UserCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{activeUsers}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}% active rate` : "Active profiles"}
          </p>
        </CardContent>
      </Card>

      {/* Total Admins (Super Admin only) */}
      {isSuperAdminView && (
        <Card className="border-border/60 shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Admins
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Shield className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">Admin staff accounts</p>
          </CardContent>
        </Card>
      )}

      {/* Platform Taps */}
      <Card className="border-border/60 shadow-xs hover:border-border transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Platform Taps
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
            <Eye className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{totalTaps}</div>
          <p className="text-xs text-muted-foreground mt-1">NFC & link impressions</p>
        </CardContent>
      </Card>

      {/* Total Visitors */}
      <Card className="border-border/60 shadow-xs hover:border-border transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Visitors
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{totalVisitors}</div>
          <p className="text-xs text-muted-foreground mt-1">Unique visitors tracked</p>
        </CardContent>
      </Card>
    </div>
  )
}
