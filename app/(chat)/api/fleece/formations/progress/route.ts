import { auth } from "@/(auth)/auth"
import { getEffectiveSession } from "@/lib/auth-utils"
import {
  saveUserCourseProgress,
  updateUserCourseProgress,
  getUserCourseProgress,
  saveQuizAttempt,
  getQuizAttemptsByUser,
  saveCertificate,
  getCertificateByCourseAndUser,
  updateUserStats,
} from "@/lib/db/fleece-queries"
import { generateUUID } from "@/lib/utils"

export async function POST(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const { courseId, action, data } = await request.json()

    if (!courseId) {
      return Response.json({ error: "Course ID required" }, { status: 400 })
    }

    // Get or create progress record
    let progress = await getUserCourseProgress(session.user.id, courseId)

    if (!progress && action === "start") {
      // Create new progress record
      progress = await saveUserCourseProgress({
        userId: session.user.id,
        courseId,
        status: "in_progress" as const,
        progressPercentage: 0,
        completedModules: [],
        totalTimeSpent: 0,
        startedAt: new Date(),
      })

      return Response.json({ progress })
    }

    if (!progress) {
      return Response.json({ error: "Progress not found" }, { status: 404 })
    }

    switch (action) {
      case "update_module":
        // Update completed modules
        const completedModules = data.completed
          ? [...new Set([...(progress.completedModules || []), data.moduleId])]
          : progress.completedModules

        const progressPercentage = data.progressPercentage || progress.progressPercentage

        const updatedProgress = await updateUserCourseProgress(progress.id, {
          completedModules,
          progressPercentage,
          lastAccessedModuleId: data.moduleId,
          totalTimeSpent: (progress.totalTimeSpent || 0) + (data.timeSpent || 0),
        })

        return Response.json({ progress: updatedProgress })

      case "complete":
        // Complete the course
        const completedProgress = await updateUserCourseProgress(progress.id, {
          status: "completed" as const,
          progressPercentage: 100,
          completedAt: new Date(),
        })

        // Update user stats
        await updateUserStats(session.user.id, {
          coursesCompleted: (await import("@/lib/db/fleece-queries").then(m => m.getUserStats(session.user.id))).then(stats => (stats?.coursesCompleted || 0) + 1),
        })

        // Generate certificate
        const existingCert = await getCertificateByCourseAndUser(session.user.id, courseId)
        if (!existingCert) {
          const certificateNumber = `FLEECE-${Date.now()}-${generateUUID().slice(0, 8).toUpperCase()}`
          await saveCertificate({
            userId: session.user.id,
            courseId,
            certificateNumber,
            finalScore: data.finalScore || 100,
            metadata: {
              courseDuration: progress.totalTimeSpent || 0,
              completionTime: Date.now() - (progress.startedAt?.getTime() || Date.now()),
              quizScores: data.quizScores || [],
            },
          })
        }

        return Response.json({ progress: completedProgress, certificateGenerated: !existingCert })

      default:
        return Response.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to update progress:", error)
    return Response.json({ error: "Failed to update progress" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    return Response.json({ error: "Course ID required" }, { status: 400 })
  }

  try {
    const progress = await getUserCourseProgress(session.user.id, courseId)
    return Response.json({ progress })
  } catch (error) {
    console.error("Failed to get progress:", error)
    return Response.json({ error: "Failed to get progress" }, { status: 500 })
  }
}
