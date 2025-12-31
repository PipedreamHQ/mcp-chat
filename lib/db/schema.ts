import type { InferSelectModel } from "drizzle-orm"
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).unique(),
  password: varchar("password", { length: 64 }),
})

export type User = InferSelectModel<typeof user>

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
})

export type Chat = InferSelectModel<typeof chat>

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://github.com/vercel/ai-chatbot/blob/main/docs/04-migrate-to-parts.md
export const messageDeprecated = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
})

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>

export const message = pgTable("Message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
})

export type DBMessage = InferSelectModel<typeof message>

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://github.com/vercel/ai-chatbot/blob/main/docs/04-migrate-to-parts.md
export const voteDeprecated = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    }
  }
)

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    }
  }
)

export type Vote = InferSelectModel<typeof vote>

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    }
  }
)

export type Document = InferSelectModel<typeof document>

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
)

export type Suggestion = InferSelectModel<typeof suggestion>

// ============================================
// FLEECE AI ECOSYSTEM SCHEMA
// ============================================

// ===== FLEECE AI CONSULTING =====

export const auditReport = pgTable("AuditReport", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  chatId: uuid("chatId").references(() => chat.id),
  title: text("title").notNull(),
  companyName: text("companyName"),
  industry: text("industry"),
  status: varchar("status", {
    enum: ["draft", "in_progress", "completed"]
  }).notNull().default("draft"),
  executiveSummary: text("executiveSummary"),
  processesAnalyzed: json("processesAnalyzed").$type<Array<{
    name: string
    description: string
    currentState: string
    painPoints: string[]
    tools: string[]
  }>>(),
  aiOpportunities: json("aiOpportunities").$type<Array<{
    processName: string
    opportunityType: string
    description: string
    estimatedImpact: string
    priority: "high" | "medium" | "low"
    automationComplexity: "easy" | "medium" | "complex"
  }>>(),
  recommendations: json("recommendations").$type<Array<{
    title: string
    description: string
    benefits: string[]
    implementation: string
  }>>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type AuditReport = InferSelectModel<typeof auditReport>

export const processMap = pgTable("ProcessMap", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  auditReportId: uuid("auditReportId")
    .notNull()
    .references(() => auditReport.id, { onDelete: "cascade" }),
  processName: text("processName").notNull(),
  processType: varchar("processType", {
    enum: ["manual", "semi_automated", "automated"]
  }).notNull(),
  department: text("department"),
  steps: json("steps").$type<Array<{
    stepNumber: number
    name: string
    description: string
    owner: string
    duration: string
    tools: string[]
    automationPotential: number
  }>>(),
  flowDiagram: text("flowDiagram"), // SVG or Mermaid diagram
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type ProcessMap = InferSelectModel<typeof processMap>

// ===== FLEECE AI AUTOMATISATIONS =====

export const automationRecommendation = pgTable("AutomationRecommendation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  auditReportId: uuid("auditReportId")
    .notNull()
    .references(() => auditReport.id, { onDelete: "cascade" }),
  processMapId: uuid("processMapId").references(() => processMap.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: varchar("status", {
    enum: ["pending", "in_progress", "implemented", "rejected"]
  }).notNull().default("pending"),
  priority: varchar("priority", {
    enum: ["high", "medium", "low"]
  }).notNull(),
  estimatedROI: text("estimatedROI"),
  requiredApps: json("requiredApps").$type<Array<{
    name: string
    authType: string
    requiredScopes: string[]
  }>>(),
  workflowSpec: json("workflowSpec").$type<{
    trigger: any
    steps: any[]
    outputs: any[]
  }>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type AutomationRecommendation = InferSelectModel<typeof automationRecommendation>

export const workflow = pgTable("Workflow", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  recommendationId: uuid("recommendationId").references(() => automationRecommendation.id),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  pipedreamWorkflowId: text("pipedreamWorkflowId"), // ID from Pipedream
  status: varchar("status", {
    enum: ["draft", "deploying", "active", "paused", "error"]
  }).notNull().default("draft"),
  configuration: json("configuration").$type<{
    trigger: any
    steps: any[]
    variables: Record<string, any>
  }>(),
  connectedApps: json("connectedApps").$type<Array<{
    appName: string
    authStatus: "connected" | "pending" | "error"
    connectedAt?: string
  }>>(),
  deploymentUrl: text("deploymentUrl"),
  executionStats: json("executionStats").$type<{
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    lastRunAt?: string
  }>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  deployedAt: timestamp("deployedAt"),
})

export type Workflow = InferSelectModel<typeof workflow>

export const workflowExecution = pgTable("WorkflowExecution", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  workflowId: uuid("workflowId")
    .notNull()
    .references(() => workflow.id, { onDelete: "cascade" }),
  pipedreamExecutionId: text("pipedreamExecutionId"),
  status: varchar("status", {
    enum: ["running", "success", "failed", "timeout"]
  }).notNull(),
  startedAt: timestamp("startedAt").notNull().defaultNow(),
  completedAt: timestamp("completedAt"),
  duration: integer("duration"), // in milliseconds
  inputData: json("inputData"),
  outputData: json("outputData"),
  errorDetails: json("errorDetails").$type<{
    message: string
    step: string
    code?: string
  }>(),
})

export type WorkflowExecution = InferSelectModel<typeof workflowExecution>

// ===== FLEECE AI TRAINING =====

export const trainingCourse = pgTable("TrainingCourse", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  workflowId: uuid("workflowId").references(() => workflow.id),
  automationRecommendationId: uuid("automationRecommendationId").references(() => automationRecommendation.id),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", {
    enum: ["beginner", "intermediate", "advanced"]
  }).notNull(),
  estimatedDuration: integer("estimatedDuration"), // in minutes
  category: varchar("category", {
    enum: ["ai_automation", "workflow_management", "app_integration", "process_optimization"]
  }).notNull(),
  coverImageUrl: text("coverImageUrl"),
  learningObjectives: json("learningObjectives").$type<string[]>(),
  prerequisites: json("prerequisites").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  isPublished: boolean("isPublished").notNull().default(false),
  createdBy: uuid("createdBy")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type TrainingCourse = InferSelectModel<typeof trainingCourse>

export const courseModule = pgTable("CourseModule", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  courseId: uuid("courseId")
    .notNull()
    .references(() => trainingCourse.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("orderIndex").notNull(),
  moduleType: varchar("moduleType", {
    enum: ["video", "text", "interactive", "quiz", "hands_on"]
  }).notNull(),
  content: json("content").$type<{
    videoUrl?: string
    transcript?: string
    markdown?: string
    interactiveElements?: any[]
  }>(),
  duration: integer("duration"), // in minutes
  isRequired: boolean("isRequired").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type CourseModule = InferSelectModel<typeof courseModule>

export const quiz = pgTable("Quiz", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  moduleId: uuid("moduleId")
    .notNull()
    .references(() => courseModule.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  passingScore: integer("passingScore").notNull().default(70), // percentage
  questions: json("questions").$type<Array<{
    question: string
    type: "multiple_choice" | "true_false" | "short_answer"
    options?: string[]
    correctAnswer: string | string[]
    explanation: string
    points: number
  }>>(),
  timeLimit: integer("timeLimit"), // in minutes
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type Quiz = InferSelectModel<typeof quiz>

export const userCourseProgress = pgTable("UserCourseProgress", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  courseId: uuid("courseId")
    .notNull()
    .references(() => trainingCourse.id, { onDelete: "cascade" }),
  status: varchar("status", {
    enum: ["not_started", "in_progress", "completed", "abandoned"]
  }).notNull().default("not_started"),
  progressPercentage: integer("progressPercentage").notNull().default(0),
  lastAccessedModuleId: uuid("lastAccessedModuleId").references(() => courseModule.id),
  completedModules: json("completedModules").$type<string[]>().default([]),
  totalTimeSpent: integer("totalTimeSpent").default(0), // in minutes
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type UserCourseProgress = InferSelectModel<typeof userCourseProgress>

export const quizAttempt = pgTable("QuizAttempt", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  quizId: uuid("quizId")
    .notNull()
    .references(() => quiz.id, { onDelete: "cascade" }),
  courseProgressId: uuid("courseProgressId")
    .notNull()
    .references(() => userCourseProgress.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  maxScore: integer("maxScore").notNull(),
  passed: boolean("passed").notNull(),
  answers: json("answers").$type<Array<{
    questionId: number
    userAnswer: string | string[]
    isCorrect: boolean
    pointsEarned: number
  }>>(),
  timeSpent: integer("timeSpent"), // in seconds
  attemptNumber: integer("attemptNumber").notNull(),
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt").notNull(),
})

export type QuizAttempt = InferSelectModel<typeof quizAttempt>

export const certificate = pgTable("Certificate", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  courseId: uuid("courseId")
    .notNull()
    .references(() => trainingCourse.id, { onDelete: "cascade" }),
  certificateNumber: text("certificateNumber").notNull().unique(),
  issueDate: timestamp("issueDate").notNull().defaultNow(),
  expiryDate: timestamp("expiryDate"),
  finalScore: integer("finalScore"),
  certificateUrl: text("certificateUrl"), // PDF URL
  verificationUrl: text("verificationUrl"),
  metadata: json("metadata").$type<{
    courseDuration: number
    completionTime: number
    quizScores: number[]
  }>(),
})

export type Certificate = InferSelectModel<typeof certificate>

// ===== GAMIFICATION & ACHIEVEMENTS =====

export const userAchievement = pgTable("UserAchievement", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  achievementType: varchar("achievementType", {
    enum: [
      "first_audit", "first_workflow", "first_course",
      "workflow_master", "learning_enthusiast", "automation_expert",
      "perfect_score", "speed_learner", "helpful_contributor"
    ]
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  iconUrl: text("iconUrl"),
  points: integer("points").notNull().default(0),
  unlockedAt: timestamp("unlockedAt").notNull().defaultNow(),
})

export type UserAchievement = InferSelectModel<typeof userAchievement>

export const userStats = pgTable("UserStats", {
  userId: uuid("userId")
    .primaryKey()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  totalPoints: integer("totalPoints").notNull().default(0),
  level: integer("level").notNull().default(1),
  auditsCompleted: integer("auditsCompleted").notNull().default(0),
  workflowsDeployed: integer("workflowsDeployed").notNull().default(0),
  coursesCompleted: integer("coursesCompleted").notNull().default(0),
  certificatesEarned: integer("certificatesEarned").notNull().default(0),
  currentStreak: integer("currentStreak").notNull().default(0),
  longestStreak: integer("longestStreak").notNull().default(0),
  lastActivityDate: timestamp("lastActivityDate"),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type UserStats = InferSelectModel<typeof userStats>
