"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { TestTube, CheckCircle, XCircle, Eye, EyeOff, Copy, ExternalLink, Crown, Code } from "lucide-react"

interface SettingsContentProps {
  user: any
}

export function SettingsContent({ user }: SettingsContentProps) {
  const [apiKeys, setApiKeys] = useState({
    anthropic: "",
    openai: "",
  })
  const [showKeys, setShowKeys] = useState({
    anthropic: false,
    openai: false,
  })
  const [testing, setTesting] = useState({
    anthropic: false,
    openai: false,
  })
  const [testResults, setTestResults] = useState({
    anthropic: null,
    openai: null,
  })
  const { toast } = useToast()

  // Load current API key status
  useEffect(() => {
    checkCurrentKeys()
  }, [])

  const checkCurrentKeys = async () => {
    try {
      const response = await fetch("/api/check-env")
      const data = await response.json()

      setTestResults({
        anthropic: data.configured.anthropic ? "configured" : null,
        openai: data.configured.openai ? "configured" : null,
      })
    } catch (error) {
      console.error("Failed to check API keys:", error)
    }
  }

  const testApiKey = async (provider: string, apiKey: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to test",
        variant: "destructive",
      })
      return
    }

    setTesting((prev) => ({ ...prev, [provider]: true }))

    try {
      const response = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      })

      const result = await response.json()

      if (result.success) {
        setTestResults((prev) => ({ ...prev, [provider]: "success" }))
        toast({
          title: "✅ API Key Valid!",
          description: `${provider} is working correctly`,
        })
      } else {
        setTestResults((prev) => ({ ...prev, [provider]: "error" }))
        toast({
          title: "❌ API Key Invalid",
          description: result.error || "Failed to validate API key",
          variant: "destructive",
        })
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [provider]: "error" }))
      toast({
        title: "Test Failed",
        description: "Could not test API key",
        variant: "destructive",
      })
    } finally {
      setTesting((prev) => ({ ...prev, [provider]: false }))
    }
  }

  const copyEnvVar = (envVar: string) => {
    navigator.clipboard.writeText(envVar)
    toast({
      title: "Copied!",
      description: `${envVar} copied to clipboard`,
    })
  }

  const providers = {
    anthropic: {
      name: "Claude (Anthropic)",
      icon: Crown,
      envVar: "ANTHROPIC_API_KEY",
      signupUrl: "https://console.anthropic.com",
      description: "🏆 Best for Roblox Lua scripting",
      tier: "Premium",
      color: "scripton-pink",
      placeholder: "sk-ant-api03-...",
    },
    openai: {
      name: "OpenAI",
      icon: Code,
      envVar: "OPENAI_API_KEY",
      signupUrl: "https://platform.openai.com",
      description: "🤖 GPT-4 and GPT-3.5",
      tier: "Trial",
      color: "scripton-cyan",
      placeholder: "sk-...",
    },
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-gray-400">Configure your AI providers and API keys</p>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="bg-[#1a1a26]">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            {Object.entries(providers).map(([key, provider]) => (
              <Card key={key} className="voxel border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${provider.color}/20`}>
                      <provider.icon className={`w-5 h-5 text-${provider.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {provider.name}
                        <Badge variant="outline" className={`border-${provider.color}/50 text-${provider.color}`}>
                          {provider.tier}
                        </Badge>
                        {testResults[key] === "configured" && (
                          <Badge className="bg-scripton-green/20 text-scripton-green border-scripton-green/30">
                            Configured
                          </Badge>
                        )}
                        {testResults[key] === "success" && <CheckCircle className="w-4 h-4 text-scripton-green" />}
                        {testResults[key] === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                      <p className="text-sm text-gray-400">{provider.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-key`}>API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`${key}-key`}
                          type={showKeys[key] ? "text" : "password"}
                          placeholder={provider.placeholder}
                          value={apiKeys[key]}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="bg-[#1a1a26] border-white/10 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))}
                        >
                          {showKeys[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button
                        onClick={() => testApiKey(key, apiKeys[key])}
                        disabled={testing[key] || !apiKeys[key].trim()}
                        className="bg-scripton-cyan hover:brightness-110"
                      >
                        {testing[key] ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                          <TestTube className="w-4 h-4" />
                        )}
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Environment variable:</span>
                    <code className="bg-[#1a1a26] px-2 py-1 rounded text-scripton-cyan">{provider.envVar}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEnvVar(provider.envVar)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="border-white/20 bg-transparent">
                      <a href={provider.signupUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Get API Key
                      </a>
                    </Button>
                  </div>

                  {key === "anthropic" && (
                    <div className="p-3 bg-scripton-pink/10 border border-scripton-pink/20 rounded-lg">
                      <p className="text-sm text-scripton-pink font-medium mb-1">💡 Claude Setup Tips:</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Personal users can skip "Business Tax ID" field</li>
                        <li>• $5 minimum credit purchase goes a long way</li>
                        <li>• Claude Opus provides the best Roblox Lua generation</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card className="voxel border-white/10">
              <CardHeader>
                <CardTitle>💡 Setup Instructions</CardTitle>
                <CardDescription>How to add API keys to your environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">For Local Development:</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-scripton-cyan/20 text-scripton-cyan rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </span>
                      <span>
                        Create a <code className="bg-[#1a1a26] px-1 rounded">.env.local</code> file in your project root
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-scripton-cyan/20 text-scripton-cyan rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </span>
                      <span>Add your API keys:</span>
                    </li>
                  </ol>
                  <div className="bg-[#0d1117] p-4 rounded-lg border border-white/10 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      {`ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
OPENAI_API_KEY=sk-your-openai-key-here`}
                    </pre>
                  </div>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 bg-scripton-cyan/20 text-scripton-cyan rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </span>
                    <span>Restart your development server</span>
                  </li>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">For Production (Vercel):</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-scripton-green/20 text-scripton-green rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </span>
                      <span>Go to your Vercel project dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-scripton-green/20 text-scripton-green rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </span>
                      <span>Navigate to Settings → Environment Variables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-scripton-green/20 text-scripton-green rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </span>
                      <span>Add each API key as a separate environment variable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-scripton-green/20 text-scripton-green rounded-full flex items-center justify-center text-xs font-medium">
                        4
                      </span>
                      <span>Redeploy your application</span>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card className="voxel border-white/10">
              <CardHeader>
                <CardTitle>Usage & Billing</CardTitle>
                <CardDescription>Monitor your API usage and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">Usage tracking coming soon...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    For now, monitor usage directly in your provider dashboards
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
