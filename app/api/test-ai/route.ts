import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"

export async function GET() {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: false,
        demo: true,
        message: "Demo mode active - Add ANTHROPIC_API_KEY to environment variables for AI generation",
        script: `-- Demo Script (API Key Not Configured)
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    print("Hello " .. player.Name .. "! Welcome to the demo!")
end)`,
      })
    }

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: "Generate a simple 'Hello World' Roblox Lua script with a comment explaining what it does.",
    })

    return NextResponse.json({
      success: true,
      script: text,
      message: "Claude AI connection successful!",
    })
  } catch (error) {
    console.error("AI Test Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI connection failed",
      },
      { status: 500 },
    )
  }
}
