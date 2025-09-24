"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { connectDB } from "@/lib/db"
import { Book, User, BorrowRecord } from "@/types"

interface DBContextType {
  connected: boolean
  user: User | null
  setUser: (user: User | null) => void
  books: Book[]
  setBooks: (books: Book[]) => void
  borrowRecords: BorrowRecord[]
  setBorrowRecords: (records: BorrowRecord[]) => void
}

const DBContext = createContext<DBContextType | null>(null)

export const DBProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([])

  useEffect(() => {
    connectDB()
      .then(() => setConnected(true))
      .catch((err) => console.error("DB connection failed:", err))
  }, [])

  const value = {
    connected,
    user,
    setUser,
    books,
    setBooks,
    borrowRecords,
    setBorrowRecords,
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}

export const useDB = () => {
  const context = useContext(DBContext)
  if (!context) {
    throw new Error("useDB must be used within a DBProvider")
  }
  return context
}
