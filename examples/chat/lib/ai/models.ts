export const DEFAULT_CHAT_MODEL: string = "claude-sonnet-4-0"

interface ChatModel {
  id: string
  name: string
  description: string
}

export const chatModels: Array<ChatModel> = [
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    description: "Fast, efficient Google model",
  },
  {
    id: "moonshotai/kimi-k2-instruct",
    name: "Kimi K2-Instruct",
    description: "High-quality model from MoonShot AI",
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout",
    description: "Efficient 17B model with long context support",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "High performance, low cost model",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description: "Flagship model for complex tasks",
  },
  {
    id: "claude-opus-4-0",
    name: "Claude Opus 4",
    description: "Highest level of intelligence and capability",
  },
  {
    id: "claude-sonnet-4-0",
    name: "Claude Sonnet 4",
    description: "High intelligence and balanced performance",
  },
  // {
  //   id: 'chat-model-reasoning',
  //   name: 'Reasoning model',
  //   description: 'Uses advanced reasoning',
  // },
]
