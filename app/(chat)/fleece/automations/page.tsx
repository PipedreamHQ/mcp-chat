"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Zap,
  Calendar,
  Play,
  Pause,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react"

export default function AutomationsPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch("/api/fleece/automations/workflows")
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.workflows || [])
      }
    } catch (error) {
      console.error("Failed to fetch workflows:", error)
    } finally {
      setLoading(false)
    }
  }

  const createNewWorkflow = () => {
    router.push("/fleece/automations/new")
  }

  const deployWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch("/api/fleece/automations/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId }),
      })

      if (response.ok) {
        fetchWorkflows() // Refresh the list
      }
    } catch (error) {
      console.error("Failed to deploy workflow:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "deploying":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Deploying...
          </Badge>
        )
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Pause className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            Draft
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
                <h1 className="text-2xl font-bold text-purple-600">Fleece AI Automatisations</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Build and deploy Pipedream workflows with AI
                </p>
              </div>
            </div>

            <Button onClick={createNewWorkflow} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Your Automation Workflows
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI-generated workflows connected to 2,500+ apps via Pipedream
          </p>
        </div>

        {/* Workflows List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading workflows...</p>
            </div>
          </div>
        ) : workflows.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Zap className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-center max-w-md">
                Create your first AI-powered workflow to automate your business processes
              </p>
              <Button onClick={createNewWorkflow} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workflow
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        {workflow.name}
                      </CardTitle>
                      {workflow.description && (
                        <CardDescription className="mb-2">
                          {workflow.description}
                        </CardDescription>
                      )}
                      {workflow.connectedApps && workflow.connectedApps.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {workflow.connectedApps.map((app: any, idx: number) => (
                            <Badge key={idx} variant="outline">
                              {app.appName}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(workflow.status)}
                      <span className="text-xs text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(workflow.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {workflow.executionStats && (
                    <div className="flex gap-6 text-sm mb-4">
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <Activity className="w-4 h-4 mr-1" />
                        {workflow.executionStats.totalRuns} runs
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {workflow.executionStats.successfulRuns} successful
                      </div>
                      {workflow.executionStats.failedRuns > 0 && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {workflow.executionStats.failedRuns} failed
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/fleece/automations/${workflow.id}`)}
                    >
                      View Details
                    </Button>
                    {workflow.status === "draft" && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => deployWorkflow(workflow.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Deploy
                      </Button>
                    )}
                    {workflow.deploymentUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(workflow.deploymentUrl, "_blank")}
                      >
                        Open in Pipedream
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-sm flex items-center text-purple-700 dark:text-purple-300">
                <Zap className="w-4 h-4 mr-2" />
                AI-Generated Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Let AI design complete Pipedream workflows based on your requirements
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-sm flex items-center text-blue-700 dark:text-blue-300">
                <Activity className="w-4 h-4 mr-2" />
                2,500+ App Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Connect to any app with OAuth authentication via Pipedream Connect
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-sm flex items-center text-green-700 dark:text-green-300">
                <Play className="w-4 h-4 mr-2" />
                One-Click Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Deploy workflows instantly and monitor executions in real-time
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
