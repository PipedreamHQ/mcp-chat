"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Zap,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react"

export default function FleeceAIDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    // For now, using mock data
    setStats({
      auditsCompleted: 3,
      activeWorkflows: 5,
      coursesInProgress: 2,
      certificatesEarned: 1,
      level: 3,
      totalPoints: 1250,
    })
    setLoading(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fleece AI
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your Complete AI Automation Ecosystem
              </p>
            </div>

            {!loading && stats && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Level {stats.level}</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {stats.totalPoints} pts
                  </div>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Transform your business with AI automation - from audit to implementation to training.
          </p>
        </div>

        {/* Stats Overview */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Audits Completed
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.auditsCompleted}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Workflows
                </CardTitle>
                <Zap className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeWorkflows}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Courses in Progress
                </CardTitle>
                <Clock className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.coursesInProgress}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Certificates
                </CardTitle>
                <Award className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* The 3 Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Consulting */}
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-600">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Search className="w-10 h-10 text-blue-600" />
                <Badge variant="secondary">Step 1</Badge>
              </div>
              <CardTitle className="text-xl">Fleece AI Consulting</CardTitle>
              <CardDescription>
                Audit your business processes and discover AI automation opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>AI-powered business process audit</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Generate process maps and diagrams</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Detailed automation recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>ROI estimates and priorities</span>
                </li>
              </ul>

              <Link href="/fleece/consulting" className="w-full block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Audit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Automatisations */}
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-purple-600">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-10 h-10 text-purple-600" />
                <Badge variant="secondary">Step 2</Badge>
              </div>
              <CardTitle className="text-xl">Fleece AI Automatisations</CardTitle>
              <CardDescription>
                Transform recommendations into live workflows with Pipedream
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span>AI generates Pipedream workflows</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span>Connect 2,500+ apps via OAuth</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span>One-click deployment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span>Real-time execution monitoring</span>
                </li>
              </ul>

              <Link href="/fleece/automations" className="w-full block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Build Workflows
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Training */}
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-green-600">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <GraduationCap className="w-10 h-10 text-green-600" />
                <Badge variant="secondary">Step 3</Badge>
              </div>
              <CardTitle className="text-xl">Fleece AI Training</CardTitle>
              <CardDescription>
                Master your automations with personalized courses and certifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>AI-generated personalized courses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>Interactive video lessons</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>Knowledge check quizzes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>Earn verified certificates</span>
                </li>
              </ul>

              <Link href="/fleece/training" className="w-full block">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-none">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
            <CardDescription>Transform your business in 3 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Audit & Discover</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Consulting analyzes your processes and identifies automation opportunities
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Build & Deploy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Automatisations creates and deploys your workflows with connected apps
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Learn & Master</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Training generates courses so your team masters the new workflows
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <div>© 2024 Fleece AI. Powered by Pipedream.</div>
            <div className="flex gap-6">
              <Link href="/docs" className="hover:text-slate-900 dark:hover:text-slate-100">
                Documentation
              </Link>
              <Link href="/support" className="hover:text-slate-900 dark:hover:text-slate-100">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
