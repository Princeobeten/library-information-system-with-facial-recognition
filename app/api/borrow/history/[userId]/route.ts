import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import BorrowRecord from "@/models/BorrowRecord"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB()

    const borrowRecords = await BorrowRecord.find({ userId: params.userId }).populate("bookId").sort({ borrowDate: -1 })

    return NextResponse.json(borrowRecords)
  } catch (error) {
    console.error("Get borrowing history error:", error)
    return NextResponse.json({ error: "Failed to fetch borrowing history" }, { status: 500 })
  }
}
