"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700 dark:text-gray-200">
          {session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 rounded-md bg-gray-800 text-white text-sm hover:bg-gray-700"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500"
    >
      Sign in with Google
    </button>
  )
}
