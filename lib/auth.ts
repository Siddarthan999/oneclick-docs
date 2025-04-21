import { jwtVerify, SignJWT } from "jose"

// Secret key for JWT signing and verification
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change_in_production")

export interface SessionUser {
  id: string
  login: string
  name: string | null
  email: string | null
  avatarUrl: string
  accessToken: string
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.user as SessionUser
  } catch (error) {
    return null
  }
}

export async function getGitHubUser(code: string): Promise<SessionUser | null> {
  // Exchange code for access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (!tokenData.access_token) {
    return null
  }

  // Get user data with the access token
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  const userData = await userResponse.json()

  if (!userData.id) {
    return null
  }

  return {
    id: userData.id.toString(),
    login: userData.login,
    name: userData.name,
    email: userData.email,
    avatarUrl: userData.avatar_url,
    accessToken: tokenData.access_token,
  }
}
