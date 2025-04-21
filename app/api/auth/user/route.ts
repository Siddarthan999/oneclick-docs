import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = await verifySessionToken(sessionCookie.value)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Return user data without the access token
    return NextResponse.json({
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    })
  } catch (error) {
    console.error("Error getting user:", error)
    return NextResponse.json({ user: null })
  }
}
