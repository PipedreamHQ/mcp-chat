import "server-only"
import { genSaltSync, hashSync } from "bcrypt-ts"
import { and, asc, desc, eq, gt } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import {
  user,
  auditReport,
  processMap,
  automationRecommendation,
  workflow,
  workflowExecution,
  trainingCourse,
  courseModule,
  quiz,
  userCourseProgress,
  quizAttempt,
  certificate,
  userAchievement,
  userStats,
  type AuditReport,
  type ProcessMap,
  type AutomationRecommendation,
  type Workflow,
  type WorkflowExecution,
  type TrainingCourse,
  type CourseModule,
  type Quiz,
  type UserCourseProgress,
  type QuizAttempt,
  type Certificate,
  type UserAchievement,
  type UserStats,
} from "./schema"

// ============================================
// DATABASE CONNECTION
// ============================================

const client = postgres(process.env.POSTGRES_URL!)
const db = drizzle(client)

// ============================================
// FLEECE AI CONSULTING QUERIES
// ============================================

export async function saveAuditReport(data: Partial<AuditReport>) {
  try {
    const [report] = await db.insert(auditReport).values({
      ...data,
      updatedAt: new Date(),
    } as any).returning()
    return report
  } catch (error) {
    console.error("Failed to save audit report:", error)
    throw error
  }
}

export async function updateAuditReport(id: string, data: Partial<AuditReport>) {
  try {
    const [report] = await db
      .update(auditReport)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(auditReport.id, id))
      .returning()
    return report
  } catch (error) {
    console.error("Failed to update audit report:", error)
    throw error
  }
}

export async function getAuditReportById(id: string) {
  try {
    const [report] = await db
      .select()
      .from(auditReport)
      .where(eq(auditReport.id, id))
    return report
  } catch (error) {
    console.error("Failed to get audit report:", error)
    return null
  }
}

export async function getAuditReportsByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(auditReport)
      .where(eq(auditReport.userId, userId))
      .orderBy(desc(auditReport.createdAt))
  } catch (error) {
    console.error("Failed to get audit reports by user:", error)
    return []
  }
}

export async function deleteAuditReport(id: string) {
  try {
    await db.delete(auditReport).where(eq(auditReport.id, id))
  } catch (error) {
    console.error("Failed to delete audit report:", error)
    throw error
  }
}

export async function saveProcessMap(data: Partial<ProcessMap>) {
  try {
    const [map] = await db.insert(processMap).values(data as any).returning()
    return map
  } catch (error) {
    console.error("Failed to save process map:", error)
    throw error
  }
}

export async function getProcessMapsByAuditReportId(auditReportId: string) {
  try {
    return await db
      .select()
      .from(processMap)
      .where(eq(processMap.auditReportId, auditReportId))
      .orderBy(asc(processMap.createdAt))
  } catch (error) {
    console.error("Failed to get process maps:", error)
    return []
  }
}

// ============================================
// FLEECE AI AUTOMATISATIONS QUERIES
// ============================================

export async function saveAutomationRecommendation(data: Partial<AutomationRecommendation>) {
  try {
    const [recommendation] = await db
      .insert(automationRecommendation)
      .values(data as any)
      .returning()
    return recommendation
  } catch (error) {
    console.error("Failed to save automation recommendation:", error)
    throw error
  }
}

export async function updateAutomationRecommendation(
  id: string,
  data: Partial<AutomationRecommendation>
) {
  try {
    const [recommendation] = await db
      .update(automationRecommendation)
      .set(data)
      .where(eq(automationRecommendation.id, id))
      .returning()
    return recommendation
  } catch (error) {
    console.error("Failed to update automation recommendation:", error)
    throw error
  }
}

export async function getAutomationRecommendationsByAuditReportId(auditReportId: string) {
  try {
    return await db
      .select()
      .from(automationRecommendation)
      .where(eq(automationRecommendation.auditReportId, auditReportId))
      .orderBy(desc(automationRecommendation.createdAt))
  } catch (error) {
    console.error("Failed to get automation recommendations:", error)
    return []
  }
}

export async function saveWorkflow(data: Partial<Workflow>) {
  try {
    const [wf] = await db.insert(workflow).values({
      ...data,
      updatedAt: new Date(),
    } as any).returning()
    return wf
  } catch (error) {
    console.error("Failed to save workflow:", error)
    throw error
  }
}

export async function updateWorkflow(id: string, data: Partial<Workflow>) {
  try {
    const [wf] = await db
      .update(workflow)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workflow.id, id))
      .returning()
    return wf
  } catch (error) {
    console.error("Failed to update workflow:", error)
    throw error
  }
}

