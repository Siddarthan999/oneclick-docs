import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"
import { fetchUserRepositories } from "@/lib/github"

export async function GET(request: NextRequest) {
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

    const repositories = await fetchUserRepositories(user.accessToken)
    return NextResponse.json({ repositories })
  } catch (error) {
    console.error("Error fetching repositories:", error)
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 })
  }
}
