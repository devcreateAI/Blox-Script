import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json({ success: false, error: "Provider and API key required" }, { status: 400 })
    }

    let result = null

    switch (provider) {
      case "anthropic":
        try {
          const { createAnthropic } = await import("@ai-sdk/anthropic")
          const anthropic = createAnthropic({ apiKey })

          const { text } = await generateText({
            model: anthropic("claude-3-haiku-20240307"), // Use cheapest model for testing
            prompt: "Say 'Claude API key is working!' and nothing else.",
          })

          result = { success: true, response: text, model: "Claude 3 Haiku" }
        } catch (error) {
          result = {
            success: false,
            error: error instanceof Error ? error.message : "Claude API test failed",
          }
        }
        break

      case "groq":
        try {
          const { createGroq } = await import("@ai-sdk/groq")
          const groq = createGroq({ apiKey })

          const { text } = await generateText({
            model: groq("llama-3.1-8b-instant"), // Use fastest model for testing
            prompt: "Say 'Groq API key is working!' and nothing else.",
          })

          result = { success: true, response: text, model: "Llama 3.1 8B" }
        } catch (error) {
          result = {
            success: false,
            error: error instanceof Error ? error.message : "Groq API test failed",
          }
        }
        break

      case "openai":
        try {
          const { createOpenAI } = await import("@ai-sdk/openai")
          const openai = createOpenAI({ apiKey })

          const { text } = await generateText({
            model: openai("gpt-3.5-turbo"), // Use cheaper model for testing
            prompt: "Say 'OpenAI API key is working!' and nothing else.",
          })

          result = { success: true, response: text, model: "GPT-3.5 Turbo" }
        } catch (error) {
          result = {
            success: false,
            error: error instanceof Error ? error.message : "OpenAI API test failed",
          }
        }
        break

      default:
        return NextResponse.json({ success: false, error: "Unsupported provider" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API key test error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
