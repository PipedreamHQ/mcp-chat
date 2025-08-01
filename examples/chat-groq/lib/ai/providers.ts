import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { customProvider } from "ai"
import { isTestEnvironment } from "../constants"
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test"

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model-small": chatModel,
        "chat-model-large": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "llama-3.3-70b-versatile": groq("llama-3.3-70b-versatile"),
        "llama-3.1-8b-instant": groq("llama-3.1-8b-instant"),
        "gemma2-9b-it": groq("gemma2-9b-it"),
        "llama3-70b-8192": groq("llama3-70b-8192"),
        "llama3-8b-8192": groq("llama3-8b-8192"),
        "meta-llama/llama-4-scout-17b-16e-instruct": groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        // 'chat-model-reasoning': wrapLanguageModel({
        //   model: fireworks('accounts/fireworks/models/deepseek-r1'),
        //   middleware: extractReasoningMiddleware({ tagName: 'think' }),
        // }),
        "title-model": groq("llama-3.1-8b-instant"),
        "artifact-model": groq("llama-3.1-8b-instant"),
      },
      imageModels: {
        "small-model": openai.image("dall-e-2"),
        "large-model": openai.image("dall-e-3"),
      },
    })
