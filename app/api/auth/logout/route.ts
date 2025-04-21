import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  cookies().delete("session")
  return NextResponse.redirect(new URL("/", request.url))
}
