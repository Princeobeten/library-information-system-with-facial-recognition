Got it ✅ — let’s reset and align the **README** with your actual project:

---

# 📚 Library Information System with Facial Recognition (Minimal Prototype)

A minimal web-based prototype for a **Library Information System** that uses **facial recognition** for student authentication at **UNICROSS**.

Built with **Next.js (App Router)**, **MongoDB**, and **Mongoose**. The system uses both **global React Context provider** for state management and **Next.js API routes** for database operations.

---

## 🚀 Features (MVP)

* **User Roles**: Admin (librarian), Student
* **Facial Recognition Authentication** (stub/mock for prototype, ready for real integration)
* **Library Resource Management**: add/view/edit/delete books
* **Borrowing System**: track borrowing and returns, with fine calculation
* **User Management**: for administrators to manage student accounts
* **Secure Student Login** (via face ID or fallback password)
* **Dashboard Analytics**: overview of library statistics

---

## 🛠️ Tech Stack

* **Next.js 14+ (App Router)**
* **React Context API** (Global State)
* **Next.js API Routes** (Server Endpoints)
* **MongoDB** (Database)
* **Mongoose** (ODM)
* **TailwindCSS** and **shadcn/ui** components for UI
* **TypeScript** for type safety

---

## 📂 Project Structure

```
project-root/
│── app/                   # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── dashboard/
│   │   ├── admin/        # Admin dashboard
│   │   └── student/      # Student dashboard
│   │
│   └── api/              # API Routes
│       ├── auth/         # Authentication endpoints
│       ├── books/        # Book management endpoints
│       ├── users/        # User management endpoints
│       ├── borrow/       # Borrowing system endpoints
│       └── stats/        # Statistics endpoint
│
│── context/               # Global Context provider
│   └── DBProvider.tsx
│
│── hooks/                 # Custom hooks
│   ├── useAuth.ts        # Authentication logic
│   ├── useBook.ts        # Book operations
│   └── use-toast.ts      # Toast notifications
│
│── models/                # Mongoose schemas
│   ├── User.ts           # User model
│   ├── Book.ts           # Book model
│   └── BorrowRecord.ts   # Borrowing records model
│
│── lib/                   # Utilities
│   ├── db.ts             # DB connection helper
│   └── utils.ts          # Utility functions
│
│── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── AddBookDialog.tsx  # Book creation dialog
│   ├── EditBookDialog.tsx # Book editing dialog
│   ├── BookManagement.tsx # Book CRUD interface
│   ├── UserManagement.tsx # User management interface
│   ├── AdminBorrowingHistory.tsx # Admin borrowing view
│   ├── BorrowingHistory.tsx # Student borrowing view
│   └── FaceRecognition.tsx # Facial recognition UI
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-org/library-system.git
cd library-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/library
NEXT_PUBLIC_APP_NAME=Library Facial Recognition System
```

### 4. Seed the Database

To populate the database with sample users and books, run:

```bash
npm run seed-db
```

This will create:
- An administrator account (ADMIN001/secure_admin_password123)
- Multiple student accounts (e.g., CS/2020/001/student_password123)
- Sample books across various categories
- Sample borrowing records

#### Adding More Books

To add additional books to the existing database without clearing data, run:

```bash
npm run add-books
```

This script will add 15 more specialized computer science and engineering books to the library catalog.

#### Creating Test Borrow Records

To create sample borrowing records for testing, run:

```bash
npm run create-borrows
```

This script will:
- Create 1-3 borrow records for each student in the system
- Set some records with random borrow dates (between 1-30 days ago)
- Automatically mark some books as overdue with calculated fines
- Update the book availability counts accordingly

### 5. MongoDB Connection Helper

`lib/db.ts`

```ts
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
};
```

---

## 🧩 Context and State Management

The application uses a combination of React Context for global state and API routes for data operations. The DBProvider serves as the central state container:

```tsx
// Simplified version of context/DBProvider.tsx
"use client";
import { createContext, useContext, useState } from "react";

const DBContext = createContext<DBContextType | null>(null);

export const DBProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  
  return (
    <DBContext.Provider value={{
      user,
      setUser,
      books,
      setBooks,
      borrowRecords,
      setBorrowRecords,
    }}>
      {children}
    </DBContext.Provider>
  );
};
```

---

## 🔄 API Routes

The application uses Next.js API routes to handle database operations. Here's an example of the books API:

```ts
// app/api/books/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";

export async function GET() {
  await connectDB();
  const books = await Book.find().sort({ createdAt: -1 });
  return NextResponse.json(books);
}

export async function POST(request) {
  await connectDB();
  const bookData = await request.json();
  const book = new Book(bookData);
  const savedBook = await book.save();
  return NextResponse.json(savedBook, { status: 201 });
}
```

---

## 🗂️ Database Models

The application uses Mongoose models to define the database schema:

```ts
// models/Book.ts
import mongoose, { Schema, models } from "mongoose";

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
});

export default models.Book || mongoose.model("Book", BookSchema);
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

App will be live at:
👉 `http://localhost:3000`

---

## ✅ Next Steps (Beyond Prototype)

* Integrate real **facial recognition module** (e.g., TensorFlow\.js, Face-API.js)
* Add **borrowing & returning workflows**
* Track overdue fines & payment integration
* Role-based dashboards (Admin / Student)
* Deploy on **Vercel + MongoDB Atlas**

---

Would you like me to also **include a stub/mock for the facial recognition part** in this README (so the prototype compiles even without the real face recognition model), or should I leave it as a placeholder?




Areas for Development
Complete Borrowing System - API endpoints exist but UI implementation may need completion
User Management - Admin interface for managing users is planned but may need implementation
Real Facial Recognition - Currently using a mock implementation
Edit Functionality - Book editing UI exists but may need completion