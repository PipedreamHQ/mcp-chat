export const DEFAULT_CHAT_MODEL: string = "llama-3.3-70b-versatile"

interface ChatModel {
  id: string
  name: string
  description: string
}

export const chatModels: Array<ChatModel> = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B Versatile",
    description: "Latest Llama model optimized for versatile tasks",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    description: "Fast, lightweight model for quick responses",
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma2 9B IT",
    description: "Google's efficient instruction-tuned model",
  },
  {
    id: "llama3-70b-8192",
    name: "Llama 3 70B",
    description: "Large model with 8K context window",
  },
  {
    id: "llama3-8b-8192",
    name: "Llama 3 8B",
    description: "Efficient model with 8K context window",
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout",
    description: "Multimodal model with vision capabilities, 17B params",
  },
]
