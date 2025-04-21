import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ["/dashboard"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get("session")

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    const user = await verifySessionToken(sessionCookie.value)

    if (!user) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
