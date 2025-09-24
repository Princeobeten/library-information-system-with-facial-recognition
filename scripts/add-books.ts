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

// Recreate the Book model
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

const Book = models.Book || model("Book", BookSchema)

// Additional book data
const additionalBooks = [
  {
    title: "Machine Learning: A Probabilistic Perspective",
    author: "Kevin P. Murphy",
    isbn: "978-0262018029",
    category: "Data Science",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive introduction to machine learning that uses a statistical approach.",
    publishedYear: 2012
  },
  {
    title: "Deep Learning",
    author: "Ian Goodfellow",
    isbn: "978-0262035613",
    category: "Artificial Intelligence",
    totalCopies: 4,
    availableCopies: 4,
    description: "The definitive textbook on deep learning, covering theory and practice.",
    publishedYear: 2016
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "978-0201616224",
    category: "Software Engineering",
    totalCopies: 5,
    availableCopies: 5,
    description: "A guide to becoming a better programmer through practical advice.",
    publishedYear: 1999
  },
  {
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    isbn: "978-0132126953",
    category: "Computer Networks",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive introduction to computer networks and protocols.",
    publishedYear: 2010
  },
  {
    title: "Concrete Mathematics",
    author: "Ronald Graham",
    isbn: "978-0201558029",
    category: "Mathematics",
    totalCopies: 2,
    availableCopies: 2,
    description: "A foundation for computer science covering discrete mathematics.",
    publishedYear: 1994
  },
  {
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    isbn: "978-1118063330",
    category: "Operating Systems",
    totalCopies: 4,
    availableCopies: 4,
    description: "Known as the 'dinosaur book', this is a classic text on operating systems.",
    publishedYear: 2012
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    isbn: "978-0073523323",
    category: "Databases",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive introduction to database systems.",
    publishedYear: 2010
  },
  {
    title: "Software Engineering: A Practitioner's Approach",
    author: "Roger S. Pressman",
    isbn: "978-0078022128",
    category: "Software Engineering",
    totalCopies: 3,
    availableCopies: 3,
    description: "A comprehensive guide to software engineering practices.",
    publishedYear: 2014
  },
  {
    title: "Computer Organization and Design",
    author: "David A. Patterson",
    isbn: "978-0124077263",
    category: "Computer Architecture",
    totalCopies: 3,
    availableCopies: 3,
    description: "The hardware/software interface from a software perspective.",
    publishedYear: 2013
  },
  {
    title: "Introduction to the Theory of Computation",
    author: "Michael Sipser",
    isbn: "978-1133187790",
    category: "Theory of Computation",
    totalCopies: 2,
    availableCopies: 2,
    description: "A standard text in theoretical computer science.",
    publishedYear: 2012
  },
  {
    title: "Code: The Hidden Language of Computer Hardware and Software",
    author: "Charles Petzold",
    isbn: "978-0735611313",
    category: "Computer Science",
    totalCopies: 3,
    availableCopies: 3,
    description: "An accessible introduction to how computers work at the most fundamental level.",
    publishedYear: 2000
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    isbn: "978-0596517748",
    category: "Programming Languages",
    totalCopies: 4,
    availableCopies: 4,
    description: "A guide to the best parts of JavaScript, avoiding the bad parts.",
    publishedYear: 2008
  },
  {
    title: "Python Crash Course",
    author: "Eric Matthes",
    isbn: "978-1593279288",
    category: "Programming Languages",
    totalCopies: 5,
    availableCopies: 5,
    description: "A hands-on, project-based introduction to programming with Python.",
    publishedYear: 2019
  },
  {
    title: "The C Programming Language",
    author: "Brian W. Kernighan",
    isbn: "978-0131103627",
    category: "Programming Languages",
    totalCopies: 3,
    availableCopies: 3,
    description: "The definitive book on C programming, known as K&R.",
    publishedYear: 1988
  },
  {
    title: "Clean Architecture",
    author: "Robert C. Martin",
    isbn: "978-0134494166",
    category: "Software Architecture",
    totalCopies: 3,
    availableCopies: 3,
    description: "A guide to software structure and design.",
    publishedYear: 2017
  }
]

// Add books to the database
async function addBooks() {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log("Connected to MongoDB")

    // Get existing book ISBNs to avoid duplicates
    const existingBooks = await Book.find({}, 'isbn')
    const existingISBNs = new Set(existingBooks.map(book => book.isbn))
    
    // Filter out books that already exist
    const newBooks = additionalBooks.filter(book => !existingISBNs.has(book.isbn))
    
    if (newBooks.length === 0) {
      console.log("No new books to add - all books already exist in the database")
      return
    }
    
    // Add the new books
    const createdBooks = await Book.insertMany(newBooks)
    console.log(`${createdBooks.length} new books added to the database`)
    
    // List the added books
    console.log("\nAdded books:")
    createdBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.category})`)
    })

    console.log("\nBooks successfully added to the database!")
    
  } catch (error) {
    console.error("Error adding books:", error)
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect()
    console.log("MongoDB connection closed")
    process.exit(0)
  }
}

// Run the function
addBooks()
