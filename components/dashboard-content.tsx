"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { ScriptGenerator } from "@/components/script-generator"
import { ScriptHistory } from "@/components/script-history"
import { UsageStats } from "@/components/usage-stats"
import { useAuth } from "@/hooks/use-auth"

interface DashboardContentProps {
  initialUser: any
}

export function DashboardContent({ initialUser }: DashboardContentProps) {
  const { user, loading } = useAuth()
  const [currentUser, setCurrentUser] = useState(initialUser)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setCurrentUser(user)
    } else if (!loading && !user && !initialUser) {
      // Only redirect if we're not loading and definitely have no user
      router.push("/auth/signin")
    }
  }, [user, loading, initialUser, router])

  // Show loading while auth is being determined
  if (loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-scripton-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If we have no user after loading is complete, show sign in prompt
  if (!loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to continue</p>
          <a href="/auth/signin" className="text-scripton-cyan hover:underline">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={currentUser} />

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>
        </div>

        {/* Updated responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content Area - full width on mobile, 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            <ScriptGenerator user={currentUser} />
            <ScriptHistory user={currentUser} />
          </div>

          {/* Stats Panel - full width on mobile, 1/3 width on desktop */}
          <div className="lg:col-span-1">
            <UsageStats user={currentUser} />
          </div>
        </div>
      </main>
    </div>
  )
}
