import mongoose from "mongoose";

const experimentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  description: { type: String },

  type: {
    type: String,
    enum: ["titration", "distillation", "salt-analysis"],
    required: true,
  },

  videoUrl: { type: String },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Experiment", experimentSchema);