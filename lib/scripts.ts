import { supabase } from "./supabase"

export async function getScriptHistory(userId: string) {
  const { data, error } = await supabase
    .from("scripts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching script history:", error)
    return []
  }

  return data || []
}

export async function deleteScript(scriptId: string, userId: string) {
  const { error } = await supabase.from("scripts").delete().eq("id", scriptId).eq("user_id", userId)

  if (error) throw error
}
