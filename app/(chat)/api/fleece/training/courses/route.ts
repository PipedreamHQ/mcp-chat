import { auth } from "@/(auth)/auth"
import { getEffectiveSession } from "@/lib/auth-utils"
import {
  saveTrainingCourse,
  updateTrainingCourse,
  getTrainingCourseById,
  getPublishedTrainingCourses,
  getCourseModulesByCourseId,
  getUserCourseProgress,
  getUserCoursesProgress,
} from "@/lib/db/fleece-queries"

export async function GET(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("id")
  const includeModules = searchParams.get("modules") === "true"
  const includeProgress = searchParams.get("progress") === "true"

  try {
    if (courseId) {
      // Get specific course
      const course = await getTrainingCourseById(courseId)

      if (!course) {
        return Response.json({ error: "Course not found" }, { status: 404 })
      }

      let modules = []
      let progress = null

      if (includeModules) {
        modules = await getCourseModulesByCourseId(courseId)
      }

      if (includeProgress) {
        progress = await getUserCourseProgress(session.user.id, courseId)
      }

      return Response.json({ course, modules, progress })
    } else {
      // Get all published courses
      const courses = await getPublishedTrainingCourses()

      // Get user's progress for all courses if requested
      let userProgress = []
      if (includeProgress) {
        userProgress = await getUserCoursesProgress(session.user.id)
      }

      return Response.json({ courses, userProgress })
    }
  } catch (error) {
    console.error("Failed to get courses:", error)
    return Response.json({ error: "Failed to get courses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const data = await request.json()

    const course = await saveTrainingCourse({
      ...data,
      createdBy: session.user.id,
    })

    return Response.json({ course })
  } catch (error) {
    console.error("Failed to create course:", error)
    return Response.json({ error: "Failed to create course" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const { id, ...data } = await request.json()

    if (!id) {
      return Response.json({ error: "Course ID required" }, { status: 400 })
    }

    // Verify ownership
    const existing = await getTrainingCourseById(id)
    if (!existing) {
      return Response.json({ error: "Course not found" }, { status: 404 })
    }

    if (existing.createdBy !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const course = await updateTrainingCourse(id, data)

    return Response.json({ course })
  } catch (error) {
    console.error("Failed to update course:", error)
    return Response.json({ error: "Failed to update course" }, { status: 500 })
  }
}
