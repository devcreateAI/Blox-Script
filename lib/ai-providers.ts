import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenAI } from "@ai-sdk/openai"
import { createGroq } from "@ai-sdk/groq"

// AI Provider Configuration - Prioritized by code quality
export const AI_PROVIDERS = {
  // Claude Opus - Best for complex code generation
  "claude-opus": {
    name: "Claude 3 Opus",
    provider: "anthropic",
    free: false,
    tier: "premium",
    dailyLimit: 1000,
    model: "claude-3-opus-20240229",
    quality: "Exceptional",
    speed: "Medium",
    specialty: "Complex Lua scripting, advanced game mechanics",
    setup: () => (process.env.ANTHROPIC_API_KEY ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null),
  },

  // Claude Sonnet - Great balance of quality and speed
  "claude-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    free: false,
    tier: "premium",
    dailyLimit: 1000,
    model: "claude-3-5-sonnet-20241022",
    quality: "Excellent",
    speed: "Fast",
    specialty: "Production-ready Roblox scripts, optimization",
    setup: () => (process.env.ANTHROPIC_API_KEY ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null),
  },

  // Claude Haiku - Fast and efficient
  "claude-haiku": {
    name: "Claude 3 Haiku",
    provider: "anthropic",
    free: false,
    tier: "standard",
    dailyLimit: 1000,
    model: "claude-3-haiku-20240307",
    quality: "Very Good",
    speed: "Very Fast",
    specialty: "Quick scripts, simple mechanics",
    setup: () => (process.env.ANTHROPIC_API_KEY ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null),
  },

  // Groq - Free alternative with good Lua support
  groq: {
    name: "Groq Llama 3.1 70B",
    provider: "groq",
    free: true,
    tier: "free",
    dailyLimit: 100,
    model: "llama-3.1-70b-versatile",
    quality: "Good",
    speed: "Very Fast",
    specialty: "General scripting, free tier",
    setup: () => (process.env.GROQ_API_KEY ? createGroq({ apiKey: process.env.GROQ_API_KEY }) : null),
  },

  // OpenAI GPT-4 - Good for code but not as specialized as Claude
  "gpt-4": {
    name: "GPT-4 Turbo",
    provider: "openai",
    free: false,
    tier: "premium",
    dailyLimit: 500,
    model: "gpt-4-turbo-preview",
    quality: "Very Good",
    speed: "Medium",
    specialty: "General programming, documentation",
    setup: () => (process.env.OPENAI_API_KEY ? createOpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null),
  },

  // OpenAI GPT-3.5 - Budget option
  "gpt-3.5": {
    name: "GPT-3.5 Turbo",
    provider: "openai",
    free: false,
    tier: "standard",
    dailyLimit: 1000,
    model: "gpt-3.5-turbo",
    quality: "Good",
    speed: "Fast",
    specialty: "Basic scripting, cost-effective",
    setup: () => (process.env.OPENAI_API_KEY ? createOpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null),
  },
}

// Get the best available provider based on user plan and available APIs
export function getBestAvailableProvider(userPlan = "free", preferredTier = "premium") {
  // Priority order based on Lua scripting quality
  const premiumOrder = ["claude-opus", "claude-sonnet", "gpt-4", "claude-haiku", "gpt-3.5", "groq"]
  const freeOrder = ["groq", "claude-haiku", "gpt-3.5", "claude-sonnet", "claude-opus", "gpt-4"]

  const priorityOrder = userPlan === "pro" ? premiumOrder : freeOrder

  for (const providerId of priorityOrder) {
    const provider = AI_PROVIDERS[providerId]
    if (!provider) continue

    const client = provider.setup()
    if (client) {
      return {
        id: providerId,
        ...provider,
        client,
        recommended: providerId.includes("claude") ? "🏆 Best for Lua" : "",
      }
    }
  }

  return null
}

// Enhanced system prompt specifically optimized for Claude and Lua
export const CLAUDE_LUA_SYSTEM_PROMPT = `You are Claude, an expert Roblox Lua script generator with deep knowledge of game development patterns and Roblox Studio best practices.

Your expertise includes:
- Advanced Lua programming techniques and idioms
- Roblox-specific APIs, services, and architectural patterns
- Game development concepts (physics, networking, UI, data persistence)
- Performance optimization and memory management
- Security best practices for client-server architecture

Code Generation Guidelines:
1. **Architecture**: Use proper separation of concerns (client/server, MVC patterns)
2. **Services**: Leverage appropriate Roblox services (RunService, TweenService, etc.)
3. **Networking**: Implement secure RemoteEvents/RemoteFunctions with validation
4. **Error Handling**: Include comprehensive error handling and edge cases
5. **Performance**: Write optimized code with proper cleanup and memory management
6. **Documentation**: Provide detailed comments explaining complex logic
7. **Modularity**: Create reusable, maintainable code structures
8. **Security**: Validate all client inputs on the server side

Always generate production-ready code that follows Roblox's current best practices and API standards.`

// Hugging Face API call (keeping as fallback)
export async function generateWithHuggingFace(prompt: string) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API key not configured")
  }

  const response = await fetch("https://api-inference.huggingface.co/models/microsoft/CodeGPT-small-lua", {
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      inputs: `-- Generate a Roblox Lua script for: ${prompt}\n-- Script:`,
      parameters: {
        max_length: 1500,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result[0]?.generated_text || "-- Generated script placeholder"
}
