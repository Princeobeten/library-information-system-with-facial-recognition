import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, matricNo, password, role = "student" } = await request.json()

    // Validate required fields
    if (!name || !matricNo || !password) {
      return NextResponse.json(
        { error: "Name, matriculation number, and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ matricNo })
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this matriculation number already exists" },
        { status: 409 }
      )
    }

    // Create new user
    // In a real implementation, we would hash the password here
    const user = new User({
      name,
      matricNo,
      password, // Note: In production, this should be hashed
      role,
    })

    await user.save()

    // Don't return password in response
    const userResponse = {
      _id: user._id,
      name: user.name,
      matricNo: user.matricNo,
      role: user.role,
    }

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
