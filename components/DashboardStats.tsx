"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Users, Clock, AlertTriangle, PieChart, Library, BookMarked, BadgeDollarSign } from "lucide-react"

interface StatsData {
  books: {
    totalBooks: number
    totalCopies: number
    availableCopies: number
    borrowedCopies: number
  }
  users: {
    totalUsers: number
    studentUsers: number
    adminUsers: number
  }
  borrowings: {
    activeBorrowings: number
    overdueItems: number
    returnedItems: number
    totalFines: string
  }
  categories: Array<{
    category: string
    borrowCount: number
  }>
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load statistics",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card className="col-span-full">
        <CardContent className="py-10 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Could not load library statistics</p>
          <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Book stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.books.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.books.totalCopies} total copies in library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Copies</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.books.availableCopies}</div>
            <p className="text-xs text-muted-foreground">
              {stats.books.borrowedCopies} copies currently borrowed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Library Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.studentUsers} students, {stats.users.adminUsers} administrators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borrowings.activeBorrowings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.borrowings.overdueItems > 0 ? (
                <span className="text-red-500">{stats.borrowings.overdueItems} overdue</span>
              ) : (
                "No overdue items"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Additional stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Popular Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categories.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1/3 font-medium truncate">{category.category}</div>
                  <div className="w-2/3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ 
                          width: `${Math.min(100, (category.borrowCount / Math.max(...stats.categories.map(c => c.borrowCount))) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{category.borrowCount} borrowed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeDollarSign className="h-5 w-5" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Total Fines Collected</p>
                <p className="text-2xl font-bold">₦{stats.borrowings.totalFines}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Returned Items</p>
                <p className="text-xl">{stats.borrowings.returnedItems}</p>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Overdue rate: {stats.borrowings.overdueItems > 0 ? 
                  `${((stats.borrowings.overdueItems / stats.borrowings.activeBorrowings) * 100).toFixed(1)}%` : 
                  '0%'
                }</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
