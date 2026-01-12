import { auth } from "@/app/(auth)/auth"
import { systemPrompt } from "@/lib/ai/prompts"
import { myProvider } from "@/lib/ai/providers"
import { isProductionEnvironment, isAuthDisabled } from "@/lib/constants"
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from "@/lib/db/queries"
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from "@/lib/utils"
import { getEffectiveSession, shouldPersistData } from "@/lib/auth-utils"
import { MCPSessionManager } from "@/mods/mcp-client"
import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
} from "ai"
import { generateTitleFromUserMessage } from "../../actions"
import { streamText } from "./streamText"

export const maxDuration = 60

const MCP_BASE_URL = process.env.MCP_SERVER ? process.env.MCP_SERVER : "https://remote.mcp.pipedream.net"


export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string
      messages: Array<UIMessage>
      selectedChatModel: string
    } = await request.json()

    const session = await getEffectiveSession()

    // Debug logging for production
    console.log('DEBUG: Session details:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      sessionType: session?.constructor?.name || 'unknown',
      isAuthDisabled: process.env.DISABLE_AUTH === 'true',
      timestamp: new Date().toISOString()
    })

    if (!session || !session.user || !session.user.id) {
      console.error('Session validation failed:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        fullSession: session
      })
      return new Response(JSON.stringify({ error: "Authentication required", redirectToAuth: true }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const userId = session.user.id

    const userMessage = getMostRecentUserMessage(messages)

    if (!userMessage) {
      return new Response("No user message found", { status: 400 })
    }

    // Only check/save chat and messages if persistence is enabled
    if (shouldPersistData()) {
      const chat = await getChatById({ id })

      if (!chat) {
        const title = await generateTitleFromUserMessage({
          message: userMessage,
        })

        await saveChat({ id, userId, title })
      } else {
        if (chat.userId !== userId) {
          return new Response("Unauthorized", { status: 401 })
        }
      }

      await saveMessages({
        messages: [
          {
            chatId: id,
            id: userMessage.id,
            role: "user",
            parts: userMessage.parts,
            attachments: userMessage.experimental_attachments ?? [],
            createdAt: new Date(),
          },
        ],
      })
    }

    // MCP server is stateless - state is restored via chatId header, no session IDs needed
    const mcpSession = new MCPSessionManager(MCP_BASE_URL, userId, id)

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const system = systemPrompt({ selectedChatModel })
        await streamText(
          { dataStream, userMessage },
          {
            model: myProvider.languageModel(selectedChatModel),
            system,
            messages,
            maxSteps: 20,
            experimental_transform: smoothStream({ chunking: "word" }),
            experimental_generateMessageId: generateUUID,
            getTools: () => mcpSession.tools({ useCache: false }),
            onFinish: async ({ response }) => {
              if (userId && shouldPersistData()) {
                try {
                  const assistantId = getTrailingMessageId({
                    messages: response.messages.filter(
                      (message) => message.role === "assistant"
                    ),
                  })

                  if (!assistantId) {
                    throw new Error("No assistant message found!")
                  }

                  const [, assistantMessage] = appendResponseMessages({
                    messages: [userMessage],
                    responseMessages: response.messages,
                  })

                  await saveMessages({
                    messages: [
                      {
                        id: assistantId,
                        chatId: id,
                        role: assistantMessage.role,
                        parts: assistantMessage.parts,
                        attachments:
                          assistantMessage.experimental_attachments ?? [],
                        createdAt: new Date(),
                      },
                    ],
                  })
                } catch (error) {
                  console.error("Failed to save chat")
                }
              }
            },
            experimental_telemetry: {
              isEnabled: isProductionEnvironment,
              functionId: "stream-text",
            },
          }
        )
      },
      onError: (error) => {
        console.error("Error:", error)
        return "Oops, an error occured!"
      },
    })
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 404,
    })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return new Response("Not Found", { status: 404 })
  }

  const session = await getEffectiveSession()

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  const userId = session.user.id

  // In dev mode without auth, just return success without deleting
  if (!shouldPersistData()) {
    return new Response("Chat deleted", { status: 200 })
  }

  try {
    const chat = await getChatById({ id })

    if (chat.userId !== userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    await deleteChatById({ id })

    return new Response("Chat deleted", { status: 200 })
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 500,
    })
  }
}
