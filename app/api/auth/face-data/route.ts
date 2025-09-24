import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { matricNo } = await request.json()

    if (!matricNo) {
      return NextResponse.json(
        { error: "Matriculation number is required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ matricNo })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user has facial recognition data
    const hasFaceData = !!user.faceId

    return NextResponse.json({
      hasFaceData,
      userId: user._id,
      name: user.name,
    })
  } catch (error) {
    console.error("Face data check error:", error)
    return NextResponse.json({ error: "Failed to check facial data" }, { status: 500 })
  }
}

// This endpoint allows for registering face data for a user
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const { userId, faceId } = await request.json()

    if (!userId || !faceId) {
      return NextResponse.json(
        { error: "User ID and face data are required" },
        { status: 400 }
      )
    }

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update user with face data
    user.faceId = faceId
    await user.save()

    return NextResponse.json({
      message: "Facial recognition data updated successfully",
      userId: user._id,
      name: user.name,
    })
  } catch (error) {
    console.error("Face data update error:", error)
    return NextResponse.json({ error: "Failed to update facial data" }, { status: 500 })
  }
}
