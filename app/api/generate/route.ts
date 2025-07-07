import { type NextRequest, NextResponse } from "next/server"
import { generateScript } from "@/lib/ai"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  console.log("API: Generate script request received")

  try {
    const body = await request.json()
    const { prompt } = body

    console.log("API: Request body:", { prompt: prompt?.substring(0, 100) + "..." })

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      console.log("API: Invalid prompt provided")
      return NextResponse.json({ error: "Please provide a valid prompt" }, { status: 400 })
    }

    if (prompt.trim().length > 1000) {
      console.log("API: Prompt too long")
      return NextResponse.json({ error: "Prompt is too long. Please keep it under 1000 characters." }, { status: 400 })
    }

    // Get user from session
    console.log("API: Getting user session...")
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("API: Auth error:", authError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    if (!user) {
      console.log("API: No user found")
      return NextResponse.json({ error: "Please sign in to generate scripts" }, { status: 401 })
    }

    console.log("API: User authenticated:", user.id)
    console.log("API: Starting script generation...")

    const script = await generateScript(prompt.trim(), user.id)

    console.log("API: Script generation completed")

    return NextResponse.json({
      script,
      success: true,
      message: "Script generated successfully!",
    })
  } catch (error) {
    console.error("API: Generate script error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Daily limit reached")) {
        return NextResponse.json({ error: error.message, limitReached: true }, { status: 429 })
      }
      if (error.message.includes("timed out")) {
        return NextResponse.json({ error: error.message }, { status: 408 })
      }
      if (error.message.includes("AI service")) {
        return NextResponse.json({ error: error.message }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to generate script. Please try again." }, { status: 500 })
  }
}
