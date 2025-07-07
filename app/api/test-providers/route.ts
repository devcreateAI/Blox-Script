import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function GET() {
  const results = {
    availableProviders: [],
    recommendedSetup: null,
    testResults: {},
    claudeModels: [],
  }

  // Test Claude (Anthropic) - Priority testing
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { createAnthropic } = await import("@ai-sdk/anthropic")
      const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      // Test Claude 3 Opus (best for Lua)
      try {
        const { text } = await generateText({
          model: anthropic("claude-3-opus-20240229"),
          prompt: "Generate a simple Lua comment saying 'Claude Opus is working for Roblox!'",
        })
        results.availableProviders.push("Claude 3 Opus (🏆 Best for Lua)")
        results.claudeModels.push("claude-3-opus-20240229")
        results.testResults["claude-opus"] = { status: "success", response: text }
      } catch (error) {
        results.testResults["claude-opus"] = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }

      // Test Claude 3.5 Sonnet
      try {
        const { text } = await generateText({
          model: anthropic("claude-3-5-sonnet-20241022"),
          prompt: "Generate a simple Lua comment saying 'Claude Sonnet is working!'",
        })
        results.availableProviders.push("Claude 3.5 Sonnet (Fast & Excellent)")
        results.claudeModels.push("claude-3-5-sonnet-20241022")
        results.testResults["claude-sonnet"] = { status: "success", response: text }
      } catch (error) {
        results.testResults["claude-sonnet"] = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }

      // Test Claude 3 Haiku
      try {
        const { text } = await generateText({
          model: anthropic("claude-3-haiku-20240307"),
          prompt: "Generate a simple Lua comment saying 'Claude Haiku is working!'",
        })
        results.availableProviders.push("Claude 3 Haiku (Quick)")
        results.claudeModels.push("claude-3-haiku-20240307")
        results.testResults["claude-haiku"] = { status: "success", response: text }
      } catch (error) {
        results.testResults["claude-haiku"] = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    } catch (error) {
      results.testResults.anthropic = {
        status: "error",
        error: error instanceof Error ? error.message : "Anthropic SDK error",
      }
    }
  }

  // Test other providers...
  if (process.env.GROQ_API_KEY) {
    try {
      const { createGroq } = await import("@ai-sdk/groq")
      const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

      const { text } = await generateText({
        model: groq("llama-3.1-70b-versatile"),
        prompt: "Say 'Groq is working!' and nothing else.",
      })

      results.availableProviders.push("Groq Llama 3.1 70B (Free)")
      results.testResults.groq = { status: "success", response: text }
    } catch (error) {
      results.testResults.groq = {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Determine recommended setup
  if (results.claudeModels.length > 0) {
    results.recommendedSetup = {
      provider: "claude",
      reason: `Claude ${results.claudeModels.includes("claude-3-opus-20240229") ? "Opus" : "Sonnet"} - Best for Roblox Lua scripting`,
      url: "https://console.anthropic.com",
    }
  } else if (results.availableProviders.length === 0) {
    results.recommendedSetup = {
      provider: "claude",
      reason: "Claude Opus is the top choice for sophisticated Roblox Lua generation",
      url: "https://console.anthropic.com",
    }
  } else {
    results.recommendedSetup = {
      provider: "current",
      reason: `You have ${results.availableProviders.join(", ")} configured`,
      url: null,
    }
  }

  return NextResponse.json(results)
}
