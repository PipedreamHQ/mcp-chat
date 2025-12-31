import { auth } from "@/(auth)/auth"
import { getEffectiveSession } from "@/lib/auth-utils"
import {
  getQuizByModuleId,
  saveQuizAttempt,
  getQuizAttemptsByUser,
} from "@/lib/db/fleece-queries"

export async function GET(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const moduleId = searchParams.get("moduleId")
  const quizId = searchParams.get("quizId")

  if (!moduleId && !quizId) {
    return Response.json({ error: "Module ID or Quiz ID required" }, { status: 400 })
  }

  try {
    if (moduleId) {
      const quiz = await getQuizByModuleId(moduleId)
      if (!quiz) {
        return Response.json({ error: "Quiz not found" }, { status: 404 })
      }

      // Get user's previous attempts
      const attempts = await getQuizAttemptsByUser(session.user.id, quiz.id)

      return Response.json({ quiz, attempts })
    }

    return Response.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Failed to get quiz:", error)
    return Response.json({ error: "Failed to get quiz" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const { quizId, courseProgressId, answers, timeSpent } = await request.json()

    if (!quizId || !courseProgressId || !answers) {
      return Response.json(
        { error: "Quiz ID, course progress ID, and answers required" },
        { status: 400 }
      )
    }

    // Get the quiz to check correct answers
    const quiz = await getQuizByModuleId(quizId) // This needs to be updated to getQuizById
    if (!quiz) {
      return Response.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Get previous attempts count
    const previousAttempts = await getQuizAttemptsByUser(session.user.id, quizId)
    const attemptNumber = previousAttempts.length + 1

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    const gradedAnswers = []

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i]
      const userAnswer = answers[i]

      const isCorrect = JSON.stringify(userAnswer.answer) === JSON.stringify(question.correctAnswer)
      const pointsEarned = isCorrect ? question.points : 0

      totalPoints += question.points
      earnedPoints += pointsEarned

      gradedAnswers.push({
        questionId: i,
        userAnswer: userAnswer.answer,
        isCorrect,
        pointsEarned,
      })
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    const passed = score >= quiz.passingScore

    // Save attempt
    const attempt = await saveQuizAttempt({
      userId: session.user.id,
      quizId,
      courseProgressId,
      score,
      maxScore: totalPoints,
      passed,
      answers: gradedAnswers,
      timeSpent,
      attemptNumber,
      startedAt: new Date(Date.now() - (timeSpent || 0) * 1000),
      completedAt: new Date(),
    })

    return Response.json({ attempt, score, passed })
  } catch (error) {
    console.error("Failed to submit quiz:", error)
    return Response.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
