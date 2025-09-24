"use client"
import { useDB } from "@/context/DBProvider"

export const useBook = () => {
  const { books, setBooks } = useDB()

  const addBook = async (bookData: any) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })

      if (response.ok) {
        const newBook = await response.json()
        setBooks([...books, newBook])
        return { success: true, book: newBook }
      } else {
        return { success: false, error: "Failed to add book" }
      }
    } catch (error) {
      return { success: false, error: "Failed to add book" }
    }
  }

  const getAllBooks = async () => {
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const booksData = await response.json()
        setBooks(booksData)
        return booksData
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    }
  }

  const updateBook = async (bookId: string, updateData: any) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedBook = await response.json()
        setBooks(books.map((book) => (book._id === bookId ? updatedBook : book)))
        return { success: true, book: updatedBook }
      } else {
        return { success: false, error: "Failed to update book" }
      }
    } catch (error) {
      return { success: false, error: "Failed to update book" }
    }
  }

  const deleteBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBooks(books.filter((book) => book._id !== bookId))
        return { success: true }
      } else {
        return { success: false, error: "Failed to delete book" }
      }
    } catch (error) {
      return { success: false, error: "Failed to delete book" }
    }
  }

  return {
    books,
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
  }
}
