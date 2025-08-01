import { anthropic } from "@ai-sdk/anthropic"
import { google } from '@ai-sdk/google';
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
        "gemma2-9b-it": groq("gemma2-9b-it"),
        "moonshotai/kimi-k2-instruct": groq("moonshotai/kimi-k2-instruct"),
        "meta-llama/llama-4-scout-17b-16e-instruct": groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        "gemini-2.5-flash": google("gemini-2.5-flash"),
        "gpt-4o-mini": openai("gpt-4o-mini"),
        "gpt-4.1": openai("gpt-4.1-2025-04-14"),
        "claude-opus-4-0": anthropic("claude-opus-4-20250514"),
        "claude-sonnet-4-0": anthropic("claude-sonnet-4-20250514"),
        // 'chat-model-reasoning': wrapLanguageModel({
        //   model: fireworks('accounts/fireworks/models/deepseek-r1'),
        //   middleware: extractReasoningMiddleware({ tagName: 'think' }),
        // }),
        "title-model": openai("gpt-4-turbo"),
        "artifact-model": openai("gpt-4o-mini"),
      },
      imageModels: {
        "small-model": openai.image("dall-e-2"),
        "large-model": openai.image("dall-e-3"),
      },
    })
