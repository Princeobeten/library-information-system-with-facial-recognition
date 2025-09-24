"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { connectDB } from "@/lib/db"

interface DBContextType {
  connected: boolean
  user: any
  setUser: (user: any) => void
  books: any[]
  setBooks: (books: any[]) => void
  borrowRecords: any[]
  setBorrowRecords: (records: any[]) => void
}

const DBContext = createContext<DBContextType | null>(null)

export const DBProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false)
  const [user, setUser] = useState(null)
  const [books, setBooks] = useState([])
  const [borrowRecords, setBorrowRecords] = useState([])

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
