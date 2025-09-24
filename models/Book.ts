import mongoose, { Schema, models } from "mongoose"

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
})

export default models.Book || mongoose.model("Book", BookSchema)
