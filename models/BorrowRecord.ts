import mongoose, { Schema, models } from "mongoose"

const BorrowRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: Date,
  status: { type: String, enum: ["borrowed", "returned", "overdue"], default: "borrowed" },
  fine: { type: Number, default: 0 },
})

export default models.BorrowRecord || mongoose.model("BorrowRecord", BorrowRecordSchema)
