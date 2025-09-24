import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import BorrowRecord from "@/models/BorrowRecord"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB()

    // Only find active borrows (status = "borrowed")
    const borrowRecords = await BorrowRecord.find({ 
      userId: params.userId,
      status: "borrowed"
    }).populate("bookId").sort({ borrowDate: -1 })

    // Update any overdue items
    const today = new Date()
    const updatedRecords = await Promise.all(borrowRecords.map(async (record) => {
      if (record.dueDate < today && record.status === "borrowed") {
        // Calculate the number of days overdue
        const daysOverdue = Math.ceil((today.getTime() - new Date(record.dueDate).getTime()) / (1000 * 3600 * 24))
        
        // Calculate the fine ($0.50 per day)
        const fine = daysOverdue * 0.5

        // Update the record status to overdue
        await BorrowRecord.findByIdAndUpdate(record._id, {
          status: "overdue",
          fine: fine
        })

        // Update the record in our response
        record.status = "overdue"
        record.fine = fine
      }
      return record
    }))

    return NextResponse.json(updatedRecords)
  } catch (error) {
    console.error("Get current borrows error:", error)
    return NextResponse.json({ error: "Failed to fetch current borrows" }, { status: 500 })
  }
}
