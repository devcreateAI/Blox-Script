import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Groq Setup Guide",
    steps: [
      {
        step: 1,
        title: "Sign up for free Groq account",
        url: "https://console.groq.com",
        description: "No credit card required, completely free",
      },
      {
        step: 2,
        title: "Get your API key",
        description: "Go to API Keys section and create a new key",
      },
      {
        step: 3,
        title: "Add to environment",
        envVar: "GROQ_API_KEY",
        description: "Add your key to environment variables",
      },
    ],
    benefits: [
      "100 requests per day (free)",
      "Very fast generation (2-3 seconds)",
      "Good quality Lua scripts",
      "No billing setup required",
    ],
  })
}
