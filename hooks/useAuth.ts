"use client"
import { useState } from "react"
import { useDB } from "@/context/DBProvider"

export const useAuth = () => {
  const { user, setUser } = useDB()
  const [loading, setLoading] = useState(false)

  const login = async (matricNo: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricNo, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return { success: true, user: userData }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      return { success: false, error: "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const loginWithFace = async (faceData: string) => {
    setLoading(true)
    try {
      // Mock facial recognition - in real implementation, this would process face data
      const response = await fetch("/api/auth/face-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceData }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return { success: true, user: userData }
      } else {
        return { success: false, error: "Face recognition failed" }
      }
    } catch (error) {
      return { success: false, error: "Face login failed" }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return {
    user,
    login,
    loginWithFace,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
  }
}
