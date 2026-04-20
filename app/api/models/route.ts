import { getAvailableModels } from "@/lib/ai/models"

export async function GET() {
  return Response.json(getAvailableModels(), {
    headers: { "Cache-Control": "no-store" },
  })
}
