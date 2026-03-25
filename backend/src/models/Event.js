import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    title: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
    venue: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image"
    },
    imageUrl: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
    posterUrl: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    registrationOpen: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
