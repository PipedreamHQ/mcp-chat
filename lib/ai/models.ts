export const DEFAULT_CHAT_MODEL: string = "claude-haiku-4-5"

interface ChatModel {
  id: string
  name: string
  description: string
  provider: string
}

export const chatModels: Array<ChatModel> = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "High performance, low cost model",
    provider: "google",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Small model for fast, lightweight tasks",
    provider: "openai",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description: "Flagship model for complex tasks",
    provider: "openai",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    description: "Fastest model with near-frontier intelligence",
    provider: "anthropic",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    description: "Smartest model for complex agents and coding",
    provider: "anthropic",
  },
]

export function getAvailableModels(): Array<ChatModel> {
  const hasGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()
  const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim()
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY?.trim()

  return chatModels.filter((m) => {
    if (m.provider === "google") return hasGoogle
    if (m.provider === "openai") return hasOpenAI
    if (m.provider === "anthropic") return hasAnthropic
    return true
  })
}
