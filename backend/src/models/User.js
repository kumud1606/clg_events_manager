import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    enrollment: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["student", "manager", "admin"],
      default: "student"
    },
    clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
