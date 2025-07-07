import { generateText } from "ai"
import { supabase } from "./supabase"
import { getDemoScript } from "./demo-scripts"
import { getBestAvailableProvider, generateWithHuggingFace, CLAUDE_LUA_SYSTEM_PROMPT } from "./ai-providers"

export async function generateScript(prompt: string, userId: string) {
  console.log("Starting script generation for user:", userId)
  console.log("Prompt:", prompt)

  try {
    // Check if user profile exists, create if not
    let { data: user, error: userError } = await supabase
      .from("profiles")
      .select("plan, daily_usage, total_scripts")
      .eq("id", userId)
      .single()

    if (userError) {
      console.log("Profile not found, creating new profile for user:", userId)

      const { data: authUser } = await supabase.auth.admin.getUserById(userId)
      if (!authUser.user) {
        throw new Error("User not found in authentication system")
      }

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: authUser.user.email || "",
          plan: "free",
          daily_usage: 0,
          total_scripts: 0,
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating profile:", createError)
        user = { plan: "free", daily_usage: 0, total_scripts: 0 }
      } else {
        user = newProfile
      }
    }

    console.log("User data:", user)
    if (user) {
      user.plan = "pro" // Force pro plan for admin
    }

    // Check daily usage limit
    if (user?.plan !== "pro" && (user?.daily_usage || 0) >= 5) {
      throw new Error("Daily limit reached. Upgrade to Pro for unlimited usage.")
    }

    let generatedScript: string
    let isDemoMode = false
    let providerUsed = "demo"

    // Get the best available AI provider based on user plan
    const provider = getBestAvailableProvider(user?.plan)

    if (!provider) {
      console.log("No AI providers configured, using demo mode")
      isDemoMode = true
    } else {
      try {
        console.log(`Attempting to generate script with ${provider.name}...`)

        if (provider.id === "huggingface") {
          // Use Hugging Face free API
          const result = await generateWithHuggingFace(prompt)
          generatedScript = result
          providerUsed = "Hugging Face (Free)"
        } else if (provider.client) {
          // Use AI SDK providers with enhanced prompts for Claude
          const systemPrompt =
            provider.provider === "anthropic"
              ? CLAUDE_LUA_SYSTEM_PROMPT
              : `You are an expert Roblox Lua script generator. Generate clean, efficient, and well-commented Lua code for Roblox Studio following best practices.`

          const enhancedPrompt =
            provider.provider === "anthropic"
              ? `Create a sophisticated Roblox Lua script for: ${prompt}

Requirements:
- Use advanced Lua patterns and Roblox best practices
- Implement proper error handling and edge cases
- Include comprehensive comments explaining the architecture
- Optimize for performance and maintainability
- Follow modern Roblox API standards
- Ensure security with proper client-server validation

Please provide a complete, production-ready script with setup instructions.`
              : `Create a Roblox Lua script for: ${prompt}

Please provide a complete, working script that can be used directly in Roblox Studio. Include setup instructions in comments.`

          const { text } = await generateText({
            model: provider.client(provider.model),
            system: systemPrompt,
            prompt: enhancedPrompt,
            temperature: provider.provider === "anthropic" ? 0.3 : 0.7, // Lower temperature for Claude for more consistent code
          })

          generatedScript = text
          providerUsed = `${provider.name} ${provider.recommended || ""}`
        } else {
          throw new Error("Provider client not available")
        }

        console.log(`Script generated successfully with ${provider.name}, length:`, generatedScript.length)
      } catch (error) {
        console.error("AI Generation Error:", error)

        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase()

          if (
            errorMessage.includes("credit") ||
            errorMessage.includes("billing") ||
            errorMessage.includes("quota") ||
            errorMessage.includes("rate limit") ||
            errorMessage.includes("api key")
          ) {
            console.log(`${provider.name} issue detected, switching to demo mode`)
            isDemoMode = true
          } else {
            console.log(`Unknown ${provider.name} error, switching to demo mode:`, error.message)
            isDemoMode = true
          }
        } else {
          console.log("Unknown error type, switching to demo mode")
          isDemoMode = true
        }
      }
    }

    // Use demo mode if needed
    if (isDemoMode) {
      console.log("Using demo mode for script generation")
      generatedScript = getDemoScript(prompt)
      providerUsed = "Demo Mode"
    }

    try {
      console.log("Saving script to database...")

      const { error: insertError } = await supabase.from("scripts").insert({
        user_id: userId,
        prompt,
        code: generatedScript,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Failed to save script:", insertError)
      }

      console.log("Updating user usage...")

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          daily_usage: (user?.daily_usage || 0) + 1,
          total_scripts: (user?.total_scripts || 0) + 1,
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Failed to update usage:", updateError)
      }

      console.log(`Script generation completed successfully using ${providerUsed}`)
      return generatedScript
    } catch (error) {
      console.error("Database Error:", error)
      return generatedScript
    }
  } catch (error) {
    console.error("Script generation error:", error)
    throw error
  }
}
