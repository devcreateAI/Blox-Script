"use client"

import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { ScriptGenerator } from "@/components/script-generator"
import { ScriptHistory } from "@/components/script-history"
import { UsageStats } from "@/components/usage-stats"

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-scripton-cyan border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <ScriptGenerator user={user} />
          </div>
          <div className="space-y-8">
            <UsageStats user={user} />
            <ScriptHistory user={user} />
          </div>
        </div>
      </main>
    </div>
  )
}
