import { supabase } from "./supabase"

export async function getUserStats(userId: string) {
  // Get profile data with fallback
  let { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, daily_usage, total_scripts")
    .eq("id", userId)
    .single()

  // If profile doesn't exist, create it
  if (profileError && profileError.code === "PGRST116") {
    console.log("Creating missing profile for stats:", userId)

    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: "", // Will be updated later
        plan: "free",
        daily_usage: 0,
        total_scripts: 0,
      })
      .select("plan, daily_usage, total_scripts")
      .single()

    if (!createError) {
      profile = newProfile
    } else {
      // Fallback to default values
      profile = {
        plan: "free",
        daily_usage: 0,
        total_scripts: 0,
      }
    }
  }

  // Get this week's scripts
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { count: thisWeekScripts } = await supabase
    .from("scripts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", weekAgo.toISOString())

  return {
    dailyUsage: profile?.daily_usage || 0,
    totalScripts: profile?.total_scripts || 0,
    thisWeekScripts: thisWeekScripts || 0,
    plan: "pro", // Force pro plan for admin
  }
}
