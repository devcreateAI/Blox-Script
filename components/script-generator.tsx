"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wand2, Copy, Download, Sparkles, Code, Zap, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScriptGeneratorProps {
  user: any
}

const detectScriptType = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase()
  if (lowerPrompt.includes("weapon") || lowerPrompt.includes("gun") || lowerPrompt.includes("damage")) return "weapon"
  if (lowerPrompt.includes("npc") || lowerPrompt.includes("follow") || lowerPrompt.includes("ai")) return "npc"
  if (lowerPrompt.includes("teleport") || lowerPrompt.includes("portal")) return "teleport"
  if (lowerPrompt.includes("shop") || lowerPrompt.includes("store")) return "shop"
  return "general"
}

export function ScriptGenerator({ user }: ScriptGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [generatedScript, setGeneratedScript] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState("")
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe what you want to create.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setProgress("Initializing...")
    setGeneratedScript("")

    try {
      setProgress("Connecting to AI service...")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        setProgress("Request timed out...")
      }, 45000) // 45 second timeout

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      setProgress("Processing response...")

      const data = await response.json()

      if (!response.ok) {
        if (data.limitReached) {
          toast({
            title: "Daily Limit Reached",
            description: "Upgrade to Pro for unlimited script generation.",
            variant: "destructive",
          })
        } else if (response.status === 408) {
          toast({
            title: "Request Timed Out",
            description: "The AI service took too long to respond. Please try a simpler prompt.",
            variant: "destructive",
          })
        } else {
          throw new Error(data.error || "Failed to generate script")
        }
        return
      }

      setProgress("Script generated!")
      setGeneratedScript(data.script)

      // Check if this is demo mode
      // const isDemoMode = data.script.includes("🎮 SCRIPTON DEMO MODE") || data.script.includes("DEMO MODE:")

      toast({
        title: "Script Generated! ✨",
        description: "Your custom Roblox Lua script is ready to use.",
      })
    } catch (error) {
      console.error("Generation error:", error)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          toast({
            title: "Request Timed Out",
            description: "The request took too long. Please try again with a simpler prompt.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Generation Failed",
            description: error.message || "Something went wrong. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Generation Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
      setProgress("")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript)
      toast({
        title: "Copied! 📋",
        description: "Script copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      })
    }
  }

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `scripton-${Date.now()}.lua`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded! 📥",
      description: "Script saved to your downloads folder.",
    })
  }

  const examplePrompts = [
    "Create a weapon system with damage, reload mechanics, and sound effects",
    "Build an NPC that follows players and gives quests",
    "Make a teleportation system between different areas",
    "Create a shop GUI with purchase functionality",
    "Build a parkour system with checkpoints and timer",
  ]

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  const dailyLimit = user?.plan === "pro" ? "Unlimited" : 5
  const usageLeft = user?.plan === "pro" ? "∞" : Math.max(0, 5 - (user?.dailyUsage || 0))
  const canGenerate = user?.plan === "pro" || (user?.dailyUsage || 0) < 5

  return (
    <Card className="voxel border-white/10 hover:shadow-[0_8px_24px_-4px_rgba(0,204,255,0.3)] hover:border-scripton-cyan/30 transition-all duration-300">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 rounded-lg bg-gradient-to-br from-scripton-cyan/30 to-scripton-pink/30 shadow-lg">
            <Wand2 className="w-5 h-5 text-scripton-cyan" />
          </div>
          Roblox Script Generator
        </CardTitle>
        <CardDescription className="text-gray-300">
          Powered by Claude AI • Describe your idea and get production-ready Roblox Lua code
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage Stats */}
        <div className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg border border-white/10 hover:border-white/20 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-scripton-green" />
              <span className="text-sm font-medium">Usage Today:</span>
            </div>
            <Badge
              variant="secondary"
              className={`transition-all duration-200 hover:scale-105 ${
                user?.plan === "pro"
                  ? "bg-scripton-pink/20 text-scripton-pink border-scripton-pink/30 hover:bg-scripton-pink/30"
                  : "bg-scripton-green/20 text-scripton-green border-scripton-green/30 hover:bg-scripton-green/30"
              }`}
            >
              {user?.plan === "pro" ? "Unlimited" : `${usageLeft} left`}
            </Badge>
          </div>

          {user?.plan !== "pro" && (
            <Badge
              variant="outline"
              className="border-scripton-cyan/50 text-scripton-cyan text-xs hover:border-scripton-cyan hover:bg-scripton-cyan/10 transition-all duration-200"
            >
              {(user?.plan || "free").toUpperCase()} Plan
            </Badge>
          )}
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Code className="w-4 h-4 text-scripton-cyan" />
              Describe your script
            </label>
          </div>
          <Textarea
            placeholder="e.g., Create a weapon system with damage, reload mechanics, and sound effects for a first-person shooter game..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] bg-[#1a1a26] border-white/10 resize-none focus:border-scripton-cyan/50 hover:border-white/20 transition-all duration-200"
            disabled={loading}
            aria-label="Script description"
          />
          <div className="text-xs text-gray-500 px-1">
            💡 For complex requests, try breaking them down into smaller parts to avoid timeouts.
          </div>

          {/* Example Prompts */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.slice(0, 3).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-xs px-3 py-1 rounded-full bg-scripton-card border border-white/10 hover:border-scripton-cyan/50 hover:bg-scripton-cyan/5 transition-all duration-200 text-gray-300 hover:text-white transform hover:scale-105"
                  disabled={loading}
                  aria-label={`Use example prompt: ${example}`}
                >
                  {example.length > 40 ? `${example.slice(0, 40)}...` : example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={loading || !canGenerate || !prompt.trim()}
          className="w-full bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110 hover:scale-105 transition-all duration-200 font-medium py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Generate Roblox script"
        >
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
              {progress || "Generating Script..."}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Roblox Script
            </>
          )}
        </Button>

        {/* Progress indicator */}
        {loading && progress && (
          <div className="text-center p-3 bg-scripton-cyan/10 border border-scripton-cyan/20 rounded-lg fade animate-pulse">
            <p className="text-sm text-scripton-cyan">{progress}</p>
            {progress.includes("timeout") && (
              <p className="text-xs text-gray-400 mt-1">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Try a simpler prompt if this continues
              </p>
            )}
          </div>
        )}

        {!canGenerate && user?.plan !== "pro" && (
          <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/15 transition-colors duration-200">
            <p className="text-sm text-red-400">
              Daily limit reached.{" "}
              <a
                href="/upgrade"
                className="text-scripton-cyan hover:underline hover:text-scripton-cyan/80 transition-colors duration-200"
              >
                Upgrade to Pro
              </a>{" "}
              for unlimited generation.
            </p>
          </div>
        )}

        {/* Generated Script */}
        {generatedScript && (
          <div className="space-y-4 fade" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-scripton-green rounded-full animate-pulse" />
                Generated Roblox Script
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="border-white/20 hover:border-scripton-cyan/50 bg-transparent hover:bg-scripton-cyan/5 transition-all duration-200 hover:scale-105"
                  aria-label="Copy script to clipboard"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadScript}
                  className="border-white/20 hover:border-scripton-green/50 bg-transparent hover:bg-scripton-green/5 transition-all duration-200 hover:scale-105"
                  aria-label="Download script file"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-scripton-card rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition-colors duration-200">
              <div className="bg-[#0d1117] px-4 py-2 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                </div>
                <span className="text-xs text-gray-400 ml-2">script.lua</span>
              </div>
              <pre className="p-6 text-sm overflow-auto max-h-96 bg-[#0d1117] hover:scrollbar-thumb-scripton-cyan/50 transition-colors duration-200">
                <code className="language-lua text-gray-100 leading-relaxed">{generatedScript}</code>
              </pre>
            </div>

            <div className="bg-scripton-green/10 border border-scripton-green/20 rounded-lg p-4 hover:bg-scripton-green/15 transition-colors duration-200">
              <p className="text-sm text-scripton-green font-medium mb-1">✅ Script Ready!</p>
              <p className="text-xs text-gray-400">
                Copy this code into a Script or LocalScript in Roblox Studio. Check the comments for placement
                instructions.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
