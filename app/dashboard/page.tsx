import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard-content"
import { getCurrentUser } from "@/lib/auth"
import { Suspense } from "react"

function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-scripton-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  // Only redirect if we're sure there's no user (not just a timing issue)
  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent initialUser={user} />
    </Suspense>
  )
}
