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

// Sample book data
const books = [
  {
    title: "Introduction to Algorithm Design",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    totalCopies: 5,
    availableCopies: 5,
    description: "A comprehensive introduction to the design and analysis of algorithms.",
    publishedYear: 2009
  },
  {
    title: "Database Systems: The Complete Book",
    author: "Hector Garcia-Molina",
    isbn: "978-0131873254",
    category: "Computer Science",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive introduction to modern database systems.",
    publishedYear: 2008
  },
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Software Engineering",
    totalCopies: 4,
    availableCopies: 4,
    description: "A guide to writing clean, maintainable code.",
    publishedYear: 2008
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    isbn: "978-0201633610",
    category: "Software Engineering",
    totalCopies: 2,
    availableCopies: 2,
    description: "A classic book on software design patterns.",
    publishedYear: 1994
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    isbn: "978-0136042594",
    category: "Artificial Intelligence",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive introduction to artificial intelligence.",
    publishedYear: 2009
  },
  {
    title: "Discrete Mathematics and Its Applications",
    author: "Kenneth H. Rosen",
    isbn: "978-0073383095",
    category: "Mathematics",
    totalCopies: 5,
    availableCopies: 5,
    description: "A comprehensive introduction to discrete mathematics.",
    publishedYear: 2011
  },
  {
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "978-1285741550",
    category: "Mathematics",
    totalCopies: 6,
    availableCopies: 6,
    description: "A comprehensive introduction to calculus.",
    publishedYear: 2015
  },
  {
    title: "Physics for Scientists and Engineers",
    author: "Serway Jewett",
    isbn: "978-1337553292",
    category: "Physics",
    totalCopies: 4,
    availableCopies: 4,
    description: "A comprehensive introduction to physics for scientists and engineers.",
    publishedYear: 2018
  },
  {
    title: "Introduction to Chemical Engineering",
    author: "J.M. Smith",
    isbn: "978-0073104645",
    category: "Chemical Engineering",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive introduction to chemical engineering principles.",
    publishedYear: 2004
  },
  {
    title: "Introduction to Electrical Engineering",
    author: "Mulukutla S. Sarma",
    isbn: "978-0195136043",
    category: "Electrical Engineering",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive introduction to electrical engineering principles.",
    publishedYear: 2000
  }
]

// Sample user data
const users = [
  {
    name: "Admin User",
    matricNo: "ADMIN001",
    password: "secure_admin_password123",
    role: "admin"
  },
  {
    name: "John Doe",
    matricNo: "CS/2020/001",
    password: "student_password123",
    role: "student"
  },
  {
    name: "Jane Smith",
    matricNo: "CS/2020/002",
    password: "student_password123",
    role: "student"
  },
  {
    name: "Robert Johnson",
    matricNo: "CS/2021/003",
    password: "student_password123",
    role: "student"
  },
  {
    name: "Emily Davis",
    matricNo: "EE/2021/001",
    password: "student_password123",
    role: "student"
  },
  {
    name: "Michael Wilson",
    matricNo: "CE/2019/001",
    password: "student_password123",
    role: "student"
  },
  {
    name: "Sarah Brown",
    matricNo: "ME/2022/001",
    password: "student_password123",
    role: "student"
  },
  {
    name: "David Miller",
    matricNo: "CS/2020/004",
    password: "student_password123",
    role: "student"
  }
]

// Seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Book.deleteMany({})
    await BorrowRecord.deleteMany({})
    console.log("Cleared existing data")

    // Seed users
    const createdUsers = await User.insertMany(users)
    console.log(`${createdUsers.length} users created`)

    // Seed books
    const createdBooks = await Book.insertMany(books)
    console.log(`${createdBooks.length} books created`)

    // Create some borrow records to simulate activity
    // Get the first student and some books
    const student = createdUsers.find(user => user.role === "student")
    const booksToAssign = createdBooks.slice(0, 3)
    
    // Create borrow records and update book availability
    const borrowDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)  // 2 weeks loan period
    
    for (const book of booksToAssign) {
      // Create borrow record
      await BorrowRecord.create({
        userId: student?._id,
        bookId: book._id,
        borrowDate,
        dueDate,
        status: "borrowed"
      })
      
      // Update book availability
      await Book.findByIdAndUpdate(book._id, {
        $inc: { availableCopies: -1 }
      })
    }
    
    console.log("Created borrow records for testing")
    console.log("Database seeded successfully!")
    
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect()
    console.log("MongoDB connection closed")
    process.exit(0)
  }
}

// Run the seeder
seedDatabase()
