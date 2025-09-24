export interface Book {
  _id: string
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  availableCopies: number
  description?: string
  publishedYear?: number
  createdAt?: string
}

export interface User {
  _id: string
  name: string
  matricNo: string
  role: 'admin' | 'student'
  faceId?: string
  createdAt?: string
}

export interface BorrowRecord {
  _id: string
  userId: string | User
  bookId: string | Book
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: 'borrowed' | 'returned' | 'overdue'
  fine: number
  createdAt?: string
}
