"use client"
import { useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "student"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAdmin, isStudent } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (requiredRole === "admin" && !isAdmin) {
      router.push("/dashboard/student")
      return
    }

    if (requiredRole === "student" && !isStudent) {
      router.push("/dashboard/admin")
      return
    }
  }, [user, isAdmin, isStudent, requiredRole, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (requiredRole === "admin" && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to student dashboard...</p>
        </div>
      </div>
    )
  }

  if (requiredRole === "student" && !isStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to admin dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
