import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { faceData } = await request.json()

    // In a real implementation, this would match the face data with stored face embeddings
    // For now, we'll simulate finding a user with stored faceId
    // This is a mock - in production, proper face recognition algorithms would be used
    
    // Try to find an admin user first for demo purposes
    let user = await User.findOne({ role: "admin" })
    
    if (!user) {
      // If no admin, try to find any user
      user = await User.findOne()
    }
    
    if (!user) {
      return NextResponse.json({ error: "No users found in the system" }, { status: 404 })
    }
    
    // In a real implementation, we'd store the face embedding
    // For now, just simulate a successful face recognition
    await User.findByIdAndUpdate(user._id, { faceId: faceData })

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(user)
  } catch (error) {
    console.error("Face login error:", error)
    return NextResponse.json({ error: "Face recognition failed" }, { status: 500 })
  }
}
