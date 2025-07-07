import { NextResponse } from "next/server"

export async function GET() {
  const envStatus = {
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    huggingface: !!process.env.HUGGINGFACE_API_KEY,
  }

  const recommendations = []

  if (!envStatus.anthropic) {
    recommendations.push({
      provider: "Claude (when ready)",
      reason: "Best quality for Roblox Lua scripting",
      url: "https://console.anthropic.com",
      priority: 2,
    })
  }

  return NextResponse.json({
    configured: envStatus,
    recommendations,
    message: envStatus.anthropic ? "Claude is ready!" : "No AI providers configured",
  })
}
