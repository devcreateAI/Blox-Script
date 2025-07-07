import { supabase } from "./supabase"

export async function upgradeToPro(userId: string) {
  // In a real app, you'd integrate with Stripe or another payment processor
  // For this demo, we'll just update the user's plan directly

  const { error } = await supabase
    .from("profiles")
    .update({
      plan: "pro",
      daily_usage: 0, // Reset usage when upgrading
    })
    .eq("id", userId)

  if (error) throw error

  return { success: true }
}

export async function cancelSubscription(userId: string) {
  const { error } = await supabase.from("profiles").update({ plan: "free" }).eq("id", userId)

  if (error) throw error

  return { success: true }
}
