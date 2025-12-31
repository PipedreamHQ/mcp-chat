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
import { TRAINING_SYSTEM_PROMPT } from "@/lib/ai/fleece-prompts"
import { saveMessages } from "@/lib/db/queries"
import {
  saveTrainingCourse,
  updateTrainingCourse,
  saveCourseModule,
  saveQuiz,
} from "@/lib/db/fleece-queries"
import { generateUUID } from "@/lib/utils"

export const maxDuration = 60
const MAX_STEPS = 20

export async function POST(request: Request) {
  const {
    id,
    messages,
    courseId,
  }: { id: string; messages: Array<Message>; courseId?: string } = await request.json()

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
        system: TRAINING_SYSTEM_PROMPT,
        messages,
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

              // Try to parse course specification
              try {
                const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/)
                if (jsonMatch) {
                  const courseSpec = JSON.parse(jsonMatch[1])

                  if (courseId) {
                    // Update existing course
                    await updateTrainingCourse(courseId, {
                      ...courseSpec,
                      isPublished: false,
                    })
                  } else if (courseSpec.title && courseSpec.modules) {
                    // Create new course
                    const course = await saveTrainingCourse({
                      ...courseSpec,
                      createdBy: session.user.id,
                      isPublished: false,
                    })

                    // Create modules
                    if (course && courseSpec.modules) {
                      for (const module of courseSpec.modules) {
                        const savedModule = await saveCourseModule({
                          courseId: course.id,
                          title: module.title,
                          description: module.description,
                          orderIndex: module.orderIndex,
                          moduleType: module.moduleType,
                          content: module.content,
                          duration: module.duration,
                          isRequired: module.isRequired ?? true,
                        })

                        // Create quiz if module has one
                        if (module.moduleType === "quiz" && courseSpec.quizzes) {
                          const relatedQuiz = courseSpec.quizzes.find(
                            (q: any) => q.title === module.title
                          )
                          if (relatedQuiz && savedModule) {
                            await saveQuiz({
                              moduleId: savedModule.id,
                              title: relatedQuiz.title,
                              passingScore: relatedQuiz.passingScore,
                              questions: relatedQuiz.questions,
                              timeLimit: relatedQuiz.timeLimit,
                            })
                          }
                        }
                      }
                    }
                  }
                }
              } catch (parseError) {
                console.log("Not a course specification, continuing...")
              }
            } catch (error) {
              console.error("Failed to save messages or course:", error)
            }
          }
        },
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: (error: Error) => {
      console.error("Training chat error:", error)
      return error.message || "An error occurred"
    },
  })
}
