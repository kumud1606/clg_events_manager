import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortName: { type: String, trim: true },
    description: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    color: { type: String, trim: true },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Club || mongoose.model("Club", clubSchema);
