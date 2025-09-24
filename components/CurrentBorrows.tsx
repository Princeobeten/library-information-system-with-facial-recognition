"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { BorrowRecord as BorrowRecordType } from "@/types"

interface CurrentBorrowsProps {
  userId: string
  onCountUpdate?: (count: number) => void
}

// Extend the BorrowRecord type with populated fields since the API populates the bookId
interface BorrowRecord extends Omit<BorrowRecordType, 'bookId'> {
  bookId: {
    _id: string
    title: string
    author: string
    isbn: string
  }
}

export default function CurrentBorrows({ userId, onCountUpdate }: CurrentBorrowsProps) {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCurrentBorrows()
  }, [userId])

  const fetchCurrentBorrows = async () => {
    try {
      const response = await fetch(`/api/borrow/current/${userId}`)
      if (response.ok) {
        const records = await response.json()
        setBorrowRecords(records)
        
        // Update parent component with count if callback provided
        if (onCountUpdate) {
          onCountUpdate(records.length)
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch borrowed books",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error)
      toast({
        title: "Error",
        description: "Failed to fetch borrowed books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (status === "overdue") {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (daysRemaining <= 2) {
      return <Badge variant="destructive">Due Soon</Badge>
    } else if (daysRemaining <= 5) {
      return <Badge variant="outline">Due in {daysRemaining} days</Badge>
    } else {
      return <Badge variant="default">Borrowed</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Loading borrowed books...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Borrowed Books</CardTitle>
        <CardDescription>Books you have currently borrowed from the library</CardDescription>
      </CardHeader>
      <CardContent>
        {borrowRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>You haven't borrowed any books yet.</p>
            <p className="text-sm">Browse the catalog to find books to borrow.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {borrowRecords.some(record => record.status === "overdue") && (
              <div className="flex items-center p-4 rounded-md bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                <div>
                  <p className="text-amber-800 font-medium">You have overdue books</p>
                  <p className="text-sm text-amber-700">Please return them as soon as possible to avoid additional fees.</p>
                </div>
              </div>
            )}
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowRecords.map((record) => {
                    const daysRemaining = calculateDaysRemaining(record.dueDate)
                    return (
                      <TableRow key={record._id}>
                        <TableCell className="font-medium">{record.bookId?.title || "Unknown Book"}</TableCell>
                        <TableCell>{record.bookId?.author || "Unknown Author"}</TableCell>
                        <TableCell>{formatDate(record.borrowDate)}</TableCell>
                        <TableCell>{formatDate(record.dueDate)}</TableCell>
                        <TableCell>{getStatusBadge(record.status, daysRemaining)}</TableCell>
                        <TableCell>
                          {record.fine > 0 ? (
                            <span className="text-destructive font-medium">₦{record.fine.toFixed(2)}</span>
                          ) : "-"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
