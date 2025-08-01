// Server-side only functions for checking API keys
export function hasValidAPIKeys(): boolean {
  const groqKey = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  
  return !!(groqKey?.trim() || openaiKey?.trim())
}

export function getMissingAPIKeys(): string[] {
  const missing: string[] = []
  
  if (!process.env.GROQ_API_KEY?.trim() && !process.env.OPENAI_API_KEY?.trim()) {
    return ['GROQ_API_KEY (required) or OPENAI_API_KEY (optional for image generation)']
  }
  
  return missing
}