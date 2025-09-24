import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

// Get all users
export async function GET() {
  try {
    await connectDB()
    
    // Exclude password field from the response for security
    const users = await User.find({}).select("-password").sort({ createdAt: -1 })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userData = await request.json()
    
    // Check if user with this matricNo already exists
    const existingUser = await User.findOne({ matricNo: userData.matricNo })
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this matriculation number already exists" }, 
        { status: 409 }
      )
    }
    
    const user = new User(userData)
    const savedUser = await user.save()
    
    // Don't return password in the response
    const returnUser = savedUser.toObject()
    delete returnUser.password
    
    return NextResponse.json(returnUser, { status: 201 })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
