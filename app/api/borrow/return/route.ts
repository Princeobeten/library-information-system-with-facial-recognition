import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import BorrowRecord from "@/models/BorrowRecord"
import Book from "@/models/Book"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { borrowId } = await request.json()

    // Find the borrow record
    const borrowRecord = await BorrowRecord.findById(borrowId)
    if (!borrowRecord) {
      return NextResponse.json({ error: "Borrowing record not found" }, { status: 404 })
    }

    if (borrowRecord.status === "returned") {
      return NextResponse.json({ error: "Book already returned" }, { status: 400 })
    }

    // Update borrow record
    borrowRecord.status = "returned"
    borrowRecord.returnDate = new Date()
    
    // Calculate fine if overdue
    if (borrowRecord.dueDate < new Date()) {
      const dueDate = new Date(borrowRecord.dueDate)
      const today = new Date()
      const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24))
      
      // $0.50 per day fine
      borrowRecord.fine = daysOverdue * 0.5
    }

    await borrowRecord.save()

    // Update book availability
    const book = await Book.findById(borrowRecord.bookId)
    if (book) {
      book.availableCopies += 1
      await book.save()
    }

    return NextResponse.json(borrowRecord)
  } catch (error) {
    console.error("Return book error:", error)
    return NextResponse.json({ error: "Failed to return book" }, { status: 500 })
  }
}
