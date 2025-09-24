"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Clock, Search, BookOpen, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BorrowRecord {
  _id: string
  userId: {
    _id: string
    name: string
    matricNo: string
  }
  bookId: {
    _id: string
    title: string
    author: string
    isbn: string
  }
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: "borrowed" | "returned" | "overdue"
  fine: number
}

export default function AdminBorrowingHistory() {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<BorrowRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchAllBorrowingRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [borrowRecords, searchTerm, statusFilter])

  const fetchAllBorrowingRecords = async () => {
    try {
      const response = await fetch("/api/borrow/all")
      if (response.ok) {
        const records = await response.json()
        setBorrowRecords(records)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch borrowing records",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch borrowing records:", error)
      toast({
        title: "Error",
        description: "Failed to fetch borrowing records",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = [...borrowRecords]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(record => 
        (record.bookId?.title && record.bookId.title.toLowerCase().includes(lowerSearchTerm)) ||
        (record.userId?.name && record.userId.name.toLowerCase().includes(lowerSearchTerm)) ||
        (record.userId?.matricNo && record.userId.matricNo.toLowerCase().includes(lowerSearchTerm)) ||
        (record.bookId?.isbn && record.bookId.isbn.includes(searchTerm))
      )
    }

    setFilteredRecords(filtered)
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

  const handleReturnBook = async (borrowId: string) => {
    try {
      const response = await fetch("/api/borrow/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId }),
      })

      if (response.ok) {
        const returnedRecord = await response.json()
        // Update the record in the state
        setBorrowRecords(
          borrowRecords.map(record => 
            record._id === returnedRecord._id ? returnedRecord : record
          )
        )
        toast({
          title: "Success",
          description: "Book marked as returned successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to return book",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Return book error:", error)
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Loading borrowing records...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Borrowing Records
        </CardTitle>
        <CardDescription>Comprehensive view of all library borrowing activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by book title, student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No borrowing records found.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Matric No.</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell className="font-medium">{record.userId?.name || "Unknown"}</TableCell>
                    <TableCell>{record.userId?.matricNo || "Unknown"}</TableCell>
                    <TableCell>{record.bookId?.title || "Unknown Book"}</TableCell>
                    <TableCell>{formatDate(record.borrowDate)}</TableCell>
                    <TableCell>{formatDate(record.dueDate)}</TableCell>
                    <TableCell>{record.returnDate ? formatDate(record.returnDate) : "-"}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.fine > 0 ? (
                        <span className="text-destructive font-medium">₦{record.fine.toFixed(2)}</span>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {record.status === "borrowed" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleReturnBook(record._id)}
                          className="h-8 px-3"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Return
                        </Button>
                      )}
                    </TableCell>
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
