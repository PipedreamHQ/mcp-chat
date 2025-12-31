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
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export default function ConsultingPage() {
  const router = useRouter()
  const [audits, setAudits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = async () => {
    try {
      const response = await fetch("/api/fleece/consulting/audits")
      if (response.ok) {
        const data = await response.json()
        setAudits(data.audits || [])
      }
    } catch (error) {
      console.error("Failed to fetch audits:", error)
    } finally {
      setLoading(false)
    }
  }

  const createNewAudit = async () => {
    // Redirect to chat interface for new audit
    router.push("/fleece/consulting/new")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
                <h1 className="text-2xl font-bold text-blue-600">Fleece AI Consulting</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Audit your business processes and discover AI opportunities
                </p>
              </div>
            </div>

            <Button onClick={createNewAudit} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Audit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            AI-Powered Business Process Audits
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Let our AI consultant analyze your workflows and identify automation opportunities
          </p>
        </div>

        {/* Audits List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading audits...</p>
            </div>
          </div>
        ) : audits.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-center max-w-md">
                Start your first business process audit to discover AI automation opportunities
              </p>
              <Button onClick={createNewAudit} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Start Your First Audit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {audits.map((audit) => (
              <Card
                key={audit.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/fleece/consulting/${audit.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{audit.title}</CardTitle>
                      {audit.companyName && (
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline">{audit.companyName}</Badge>
                          {audit.industry && (
                            <Badge variant="outline">{audit.industry}</Badge>
                          )}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(audit.status)}
                      <span className="text-xs text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {audit.executiveSummary && (
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {audit.executiveSummary}
                    </p>

                    <div className="flex gap-4 mt-4 text-sm">
                      {audit.processesAnalyzed && (
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          <FileText className="w-4 h-4 mr-1" />
                          {audit.processesAnalyzed.length} processes
                        </div>
                      )}
                      {audit.aiOpportunities && (
                        <div className="flex items-center text-blue-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {audit.aiOpportunities.length} opportunities
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-sm flex items-center text-blue-700 dark:text-blue-300">
                <FileText className="w-4 h-4 mr-2" />
                Process Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Get detailed visualizations of your current workflows and processes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-sm flex items-center text-purple-700 dark:text-purple-300">
                <TrendingUp className="w-4 h-4 mr-2" />
                AI Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Discover automation opportunities with ROI estimates and priorities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-sm flex items-center text-green-700 dark:text-green-300">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Actionable Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Receive detailed implementation plans ready for automation
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