export async function getWorkflowById(id: string) {
  try {
    const [wf] = await db
      .select()
      .from(workflow)
      .where(eq(workflow.id, id))
    return wf
  } catch (error) {
    console.error("Failed to get workflow:", error)
    return null
  }
}

export async function getWorkflowsByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(workflow)
      .where(eq(workflow.userId, userId))
      .orderBy(desc(workflow.createdAt))
  } catch (error) {
    console.error("Failed to get workflows:", error)
    return []
  }
}

export async function deleteWorkflow(id: string) {
  try {
    await db.delete(workflow).where(eq(workflow.id, id))
  } catch (error) {
    console.error("Failed to delete workflow:", error)
    throw error
  }
}

export async function saveWorkflowExecution(data: Partial<WorkflowExecution>) {
  try {
    const [execution] = await db
      .insert(workflowExecution)
      .values(data as any)
      .returning()
    return execution
  } catch (error) {
    console.error("Failed to save workflow execution:", error)
    throw error
  }
}

export async function updateWorkflowExecution(id: string, data: Partial<WorkflowExecution>) {
  try {
    const [execution] = await db
      .update(workflowExecution)
      .set(data)
      .where(eq(workflowExecution.id, id))
      .returning()
    return execution
  } catch (error) {
    console.error("Failed to update workflow execution:", error)
    throw error
  }
}

export async function getWorkflowExecutionsByWorkflowId(workflowId: string, limit = 50) {
  try {
    return await db
      .select()
      .from(workflowExecution)
      .where(eq(workflowExecution.workflowId, workflowId))
      .orderBy(desc(workflowExecution.startedAt))
      .limit(limit)
  } catch (error) {
    console.error("Failed to get workflow executions:", error)
    return []
  }
}

// ============================================
// FLEECE AI TRAINING QUERIES
// ============================================

export async function saveTrainingCourse(data: Partial<TrainingCourse>) {
  try {
    const [course] = await db.insert(trainingCourse).values({
      ...data,
      updatedAt: new Date(),
    } as any).returning()
    return course
  } catch (error) {
    console.error("Failed to save training course:", error)
    throw error
  }
}

export async function updateTrainingCourse(id: string, data: Partial<TrainingCourse>) {
  try {
    const [course] = await db
      .update(trainingCourse)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(trainingCourse.id, id))
      .returning()
    return course
  } catch (error) {
    console.error("Failed to update training course:", error)
    throw error
  }
}

export async function getTrainingCourseById(id: string) {
  try {
    const [course] = await db
      .select()
      .from(trainingCourse)
      .where(eq(trainingCourse.id, id))
    return course
  } catch (error) {
    console.error("Failed to get training course:", error)
    return null
  }
}

export async function getPublishedTrainingCourses() {
  try {
    return await db
      .select()
      .from(trainingCourse)
      .where(eq(trainingCourse.isPublished, true))
      .orderBy(desc(trainingCourse.createdAt))
  } catch (error) {
    console.error("Failed to get published courses:", error)
    return []
  }
}

export async function getTrainingCoursesByWorkflowId(workflowId: string) {
  try {
    return await db
      .select()
      .from(trainingCourse)
      .where(eq(trainingCourse.workflowId, workflowId))
      .orderBy(desc(trainingCourse.createdAt))
  } catch (error) {
    console.error("Failed to get courses by workflow:", error)
    return []
  }
}

export async function saveCourseModule(data: Partial<CourseModule>) {
  try {
    const [module] = await db.insert(courseModule).values(data as any).returning()
    return module
  } catch (error) {
    console.error("Failed to save course module:", error)
    throw error
  }
}

export async function getCourseModulesByCourseId(courseId: string) {
  try {
    return await db
      .select()
      .from(courseModule)
      .where(eq(courseModule.courseId, courseId))
      .orderBy(asc(courseModule.orderIndex))
  } catch (error) {
    console.error("Failed to get course modules:", error)
    return []
  }
}

export async function saveQuiz(data: Partial<Quiz>) {
  try {
    const [q] = await db.insert(quiz).values(data as any).returning()
    return q
  } catch (error) {
    console.error("Failed to save quiz:", error)
    throw error
  }
}

export async function getQuizByModuleId(moduleId: string) {
  try {
    const [q] = await db
      .select()
      .from(quiz)
      .where(eq(quiz.moduleId, moduleId))
    return q
  } catch (error) {
    console.error("Failed to get quiz:", error)
    return null
  }
}

export async function saveUserCourseProgress(data: Partial<UserCourseProgress>) {
  try {
    const [progress] = await db
      .insert(userCourseProgress)
      .values({
        ...data,
        updatedAt: new Date(),
      } as any)
      .returning()
    return progress
  } catch (error) {
    console.error("Failed to save user course progress:", error)
    throw error
  }
}

