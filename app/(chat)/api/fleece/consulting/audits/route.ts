import { auth } from "@/(auth)/auth"
import { getEffectiveSession } from "@/lib/auth-utils"
import {
  saveAuditReport,
  updateAuditReport,
  getAuditReportById,
  getAuditReportsByUserId,
  deleteAuditReport,
  getProcessMapsByAuditReportId,
} from "@/lib/db/fleece-queries"

export async function GET(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const auditId = searchParams.get("id")

  try {
    if (auditId) {
      // Get specific audit report
      const audit = await getAuditReportById(auditId)

      if (!audit) {
        return Response.json({ error: "Audit not found" }, { status: 404 })
      }

      if (audit.userId !== session.user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 })
      }

      // Get process maps for this audit
      const processMaps = await getProcessMapsByAuditReportId(auditId)

      return Response.json({ audit, processMaps })
    } else {
      // Get all audits for user
      const audits = await getAuditReportsByUserId(session.user.id)
      return Response.json({ audits })
    }
  } catch (error) {
    console.error("Failed to get audit reports:", error)
    return Response.json({ error: "Failed to get audit reports" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const data = await request.json()

    const audit = await saveAuditReport({
      ...data,
      userId: session.user.id,
    })

    return Response.json({ audit })
  } catch (error) {
    console.error("Failed to create audit report:", error)
    return Response.json({ error: "Failed to create audit report" }, { status: 500 })
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
      return Response.json({ error: "Audit ID required" }, { status: 400 })
    }

    // Verify ownership
    const existing = await getAuditReportById(id)
    if (!existing) {
      return Response.json({ error: "Audit not found" }, { status: 404 })
    }

    if (existing.userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const audit = await updateAuditReport(id, data)

    return Response.json({ audit })
  } catch (error) {
    console.error("Failed to update audit report:", error)
    return Response.json({ error: "Failed to update audit report" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const auditId = searchParams.get("id")

  if (!auditId) {
    return Response.json({ error: "Audit ID required" }, { status: 400 })
  }

  try {
    // Verify ownership
    const existing = await getAuditReportById(auditId)
    if (!existing) {
      return Response.json({ error: "Audit not found" }, { status: 404 })
    }

    if (existing.userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    await deleteAuditReport(auditId)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to delete audit report:", error)
    return Response.json({ error: "Failed to delete audit report" }, { status: 500 })
  }
}
