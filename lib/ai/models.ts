export const DEFAULT_CHAT_MODEL: string = "claude-haiku-4-5"
export const DEFAULT_TOOL_MODE: string = "sub-agent"

interface ChatModel {
  id: string
  name: string
  description: string
}

interface ToolMode {
  id: string
  name: string
  description: string
}

export const toolModes: Array<ToolMode> = [
  {
    id: "sub-agent",
    name: "Sub-agent",
    description: "Pipedream handles tool configuration",
  },
  {
    id: "full-config",
    name: "Full Config",
    description: "Direct tool config with dynamic props",
  },
  {
    id: "tools-only",
    name: "Tools Only",
    description: "Maximum control, configure tools directly",
  },
]

export const chatModels: Array<ChatModel> = [
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
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    description: "Fastest model with near-frontier intelligence",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    description: "Smartest model for complex agents and coding",
  },
  // {
  //   id: 'chat-model-reasoning',
  //   name: 'Reasoning model',
  //   description: 'Uses advanced reasoning',
  // },
]
