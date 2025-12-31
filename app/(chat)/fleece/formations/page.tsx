"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Play,
  Trophy,
  Star,
} from "lucide-react"

export default function TrainingPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [userProgress, setUserProgress] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coursesRes, certificatesRes] = await Promise.all([
        fetch("/api/fleece/training/courses?progress=true"),
        fetch("/api/fleece/training/certificates"),
      ])

      if (coursesRes.ok) {
        const data = await coursesRes.json()
        setCourses(data.courses || [])
        setUserProgress(data.userProgress || [])
      }

      if (certificatesRes.ok) {
        const data = await certificatesRes.json()
        setCertificates(data.certificates || [])
      }
    } catch (error) {
      console.error("Failed to fetch training data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Badge className="bg-green-100 text-green-800">Beginner</Badge>
      case "intermediate":
        return <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>
      case "advanced":
        return <Badge className="bg-red-100 text-red-800">Advanced</Badge>
      default:
        return null
    }
  }

  const getCourseProgress = (courseId: string) => {
    return userProgress.find((p: any) => p.courseId === courseId)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/fleece">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
              <div>
                <h1 className="text-2xl font-bold text-green-600">Fleece AI Training</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Master your automations with personalized courses
                </p>
              </div>
            </div>

            {certificates.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/20 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <Award className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                    {certificates.length} Certificate{certificates.length > 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">
                    Earned
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Courses Available
              </CardTitle>
              <BookOpen className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                In Progress
              </CardTitle>
              <Clock className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.filter((p: any) => p.status === "in_progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Completed
              </CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.filter((p: any) => p.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Certificates
              </CardTitle>
              <Trophy className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Available Courses
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Loading courses...</p>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses available yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-center max-w-md">
                  Courses will be automatically generated when you deploy workflows in Automatisations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const progress = getCourseProgress(course.id)

                return (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                    onClick={() => router.push(`/fleece/training/${course.id}`)}
                  >
                    {course.coverImageUrl && (
                      <div className="h-32 bg-gradient-to-br from-green-400 to-blue-500" />
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-base">{course.title}</CardTitle>
                        {getDifficultyBadge(course.difficulty)}
                      </div>

                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.estimatedDuration || 0} min
                        </div>
                        {course.category && (
                          <Badge variant="outline" className="text-xs">
                            {course.category.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </div>

                      {progress ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                              Progress
                            </span>
                            <span className="font-semibold">
                              {progress.progressPercentage}%
                            </span>
                          </div>
                          <Progress value={progress.progressPercentage} />

                          {progress.status === "completed" ? (
                            <Badge className="w-full justify-center bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/fleece/training/${course.id}`)
                              }}
                            >
                              Continue Learning
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/fleece/training/${course.id}`)
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Course
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Your Certificates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <Card
                  key={cert.id}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-900"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-8 h-8 text-yellow-600" />
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {cert.finalScore}%
                      </Badge>
                    </div>
                    <CardTitle className="text-base">Certificate of Completion</CardTitle>
                    <CardDescription>
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="text-sm font-mono text-slate-600 dark:text-slate-400 mb-4">
                      {cert.certificateNumber}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
