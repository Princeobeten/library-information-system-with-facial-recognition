import mongoose from "mongoose"
import path from "path"
import dotenv from "dotenv"

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

// Extract what we need from mongoose
const { Schema, model, models } = mongoose

// Recreate the connectDB function here to avoid path issues
let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    isConnected = true
    console.log("✅ MongoDB connected")
  } catch (err) {
    console.error("❌ MongoDB connection failed", err)
    throw err
  }
}

// Recreate the models inline to avoid path issues
const UserSchema = new Schema({
  name: { type: String, required: true },
  matricNo: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], required: true },
  faceId: String,
  createdAt: { type: Date, default: Date.now },
})

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  description: String,
  publishedYear: Number,
  createdAt: { type: Date, default: Date.now },
})

const BorrowRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: Date,
  status: { type: String, enum: ["borrowed", "returned", "overdue"], default: "borrowed" },
  fine: { type: Number, default: 0 },
})

const User = models.User || model("User", UserSchema)
const Book = models.Book || model("Book", BookSchema)
const BorrowRecord = models.BorrowRecord || model("BorrowRecord", BorrowRecordSchema)

// Create test borrows for each student
async function createTestBorrows() {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log("Connected to MongoDB")

    // Find all student users
    const students = await User.find({ role: "student" })
    if (students.length === 0) {
      console.log("No student users found. Please run seed-db first.")
      return
    }

    // Find available books
    const availableBooks = await Book.find({ availableCopies: { $gt: 0 } })
    if (availableBooks.length === 0) {
      console.log("No available books found. Please run add-books first.")
      return
    }

    // Create borrow records
    const borrowRecords = []

    // For each student, borrow 1-3 books
    for (const student of students) {
      const numBooksToBorrow = Math.floor(Math.random() * 3) + 1 // 1 to 3 books
      const studentBooks = availableBooks.slice(0, numBooksToBorrow)
      
      // Create borrow records with different dates
      for (let i = 0; i < studentBooks.length; i++) {
        const book = studentBooks[i]
        
        // Skip if no copies available
        if (book.availableCopies <= 0) continue
        
        // Random borrow date between 1-30 days ago
        const daysAgo = Math.floor(Math.random() * 29) + 1
        const borrowDate = new Date()
        borrowDate.setDate(borrowDate.getDate() - daysAgo)
        
        // Due date is 14 days after borrow date
        const dueDate = new Date(borrowDate)
        dueDate.setDate(dueDate.getDate() + 14)
        
        // Determine status based on due date
        const today = new Date()
        let status = "borrowed"
        let fine = 0
        
        if (dueDate < today) {
          status = "overdue"
          // Calculate fine ($0.50 per day)
          const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24))
          fine = daysOverdue * 0.5
        }
        
        // Create borrow record
        const borrowRecord = new BorrowRecord({
          userId: student._id,
          bookId: book._id,
          borrowDate,
          dueDate,
          status,
          fine
        })
        
        await borrowRecord.save()
        borrowRecords.push(borrowRecord)
        
        // Update book availability
        book.availableCopies -= 1
        await book.save()
      }
    }
    
    console.log(`Created ${borrowRecords.length} borrow records`)
    
    // Print out some of the records
    console.log("\nSample borrow records:")
    for (let i = 0; i < Math.min(5, borrowRecords.length); i++) {
      const record = borrowRecords[i]
      const student = await User.findById(record.userId)
      const book = await Book.findById(record.bookId)
      console.log(`${student.name} borrowed "${book.title}" on ${record.borrowDate.toLocaleDateString()}, due ${record.dueDate.toLocaleDateString()}, status: ${record.status}`)
    }
    
    console.log("\nBorrow records created successfully!")
    
  } catch (error) {
    console.error("Error creating borrow records:", error)
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect()
    console.log("MongoDB connection closed")
    process.exit(0)
  }
}

// Run the function
createTestBorrows()
