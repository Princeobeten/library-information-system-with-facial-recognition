import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import BorrowRecord from "@/models/BorrowRecord"

export async function GET() {
  try {
    await connectDB()

    // Populate both user and book details for each record
    const borrowRecords = await BorrowRecord.find()
      .populate({ path: "userId", select: "name matricNo" })
      .populate({ path: "bookId", select: "title author isbn" })
      .sort({ borrowDate: -1 })

    return NextResponse.json(borrowRecords)
  } catch (error) {
    console.error("Get all borrowing records error:", error)
    return NextResponse.json({ error: "Failed to fetch borrowing records" }, { status: 500 })
  }
}
