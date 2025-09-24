import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import BorrowRecord from "@/models/BorrowRecord"
import Book from "@/models/Book"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { userId, bookId } = await request.json()

    // Check if book is available
    const book = await Book.findById(bookId)
    if (!book || book.availableCopies <= 0) {
      return NextResponse.json({ error: "Book is not available" }, { status: 400 })
    }

    // Create borrow record
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 2 weeks loan period

    const borrowRecord = new BorrowRecord({
      userId,
      bookId,
      dueDate,
      status: "borrowed",
    })

    await borrowRecord.save()

    // Update book availability
    book.availableCopies -= 1
    await book.save()

    return NextResponse.json(borrowRecord, { status: 201 })
  } catch (error) {
    console.error("Borrow book error:", error)
    return NextResponse.json({ error: "Failed to borrow book" }, { status: 500 })
  }
}
