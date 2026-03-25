import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roleLabel: { type: String, trim: true },
    certificateUrl: { type: String, trim: true },
    issuedAt: { type: Date },
    downloadedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

certificateSchema.index({ event: 1, student: 1 }, { unique: true });

export default mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