export async function updateUserCourseProgress(id: string, data: Partial<UserCourseProgress>) {
  try {
    const [progress] = await db
      .update(userCourseProgress)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userCourseProgress.id, id))
      .returning()
    return progress
  } catch (error) {
    console.error("Failed to update user course progress:", error)
    throw error
  }
}

export async function getUserCourseProgress(userId: string, courseId: string) {
  try {
    const [progress] = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.courseId, courseId)
        )
      )
    return progress
  } catch (error) {
    console.error("Failed to get user course progress:", error)
    return null
  }
}

export async function getUserCoursesProgress(userId: string) {
  try {
    return await db
      .select()
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, userId))
      .orderBy(desc(userCourseProgress.updatedAt))
  } catch (error) {
    console.error("Failed to get user courses progress:", error)
    return []
  }
}

export async function saveQuizAttempt(data: Partial<QuizAttempt>) {
  try {
    const [attempt] = await db.insert(quizAttempt).values(data as any).returning()
    return attempt
  } catch (error) {
    console.error("Failed to save quiz attempt:", error)
    throw error
  }
}

export async function getQuizAttemptsByUser(userId: string, quizId: string) {
  try {
    return await db
      .select()
      .from(quizAttempt)
      .where(
        and(
          eq(quizAttempt.userId, userId),
          eq(quizAttempt.quizId, quizId)
        )
      )
      .orderBy(desc(quizAttempt.startedAt))
  } catch (error) {
    console.error("Failed to get quiz attempts:", error)
    return []
  }
}

export async function saveCertificate(data: Partial<Certificate>) {
  try {
    const [cert] = await db.insert(certificate).values(data as any).returning()
    return cert
  } catch (error) {
    console.error("Failed to save certificate:", error)
    throw error
  }
}

export async function getCertificatesByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(certificate)
      .where(eq(certificate.userId, userId))
      .orderBy(desc(certificate.issueDate))
  } catch (error) {
    console.error("Failed to get certificates:", error)
    return []
  }
}

export async function getCertificateByCourseAndUser(userId: string, courseId: string) {
  try {
    const [cert] = await db
      .select()
      .from(certificate)
      .where(
        and(
          eq(certificate.userId, userId),
          eq(certificate.courseId, courseId)
        )
      )
    return cert
  } catch (error) {
    console.error("Failed to get certificate:", error)
    return null
  }
}

// ============================================
// GAMIFICATION QUERIES
// ============================================

export async function saveUserAchievement(data: Partial<UserAchievement>) {
  try {
    const [achievement] = await db
      .insert(userAchievement)
      .values(data as any)
      .returning()
    return achievement
  } catch (error) {
    console.error("Failed to save user achievement:", error)
    throw error
  }
}

export async function getUserAchievements(userId: string) {
  try {
    return await db
      .select()
      .from(userAchievement)
      .where(eq(userAchievement.userId, userId))
      .orderBy(desc(userAchievement.unlockedAt))
  } catch (error) {
    console.error("Failed to get user achievements:", error)
    return []
  }
}

export async function initUserStats(userId: string) {
  try {
    const [stats] = await db
      .insert(userStats)
      .values({
        userId,
        updatedAt: new Date(),
      } as any)
      .returning()
    return stats
  } catch (error) {
    console.error("Failed to init user stats:", error)
    throw error
  }
}

export async function updateUserStats(userId: string, data: Partial<UserStats>) {
  try {
    const [stats] = await db
      .update(userStats)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning()
    return stats
  } catch (error) {
    console.error("Failed to update user stats:", error)
    throw error
  }
}

export async function getUserStats(userId: string) {
  try {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))

    if (!stats) {
      return await initUserStats(userId)
    }

    return stats
  } catch (error) {
    console.error("Failed to get user stats:", error)
    return null
  }
}

// ============================================
// ANALYTICS & DASHBOARD QUERIES
// ============================================

export async function getDashboardStats(userId: string) {
  try {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))

    const activeWorkflows = await db
      .select()
      .from(workflow)
      .where(
        and(
          eq(workflow.userId, userId),
          eq(workflow.status, "active")
        )
      )

    const inProgressCourses = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.status, "in_progress")
        )
      )

    const recentAudits = await db
      .select()
      .from(auditReport)
      .where(eq(auditReport.userId, userId))
      .orderBy(desc(auditReport.createdAt))
      .limit(5)

    return {
      stats: stats || null,
      activeWorkflowsCount: activeWorkflows.length,
      inProgressCoursesCount: inProgressCourses.length,
      recentAudits,
    }
  } catch (error) {
    console.error("Failed to get dashboard stats:", error)
    return null
  }
}
