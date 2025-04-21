import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"
import { fetchRepositoryStructure } from "@/lib/github"
import { generateDocumentation } from "@/lib/ai"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const sessionCookie = await cookieStore.get("session")

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await verifySessionToken(sessionCookie.value)

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const { owner, repo, branch } = await request.json()

    if (!owner || !repo) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const { fileContents } = await fetchRepositoryStructure(user.accessToken, owner, repo, branch || "master")

    const documentation = await generateDocumentation(repo, fileContents)

    return NextResponse.json({ documentation })
  } catch (error) {
    console.error("Error generating documentation:", error)
    return NextResponse.json({ error: "Failed to generate documentation" }, { status: 500 })
  }
}

