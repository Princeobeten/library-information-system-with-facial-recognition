"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useBook } from "@/hooks/useBook"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, TrendingUp, Plus, LogOut, LayoutDashboard } from "lucide-react"
import AddBookDialog from "@/components/AddBookDialog"
import BookManagement from "@/components/BookManagement"
import UserManagement from "@/components/UserManagement"
import AdminBorrowingHistory from "@/components/AdminBorrowingHistory"
import DashboardStats from "@/components/DashboardStats"

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth()
  const { books, getAllBooks } = useBook()
  const router = useRouter()
  const [showAddBook, setShowAddBook] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!isAdmin) {
      router.push("/dashboard/student")
      return
    }
    getAllBooks()
  }, [user, isAdmin])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user || !isAdmin) {
    return <div>Loading...</div>
  }

  // Dashboard stats are now handled by the DashboardStats component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">UNICROSS Library</h1>
                <p className="text-sm text-gray-500">Administrator Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge variant="secondary">Admin</Badge>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="books">
                <BookOpen className="h-4 w-4 mr-2" />
                Books
              </TabsTrigger>
              <TabsTrigger value="borrowing">
                <TrendingUp className="h-4 w-4 mr-2" />
                Borrowings
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
            </TabsList>

            <Button onClick={() => setShowAddBook(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </div>

          <TabsContent value="dashboard">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="books">
            <BookManagement />
          </TabsContent>

          <TabsContent value="borrowing">
            <AdminBorrowingHistory />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>

      <AddBookDialog open={showAddBook} onOpenChange={setShowAddBook} />
    </div>
  )
}
