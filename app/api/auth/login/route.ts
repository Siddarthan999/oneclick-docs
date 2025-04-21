import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: "GitHub client ID not configured" }, { status: 500 })
  }

  const redirectUri = `http://localhost:3000/api/auth/callback`
  const scope = "repo,read:user,user:email"

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent(scope)}`

  return NextResponse.redirect(url)
}
