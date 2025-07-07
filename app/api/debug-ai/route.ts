import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"

export async function GET() {
  try {
    console.log("Debug: Checking Anthropic API key...")

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "ANTHROPIC_API_KEY environment variable is not set",
      })
    }

    console.log("Debug: API key found, testing connection...")

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    console.log("Debug: Making test request to Claude...")

    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: "Say 'Hello from Claude!' and nothing else.",
    })

    console.log("Debug: Response received:", text)

    return NextResponse.json({
      success: true,
      response: text,
      message: "Claude AI connection successful!",
    })
  } catch (error) {
    console.error("Debug: AI Test Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : "No stack trace",
      },
      { status: 500 },
    )
  }
}
