import type { NextAuthConfig } from "next-auth"
import { isAuthDisabled } from "@/lib/constants"

export const authConfig = {
  pages: {
    signIn: "/api/auth/signin",
  },
  session: {
    strategy: "jwt"
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // If auth is disabled (dev mode), allow all requests
      if (isAuthDisabled) {
        return true
      }

      const isLoggedIn = !!auth?.user
      const isOnRegister = nextUrl.pathname.startsWith("/register")
      const isOnLogin = nextUrl.pathname.startsWith("/login")
      const isAuthRoute = nextUrl.pathname.startsWith("/api/auth")
      const isHealthCheck = nextUrl.pathname.startsWith("/healthcheck")
      const isApiChat = nextUrl.pathname.startsWith("/api/chat")

      if (isHealthCheck) {
        return true
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL))
      }

      if (isOnRegister || isOnLogin || isAuthRoute) {
        return true // Always allow access to register and login pages
      }

      // Only require authentication for the chat API endpoint
      if (isApiChat) {
        return isLoggedIn
      }

      return true
    },
  },
} satisfies NextAuthConfig
