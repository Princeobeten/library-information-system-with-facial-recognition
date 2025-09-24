import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Book from "@/models/Book"
import User from "@/models/User"
import BorrowRecord from "@/models/BorrowRecord"

export async function GET() {
  try {
    await connectDB()

    // Get book statistics
    const totalBooks = await Book.countDocuments()
    const booksData = await Book.find()
    const totalCopies = booksData.reduce((sum, book) => sum + book.totalCopies, 0)
    const availableCopies = booksData.reduce((sum, book) => sum + book.availableCopies, 0)
    const borrowedCopies = totalCopies - availableCopies

    // Get user statistics
    const totalUsers = await User.countDocuments()
    const studentUsers = await User.countDocuments({ role: "student" })
    const adminUsers = await User.countDocuments({ role: "admin" })

    // Get borrowing statistics
    const activeBorrowings = await BorrowRecord.countDocuments({ status: "borrowed" })
    const overdueItems = await BorrowRecord.countDocuments({
      status: "borrowed",
      dueDate: { $lt: new Date() }
    })
    const returnedItems = await BorrowRecord.countDocuments({ status: "returned" })

    // Get total fines
    const fineData = await BorrowRecord.find({ fine: { $gt: 0 } })
    const totalFines = fineData.reduce((sum, record) => sum + record.fine, 0)

    // Get most borrowed categories
    const books = await Book.find()
    const categoryMap = {}
    books.forEach(book => {
      if (!categoryMap[book.category]) {
        categoryMap[book.category] = 0
      }
      categoryMap[book.category] += (book.totalCopies - book.availableCopies)
    })

    const categoryStats = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      borrowCount: count
    })).sort((a, b) => b.borrowCount - a.borrowCount)

    return NextResponse.json({
      books: {
        totalBooks,
        totalCopies,
        availableCopies,
        borrowedCopies
      },
      users: {
        totalUsers,
        studentUsers,
        adminUsers
      },
      borrowings: {
        activeBorrowings,
        overdueItems,
        returnedItems,
        totalFines: totalFines.toFixed(2)
      },
      categories: categoryStats
    })
  } catch (error) {
    console.error("Get statistics error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
