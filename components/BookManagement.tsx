"use client"
import { useEffect, useState } from "react"
import { useBook } from "@/hooks/useBook"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, BookOpen } from "lucide-react"
import EditBookDialog from "./EditBookDialog"
import { useToast } from "@/hooks/use-toast"

interface Book {
  _id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  publishedYear?: number
  totalCopies: number
  availableCopies: number
}

export default function BookManagement() {
  const { books, getAllBooks, deleteBook } = useBook()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    getAllBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.includes(searchTerm),
    )
    setFilteredBooks(filtered)
  }, [books, searchTerm])

  const handleDeleteBook = async (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      const result = await deleteBook(bookId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Book deleted successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete book",
          variant: "destructive"
        })
      }
    }
  }
  
  const openEditDialog = (book: Book) => {
    setSelectedBook(book)
    setIsEditDialogOpen(true)
  }
  
  const handleBookUpdated = (updatedBook: Book) => {
    // Update the book in the local state
    const updatedBooks = books.map(book => 
      book._id === updatedBook._id ? updatedBook : book
    )
    setFilteredBooks(updatedBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.includes(searchTerm),
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Book Management
        </CardTitle>
        <CardDescription>Manage your library's book collection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title, author, category, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {books.length === 0 ? "No books in the library yet." : "No books match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                    <TableCell>
                      <span className="text-green-600">{book.availableCopies}</span>
                      <span className="text-muted-foreground">/{book.totalCopies}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={book.availableCopies > 0 ? "default" : "secondary"}>
                        {book.availableCopies > 0 ? "Available" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(book)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <EditBookDialog 
        book={selectedBook} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        onBookUpdated={handleBookUpdated}
      />
    </Card>
  )
}
