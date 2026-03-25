import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participate: { type: Boolean, default: false },
    volunteer: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

registrationSchema.index({ event: 1, student: 1 }, { unique: true });

export default mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
