"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Scan, Shield } from "lucide-react"

export default function HomePage() {
  const { user, isAdmin, isStudent } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push("/dashboard/admin")
      } else if (isStudent) {
        router.push("/dashboard/student")
      }
    }
  }, [user, isAdmin, isStudent, router])

  const handleGetStarted = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">UNICROSS Library</h1>
                <p className="text-sm text-gray-500">Information System</p>
              </div>
            </div>
            <Button onClick={handleGetStarted}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Modern Library Management</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the future of library management with facial recognition authentication, seamless book borrowing,
            and comprehensive administrative tools.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
            Access Library System
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Scan className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Facial Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure and convenient authentication using advanced facial recognition technology
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Book Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Comprehensive catalog management with real-time availability tracking</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">User Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Separate interfaces for students and administrators with role-based access
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Secure System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Built with security in mind, protecting user data and library resources</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Access Information */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">System Access</CardTitle>
            <CardDescription className="text-center">Access the library management system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4">
              <p className="mb-4">To access the library system, please log in with your matriculation number and password.</p>
              <p className="mb-4">New students should contact the library administrator to register for an account.</p>
              <Button onClick={handleGetStarted} size="lg" className="px-8">
                Access System
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 UNICROSS Library Information System. Built with Next.js and MongoDB.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
