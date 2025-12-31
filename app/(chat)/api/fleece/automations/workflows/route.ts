import { auth } from "@/(auth)/auth"
import { getEffectiveSession } from "@/lib/auth-utils"
import {
  saveWorkflow,
  updateWorkflow,
  getWorkflowById,
  getWorkflowsByUserId,
  deleteWorkflow,
  getWorkflowExecutionsByWorkflowId,
  saveWorkflowExecution,
} from "@/lib/db/fleece-queries"

export async function GET(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const workflowId = searchParams.get("id")
  const includeExecutions = searchParams.get("executions") === "true"

  try {
    if (workflowId) {
      // Get specific workflow
      const workflow = await getWorkflowById(workflowId)

      if (!workflow) {
        return Response.json({ error: "Workflow not found" }, { status: 404 })
      }

      if (workflow.userId !== session.user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 })
      }

      let executions = []
      if (includeExecutions) {
        executions = await getWorkflowExecutionsByWorkflowId(workflowId)
      }

      return Response.json({ workflow, executions })
    } else {
      // Get all workflows for user
      const workflows = await getWorkflowsByUserId(session.user.id)
      return Response.json({ workflows })
    }
  } catch (error) {
    console.error("Failed to get workflows:", error)
    return Response.json({ error: "Failed to get workflows" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const data = await request.json()

    const workflow = await saveWorkflow({
      ...data,
      userId: session.user.id,
      connectedApps: data.connectedApps || [],
      executionStats: data.executionStats || {
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
      },
    })

    return Response.json({ workflow })
  } catch (error) {
    console.error("Failed to create workflow:", error)
    return Response.json({ error: "Failed to create workflow" }, { status: 500 })
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
      return Response.json({ error: "Workflow ID required" }, { status: 400 })
    }

    // Verify ownership
    const existing = await getWorkflowById(id)
    if (!existing) {
      return Response.json({ error: "Workflow not found" }, { status: 404 })
    }

    if (existing.userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const workflow = await updateWorkflow(id, data)

    return Response.json({ workflow })
  } catch (error) {
    console.error("Failed to update workflow:", error)
    return Response.json({ error: "Failed to update workflow" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getEffectiveSession()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const workflowId = searchParams.get("id")

  if (!workflowId) {
    return Response.json({ error: "Workflow ID required" }, { status: 400 })
  }

  try {
    // Verify ownership
    const existing = await getWorkflowById(workflowId)
    if (!existing) {
      return Response.json({ error: "Workflow not found" }, { status: 404 })
    }

    if (existing.userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    await deleteWorkflow(workflowId)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to delete workflow:", error)
    return Response.json({ error: "Failed to delete workflow" }, { status: 500 })
  }
}
