"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, BookOpen } from "lucide-react"

interface BorrowingHistoryProps {
  userId: string
}

export default function BorrowingHistory({ userId }: BorrowingHistoryProps) {
  const [borrowRecords, setBorrowRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBorrowingHistory()
  }, [userId])

  const fetchBorrowingHistory = async () => {
    try {
      const response = await fetch(`/api/borrow/history/${userId}`)
      if (response.ok) {
        const records = await response.json()
        setBorrowRecords(records)
      }
    } catch (error) {
      console.error("Failed to fetch borrowing history:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "borrowed":
        return <Badge variant="default">Borrowed</Badge>
      case "returned":
        return <Badge variant="secondary">Returned</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Loading borrowing history...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Borrowing History
        </CardTitle>
        <CardDescription>Your complete borrowing history and current loans</CardDescription>
      </CardHeader>
      <CardContent>
        {borrowRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No borrowing history found.</p>
            <p className="text-sm">Start borrowing books to see your history here.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell className="font-medium">{record.bookId?.title || "Unknown Book"}</TableCell>
                    <TableCell>{record.bookId?.author || "Unknown Author"}</TableCell>
                    <TableCell>{formatDate(record.borrowDate)}</TableCell>
                    <TableCell>{formatDate(record.dueDate)}</TableCell>
                    <TableCell>{record.returnDate ? formatDate(record.returnDate) : "-"}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.fine > 0 ? `₦${record.fine}` : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
