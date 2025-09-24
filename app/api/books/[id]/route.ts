import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Book from "@/models/Book"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    
    const book = await Book.findById(params.id)
    
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    
    return NextResponse.json(book)
  } catch (error) {
    console.error("Get book error:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const updateData = await request.json()
    const book = await Book.findByIdAndUpdate(params.id, updateData, { new: true })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Update book error:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const book = await Book.findByIdAndDelete(params.id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Delete book error:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}
