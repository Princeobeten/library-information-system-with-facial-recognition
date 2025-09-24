"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface EditBookDialogProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookUpdated: (updatedBook: Book) => void
}

export default function EditBookDialog({
  book,
  open,
  onOpenChange,
  onBookUpdated,
}: EditBookDialogProps) {
  const [formData, setFormData] = useState<Partial<Book>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        description: book.description || "",
        publishedYear: book.publishedYear || undefined,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
      })
    }
  }, [book])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numberValue = parseInt(value)
    if (!isNaN(numberValue)) {
      setFormData((prev) => ({ ...prev, [name]: numberValue }))
    } else if (value === "") {
      setFormData((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!book) return

    setLoading(true)
    try {
      // Ensure we're not setting available copies higher than total copies
      if (
        formData.availableCopies !== undefined && 
        formData.totalCopies !== undefined &&
        formData.availableCopies > formData.totalCopies
      ) {
        formData.availableCopies = formData.totalCopies
      }

      const response = await fetch(`/api/books/${book._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedBook = await response.json()
        onBookUpdated(updatedBook)
        onOpenChange(false)
        toast({
          title: "Success",
          description: "Book updated successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update book",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update book error:", error)
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the information for this book in the library catalog
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min="1"
                value={formData.totalCopies || ""}
                onChange={handleNumberInput}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableCopies">Available Copies</Label>
              <Input
                id="availableCopies"
                name="availableCopies"
                type="number"
                min="0"
                max={formData.totalCopies}
                value={formData.availableCopies || ""}
                onChange={handleNumberInput}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publishedYear">Publication Year</Label>
              <Input
                id="publishedYear"
                name="publishedYear"
                type="number"
                min="1000"
                max={new Date().getFullYear()}
                value={formData.publishedYear || ""}
                onChange={handleNumberInput}
              />
            </div>
            <div className="space-y-2">
              {/* Empty space for alignment */}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Brief description of the book"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
