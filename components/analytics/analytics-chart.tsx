"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import type { Analytics } from "@/lib/types"

interface AnalyticsChartProps {
  data: Analytics[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.tap_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    taps: item.tap_count,
    visitors: item.unique_visitors,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Views Over Time</CardTitle>
        <CardDescription>Your profile engagement for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="taps" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Taps" />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Unique Visitors"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
