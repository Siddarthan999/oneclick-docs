import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { createSessionToken, getGitHubUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    const user = await getGitHubUser(code)

    if (!user) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    const token = await createSessionToken(user)

    // Set the session cookie
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
