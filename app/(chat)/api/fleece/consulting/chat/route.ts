import { auth } from "@/(auth)/auth"
import {
  type Message,
  StreamTextOnFinishCallbackDetails,
  createDataStreamResponse,
  streamText,
} from "ai"
import { z } from "zod"

import { getEffectiveSession } from "@/lib/auth-utils"
import {
  getModel,
  DEFAULT_MODEL_NAME,
} from "@/lib/ai/models"
import { CONSULTING_SYSTEM_PROMPT } from "@/lib/ai/fleece-prompts"
import { saveMessages } from "@/lib/db/queries"
import {
  saveAuditReport,
  updateAuditReport,
  getAuditReportById,
} from "@/lib/db/fleece-queries"
import { generateUUID } from "@/lib/utils"

export const maxDuration = 60

const MAX_STEPS = 20

export async function POST(request: Request) {
  const {
    id,
    messages,
    auditReportId,
  }: { id: string; messages: Array<Message>; auditReportId?: string } = await request.json()

  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userMessage = messages[messages.length - 1]

  return createDataStreamResponse({
    status: 200,
    execute: async (dataStream) => {
      const model = getModel(DEFAULT_MODEL_NAME)

      const result = streamText({
        model: model.apiConfiguration,
        system: CONSULTING_SYSTEM_PROMPT,
        messages,
        maxSteps: MAX_STEPS,
        experimental_activeTools: undefined,
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

              // Try to parse the response to see if it's an audit report
              try {
                const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/)
                if (jsonMatch) {
                  const auditData = JSON.parse(jsonMatch[1])

                  if (auditReportId) {
                    // Update existing audit report
                    await updateAuditReport(auditReportId, {
                      ...auditData,
                      status: "completed" as const,
                    })
                  } else {
                    // Create new audit report
                    await saveAuditReport({
                      userId: session.user.id,
                      chatId: id,
                      title: `Audit - ${new Date().toLocaleDateString()}`,
                      ...auditData,
                      status: "completed" as const,
                    })
                  }
                }
              } catch (parseError) {
                // If parsing fails, it's just conversational text, not an audit report
                console.log("Not an audit report format, continuing...")
              }
            } catch (error) {
              console.error("Failed to save messages or audit report:", error)
            }
          }
        },
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: (error: Error) => {
      console.error("Consulting chat error:", error)
      return error.message || "An error occurred"
    },
  })
}
