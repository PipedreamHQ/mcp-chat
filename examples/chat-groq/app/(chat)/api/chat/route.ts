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

    // get any existing mcp sessions from the mcp server
    const mcpSessionUrl = `${MCP_BASE_URL}/v1/${userId}/sessions`
    console.log('DEBUG: Fetching MCP sessions from:', mcpSessionUrl)
    console.log('DEBUG: Looking for chat ID:', id)
    
    const mcpSessionsResp = await fetch(mcpSessionUrl)
    let sessionId = undefined
    
    console.log('DEBUG: MCP sessions response:', {
      ok: mcpSessionsResp.ok,
      status: mcpSessionsResp.status,
      statusText: mcpSessionsResp.statusText,
      headers: Object.fromEntries(mcpSessionsResp.headers.entries())
    })
    
    if (mcpSessionsResp.ok) {
      const body = await mcpSessionsResp.json()
      console.log('DEBUG: MCP sessions body:', body)
      console.log('DEBUG: Looking for body[id]:', body[id])
      console.log('DEBUG: Looking for body.mcpSessions[id]:', body.mcpSessions ? body.mcpSessions[id] : 'mcpSessions not found')
      
      // Try both formats to see which one works
      if (body.mcpSessions && body.mcpSessions[id]) {
        sessionId = body.mcpSessions[id]
        console.log('DEBUG: Found sessionId in body.mcpSessions[id]:', sessionId)
      } else if (body[id]) {
        sessionId = body[id]
        console.log('DEBUG: Found sessionId in body[id]:', sessionId)
      }
    } else {
      console.error('DEBUG: MCP sessions fetch failed:', await mcpSessionsResp.text())
    }

    console.log('DEBUG: Final sessionId for MCPSessionManager:', sessionId)
    const mcpSession = new MCPSessionManager(MCP_BASE_URL, userId, id, sessionId)

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
    console.error("Chat API Error:", error)
    return new Response("An error occurred while processing your request!", {
      status: 500,
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
