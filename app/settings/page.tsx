import { redirect } from "next/navigation"
import { SettingsContent } from "@/components/settings-content"
import { getCurrentUser } from "@/lib/auth"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return <SettingsContent user={user} />
}
