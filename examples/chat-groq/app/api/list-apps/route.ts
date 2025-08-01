import { pdClient } from "@/lib/pd-backend-client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  // Page is 1-indexed in the existing UI
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
  const pageSize = Math.max(
    1,
    Number.parseInt(searchParams.get("pageSize") || "15")
  )

  // Request up to page * pageSize records so we can slice locally.
  const limit = Math.min(page * pageSize, 100) // API max 100

  const res = await pdClient().getApps({
    limit,
    q: search.trim(),
    sortKey: "featured_weight",
    sortDirection: "desc",
  })

  return NextResponse.json(res)
}
