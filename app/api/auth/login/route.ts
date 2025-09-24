import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { matricNo, password } = await request.json()

    // Find user in database
    // In production, passwords should be hashed and compared securely
    const user = await User.findOne({ matricNo, password })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
