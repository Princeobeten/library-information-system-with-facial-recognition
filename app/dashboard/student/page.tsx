"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useBook } from "@/hooks/useBook"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Clock, LogOut } from "lucide-react"
import BookCatalog from "@/components/BookCatalog"
import BorrowingHistory from "@/components/BorrowingHistory"
import CurrentBorrows from "@/components/CurrentBorrows"

export default function StudentDashboard() {
  const { user, logout, isStudent } = useAuth()
  const { books, getAllBooks } = useBook()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [borrowedCount, setBorrowedCount] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!isStudent) {
      router.push("/dashboard/admin")
      return
    }
    getAllBooks()
  }, [user, isStudent])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user || !isStudent) {
    return <div>Loading...</div>
  }

  const availableBooks = books.filter((book) => book.availableCopies > 0).length
  const totalBooks = books.length

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
                <p className="text-sm text-gray-500">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge variant="outline">Student</Badge>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">Explore our collection and manage your borrowed books.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableBooks}</div>
              <p className="text-xs text-muted-foreground">Ready to borrow</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBooks}</div>
              <p className="text-xs text-muted-foreground">Books in library</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Borrowed Books</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{borrowedCount}</div>
              <p className="text-xs text-muted-foreground">Currently borrowed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList>
            <TabsTrigger value="catalog">Book Catalog</TabsTrigger>
            <TabsTrigger value="borrowed">My Borrowed Books</TabsTrigger>
            <TabsTrigger value="history">Borrowing History</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <BookCatalog searchTerm={searchTerm} />
            </div>
          </TabsContent>

          <TabsContent value="borrowed">
            <CurrentBorrows userId={user._id} onCountUpdate={setBorrowedCount} />
          </TabsContent>

          <TabsContent value="history">
            <BorrowingHistory userId={user._id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
