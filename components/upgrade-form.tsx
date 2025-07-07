"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Check, Zap, Layers } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { upgradeToPro } from "@/lib/billing"

interface UpgradeFormProps {
  user: any
}

export function UpgradeForm({ user }: UpgradeFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      await upgradeToPro(user.id)
      toast({
        title: "Upgraded to Pro!",
        description: "You now have unlimited script generation.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upgrade",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (user.plan === "pro") {
    return (
      <Card className="voxel border-white/10 max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Crown className="w-16 h-16 text-scripton-pink mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">You're already Pro!</h2>
          <p className="text-gray-400 mb-6">You have unlimited access to all Scripton features.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">
          Upgrade to <span className="text-scripton-pink">Pro</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Unlock unlimited script generation and advanced features to supercharge your Roblox development.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Current Plan */}
        <Card className="voxel border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              Free Plan
            </CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Check className="w-4 h-4" />
                <span>5 prompts per day</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Check className="w-4 h-4" />
                <span>Single-script output</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Check className="w-4 h-4" />
                <span>Basic support</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-sm text-gray-400">per month</div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="voxel border-scripton-pink/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-scripton-pink/10 via-transparent to-scripton-cyan/10 animate-pulse" />

          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-scripton-pink" />
              Pro Plan
            </CardTitle>
            <CardDescription>Recommended for serious developers</CardDescription>
            <Badge className="absolute top-4 right-4 bg-scripton-pink text-white">Popular</Badge>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-scripton-green" />
                <span>Unlimited prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-scripton-green" />
                <span>Multi-script systems</span>
              </div>

              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-scripton-green" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-scripton-green" />
                <span>Advanced AI models</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-scripton-green" />
                <span>Export to Studio</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="text-2xl font-bold">$19</div>
              <div className="text-sm text-gray-400">per month</div>
            </div>

            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110"
            >
              {loading ? "Processing..." : "Upgrade to Pro"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <Card className="voxel border-white/10 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>See what you get with Pro</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3">Feature</th>
                  <th className="text-center py-3">Free</th>
                  <th className="text-center py-3">Pro</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-white/5">
                  <td className="py-3">Daily script generation</td>
                  <td className="text-center py-3">5</td>
                  <td className="text-center py-3 text-scripton-green">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Multi-script systems</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3 text-scripton-green">✅</td>
                </tr>

                <tr className="border-b border-white/5">
                  <td className="py-3">Advanced AI models</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3 text-scripton-green">✅</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Priority support</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3 text-scripton-green">✅</td>
                </tr>
                <tr>
                  <td className="py-3">Export to Roblox Studio</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3 text-scripton-green">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
