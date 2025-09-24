import mongoose, { Schema, models } from "mongoose"

const UserSchema = new Schema({
  name: { type: String, required: true },
  matricNo: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], required: true },
  faceId: String, // placeholder for facial recognition embedding
  createdAt: { type: Date, default: Date.now },
})

export default models.User || mongoose.model("User", UserSchema)
