import { redirect } from "next/navigation"
import { UpgradeForm } from "@/components/upgrade-form"
import { getCurrentUser } from "@/lib/auth"

export default async function UpgradePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <UpgradeForm user={user} />
      </div>
    </div>
  )
}
