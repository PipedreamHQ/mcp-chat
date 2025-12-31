import { auth } from "@/(auth)/auth"
import {
  type Message,
  StreamTextOnFinishCallbackDetails,
  createDataStreamResponse,
  streamText,
} from "ai"

import { getEffectiveSession } from "@/lib/auth-utils"
import {
  getModel,
  DEFAULT_MODEL_NAME,
} from "@/lib/ai/models"
import { AUTOMATIONS_SYSTEM_PROMPT } from "@/lib/ai/fleece-prompts"
import { saveMessages } from "@/lib/db/queries"
import {
  saveWorkflow,
  updateWorkflow,
  saveAutomationRecommendation,
} from "@/lib/db/fleece-queries"
import { generateUUID } from "@/lib/utils"
import { MCPSessionManager } from "@/mods/mcp-client"
import { pdHeaders } from "@/lib/pd-backend-client"

export const maxDuration = 60
const MAX_STEPS = 20

export async function POST(request: Request) {
  const {
    id,
    messages,
    workflowId,
  }: { id: string; messages: Array<Message>; workflowId?: string } = await request.json()

  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userMessage = messages[messages.length - 1]

  return createDataStreamResponse({
    status: 200,
    execute: async (dataStream) => {
      // Initialize MCP session for Pipedream tools
      const headers = pdHeaders(session.user.id)
      const mcpSessionManager = new MCPSessionManager(headers)

      // Get available Pipedream tools
      const tools = await mcpSessionManager.convertTools()

      const model = getModel(DEFAULT_MODEL_NAME)

      const result = streamText({
        model: model.apiConfiguration,
        system: AUTOMATIONS_SYSTEM_PROMPT,
        messages,
        tools,
        maxSteps: MAX_STEPS,
        onFinish: async ({ text, finishReason }: StreamTextOnFinishCallbackDetails<any>) => {
          // Save messages if persistence is enabled
          if (process.env.DISABLE_PERSISTENCE !== "true") {
            try {
              await saveMessages({
                messages: [
                  { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
                  {
                    id: generateUUID(),
                    chatId: id,
                    role: "assistant",
                    parts: [{ type: "text" as const, text }],
                    attachments: [],
                    createdAt: new Date(),
                  },
                ],
              })

              // Try to parse workflow specification
              try {
                const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/)
                if (jsonMatch) {
                  const workflowSpec = JSON.parse(jsonMatch[1])

                  if (workflowId) {
                    // Update existing workflow
                    await updateWorkflow(workflowId, {
                      configuration: workflowSpec,
                      status: "draft" as const,
                    })
                  } else if (workflowSpec.name && workflowSpec.trigger) {
                    // Create new workflow
                    await saveWorkflow({
                      userId: session.user.id,
                      name: workflowSpec.name,
                      description: workflowSpec.description,
                      configuration: workflowSpec,
                      status: "draft" as const,
                      connectedApps: [],
                      executionStats: {
                        totalRuns: 0,
                        successfulRuns: 0,
                        failedRuns: 0,
                      },
                    })
                  }
                }
              } catch (parseError) {
                console.log("Not a workflow specification, continuing...")
              }
            } catch (error) {
              console.error("Failed to save messages or workflow:", error)
            }
          }

          // Clean up MCP session
          await mcpSessionManager.close()
        },
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: (error: Error) => {
      console.error("Automations chat error:", error)
      return error.message || "An error occurred"
    },
  })
}
