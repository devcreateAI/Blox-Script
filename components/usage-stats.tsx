"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Crown, Zap } from "lucide-react"
import Link from "next/link"
import { getUserStats } from "@/lib/stats"

interface UsageStatsProps {
  user: any
}

interface Stats {
  dailyUsage: number
  totalScripts: number
  thisWeekScripts: number
  plan: string
}

export function UsageStats({ user }: UsageStatsProps) {
  const [stats, setStats] = useState<Stats>({
    dailyUsage: 0,
    totalScripts: 0,
    thisWeekScripts: 0,
    plan: user.plan,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [user.id])

  const loadStats = async () => {
    try {
      const userStats = await getUserStats(user.id)
      setStats(userStats)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const dailyLimit = stats?.plan === "pro" ? Number.POSITIVE_INFINITY : 5
  const usagePercentage = stats?.plan === "pro" ? 0 : ((stats?.dailyUsage || 0) / dailyLimit) * 100

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Usage Card */}
      <Card className="voxel border-white/10">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-scripton-cyan" />
            Usage Stats
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
          {stats?.plan !== "pro" && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span>Daily Usage</span>
                <span>
                  {stats?.dailyUsage || 0}/{dailyLimit}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2 md:h-3" />
              {(stats?.dailyUsage || 0) >= dailyLimit && (
                <p className="text-xs text-red-400">Daily limit reached. Upgrade to Pro for unlimited usage.</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 md:gap-4 text-center">
            <div className="bg-[#1a1a26] rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold text-scripton-green">{stats.totalScripts}</div>
              <div className="text-xs md:text-sm text-gray-400">Total Scripts</div>
            </div>
            <div className="bg-[#1a1a26] rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold text-scripton-pink">{stats.thisWeekScripts}</div>
              <div className="text-xs md:text-sm text-gray-400">This Week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Card */}
      {stats?.plan !== "pro" && (
        <Card className="voxel border-scripton-pink/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-scripton-pink/10 via-transparent to-scripton-cyan/10 animate-pulse" />

          <CardHeader className="relative p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Crown className="w-4 h-4 md:w-5 md:h-5 text-scripton-pink" />
              Upgrade to Pro
            </CardTitle>
            <CardDescription>Unlock unlimited script generation and advanced features</CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-4 p-4 md:p-6 pt-0 md:pt-0">
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-scripton-green" />
                <span>Unlimited prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-scripton-green" />
                <span>Multi-script systems</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-scripton-green" />
                <span>Visual simulations</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-scripton-green" />
                <span>Priority support</span>
              </div>
            </div>

            <Link href="/upgrade">
              <Button className="w-full bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110 min-h-[44px]">
                Upgrade Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
