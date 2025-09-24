"use client"
import { useEffect, useState } from "react"
import { useBook } from "@/hooks/useBook"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, User, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Book {
  _id: string
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  availableCopies: number
  description?: string
  publishedYear?: number
}

interface BookCatalogProps {
  searchTerm: string
}

export default function BookCatalog({ searchTerm }: BookCatalogProps) {
  const { books, getAllBooks } = useBook()
  const { user } = useAuth()
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [borrowingBook, setBorrowingBook] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    getAllBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBooks(filtered)
  }, [books, searchTerm])

  const handleBorrowBook = async (bookId: string) => {
    setBorrowingBook(bookId)

    try {
      const response = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          bookId: bookId,
        }),
      })

      if (response.ok) {
        // Refresh books to update available copies
        getAllBooks()
        toast({
          title: "Success",
          description: "Book borrowed successfully!",
          action: <CheckCircle className="h-4 w-4 text-green-500" />
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to borrow book",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to borrow book. Please try again.",
        variant: "destructive"
      })
    } finally {
      setBorrowingBook(null)
    }
  }

  return (
    <div className="space-y-6">
      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {books.length === 0 ? "No books available in the library." : "No books match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">
                    {book.category}
                  </Badge>
                  <Badge variant={book.availableCopies > 0 ? "default" : "secondary"}>
                    {book.availableCopies > 0 ? "Available" : "Out of Stock"}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  {book.description && <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {book.publishedYear}
                    </span>
                    <span>ISBN: {book.isbn}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-green-600 font-medium">{book.availableCopies}</span>
                    <span className="text-muted-foreground"> of {book.totalCopies} available</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleBorrowBook(book._id)}
                  disabled={book.availableCopies === 0 || borrowingBook === book._id}
                  className="w-full"
                >
                  {borrowingBook === book._id
                    ? "Borrowing..."
                    : book.availableCopies === 0
                      ? "Out of Stock"
                      : "Borrow Book"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
