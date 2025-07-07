"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Key, Code, Crown, Star } from "lucide-react"

export function AISetupGuide() {
  const [selectedProvider, setSelectedProvider] = useState("claude")

  const providers = {
    claude: {
      name: "Claude (Anthropic)",
      icon: Crown,
      free: false,
      tier: "Premium",
      limit: "Generous limits",
      speed: "Fast",
      quality: "🏆 Best for Lua",
      signupUrl: "https://console.anthropic.com",
      recommended: true,
      steps: [
        "Go to console.anthropic.com and create an account",
        "Add credits to your account ($5 minimum)",
        "Navigate to 'API Keys' section",
        "Create a new API key and copy it",
        "Add ANTHROPIC_API_KEY to your environment variables",
      ],
      envVar: "ANTHROPIC_API_KEY",
      models: ["Claude 3 Opus (Best)", "Claude 3.5 Sonnet (Fast)", "Claude 3 Haiku (Quick)"],
    },
    openai: {
      name: "OpenAI",
      icon: Code,
      free: false,
      tier: "Trial",
      limit: "$5 free trial",
      speed: "Fast",
      quality: "Very Good",
      signupUrl: "https://platform.openai.com/signup",
      recommended: false,
      steps: [
        "Sign up at platform.openai.com",
        "Get $5 in free trial credits",
        "Go to API Keys section",
        "Create new API key and copy it",
        "Add OPENAI_API_KEY to your environment variables",
      ],
      envVar: "OPENAI_API_KEY",
      models: ["GPT-4 Turbo", "GPT-3.5 Turbo"],
    },
  }

  return (
    <Card className="voxel border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-scripton-cyan" />
          Setup AI Generation
        </CardTitle>
        <CardDescription>
          Get the best Roblox Lua script generation with Claude Opus - the top choice for complex game development
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedProvider} onValueChange={setSelectedProvider}>
          <TabsList className="grid w-full grid-cols-2 bg-[#1a1a26]">
            {Object.entries(providers).map(([key, provider]) => (
              <TabsTrigger key={key} value={key} className="data-[state=active]:bg-scripton-cyan/20 relative">
                <provider.icon className="w-4 h-4 mr-1" />
                {provider.name}
                {provider.recommended && <Crown className="w-3 h-3 ml-1 text-scripton-pink" />}
                {provider.free && (
                  <Badge variant="secondary" className="ml-1 text-xs bg-scripton-green/20 text-scripton-green">
                    FREE
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(providers).map(([key, provider]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {provider.recommended && (
                <div className="p-4 bg-gradient-to-r from-scripton-pink/10 to-scripton-cyan/10 border border-scripton-pink/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-scripton-pink" />
                    <span className="font-medium text-scripton-pink">Recommended for Roblox Development</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Claude Opus excels at complex Lua scripting, advanced game mechanics, and sophisticated Roblox
                    systems. It understands game development patterns better than other AI models.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-[#1a1a26] rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">Limits</p>
                  <p className="font-medium text-scripton-green">{provider.limit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Speed</p>
                  <p className="font-medium">{provider.speed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Code Quality</p>
                  <p className="font-medium">{provider.quality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tier</p>
                  <p className="font-medium text-scripton-cyan">{provider.tier}</p>
                </div>
              </div>

              {provider.models && (
                <div className="space-y-2">
                  <h4 className="font-medium">Available Models:</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.models.map((model, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`${
                          model.includes("Best") || model.includes("Opus")
                            ? "border-scripton-pink/50 text-scripton-pink"
                            : "border-white/20"
                        }`}
                      >
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Setup Steps:</h4>
                <ol className="space-y-2">
                  {provider.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-scripton-cyan/20 text-scripton-cyan rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  asChild
                  className={`${
                    provider.recommended
                      ? "bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110"
                      : "bg-scripton-cyan hover:brightness-110"
                  }`}
                >
                  <a href={provider.signupUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get {provider.name} API Key
                  </a>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(provider.envVar)
                  }}
                  className="border-white/20"
                >
                  Copy Env Var Name
                </Button>
              </div>

              <div className="p-3 bg-scripton-green/10 border border-scripton-green/20 rounded-lg">
                <p className="text-sm text-scripton-green font-medium mb-1">💡 Why {provider.name}?</p>
                <p className="text-xs text-gray-400">
                  {key === "claude" &&
                    "Claude Opus is specifically trained on code and excels at complex Lua patterns, game architecture, and Roblox-specific optimizations. It produces the most sophisticated and maintainable scripts."}
                  {key === "openai" &&
                    "OpenAI provides solid code generation with free trial credits. Good general programming capabilities but less specialized for Roblox than Claude."}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
