"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FaceRecognition from "@/components/FaceRecognition"
import { BookOpen, User, Lock } from "lucide-react"

export default function LoginPage() {
  const [matricNo, setMatricNo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loginWithFace, loading } = useAuth()
  const router = useRouter()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await login(matricNo, password)
    if (result.success) {
      router.push(result.user.role === "admin" ? "/dashboard/admin" : "/dashboard/student")
    } else {
      setError(result.error || "Login failed")
    }
  }

  const handleFaceLogin = async (faceData: string) => {
    setError("")

    const result = await loginWithFace(faceData)
    if (result.success) {
      router.push(result.user.role === "admin" ? "/dashboard/admin" : "/dashboard/student")
    } else {
      setError(result.error || "Face recognition failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">UNICROSS Library</h1>
          </div>
          <p className="text-gray-600">Library Information System</p>
        </div>

        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="face" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Face ID
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Login with Password</CardTitle>
                <CardDescription>Enter your matriculation number and password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="matricNo">Matriculation Number</Label>
                    <Input
                      id="matricNo"
                      type="text"
                      placeholder="e.g., 20/1234/CS"
                      value={matricNo}
                      onChange={(e) => setMatricNo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="face">
            <FaceRecognition 
              onFaceDetected={handleFaceLogin} 
              loading={loading} 
            />
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Please contact the librarian if you need access.</p>
        </div>
      </div>
    </div>
  )
}
