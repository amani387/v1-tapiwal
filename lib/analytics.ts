import { createAdminClient } from "./supabase/admin"

export async function trackProfileView(
  userId: string,
  viewerData?: { ip?: string; userAgent?: string; referrer?: string },
) {
  const supabase = createAdminClient()

  try {
    // Insert profile view record
    await supabase.from("profile_views").insert({
      user_id: userId,
      viewer_ip: viewerData?.ip,
      viewer_user_agent: viewerData?.userAgent,
      referrer: viewerData?.referrer,
    })

    // Update or insert daily analytics
    const today = new Date().toISOString().split("T")[0]

    const { data: existingAnalytics } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", userId)
      .eq("tap_date", today)
      .single()

    if (existingAnalytics) {
      // Update existing record
      await supabase
        .from("analytics")
        .update({
          tap_count: existingAnalytics.tap_count + 1,
          unique_visitors: existingAnalytics.unique_visitors + 1,
        })
        .eq("id", existingAnalytics.id)
    } else {
      // Create new record
      await supabase.from("analytics").insert({
        user_id: userId,
        tap_date: today,
        tap_count: 1,
        unique_visitors: 1,
      })
    }
  } catch (error) {
    console.error("Failed to track profile view:", error)
  }
}
