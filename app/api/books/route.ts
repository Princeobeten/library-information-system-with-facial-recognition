import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Book from "@/models/Book"

export async function GET() {
  try {
    await connectDB()
    const books = await Book.find().sort({ createdAt: -1 })
    return NextResponse.json(books)
  } catch (error) {
    console.error("Get books error:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const bookData = await request.json()
    const book = new Book(bookData)
    const savedBook = await book.save()

    return NextResponse.json(savedBook, { status: 201 })
  } catch (error) {
    console.error("Add book error:", error)
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 })
  }
}
