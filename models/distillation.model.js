import mongoose from "mongoose";

const DistillationRunSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  experimentId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
  experimentTitle: String,
  experimentType: { 
    type: String,
    enum: ["titration", "distillation", "salt-analysis"], 
    required: true 
  },

  // -----------------------
  // COMMON FIELDS FOR ALL EXPERIMENTS
  // -----------------------
  observations: [
    {
      time: String,
      message: String,
    }
  ],

  startedAt: Date,
  completedAt: Date,
  isComplete: { type: Boolean, default: false },

  stats: {
    deviation: Number,
    timeTaken: Number,
    totalObservations: Number,
  },

  // ======================================================
  //               🔥 TITRATION RESULT FIELDS (already done)
  // ======================================================

  finalVolume: Number,
  finalPH: Number,
  color: String,

  // ======================================================
  //      🔥 DISTILLATION — REALISTIC & PRACTICAL FIELDS
  // ======================================================
  distillation: {
    initialMixture: {
      componentA: { type: String },   // Example: Ethanol
      componentB: { type: String },   // Example: Water
      bpA: Number,                    // Boiling point A
      bpB: Number,                    // Boiling point B
    },

    temperatureProfile: [
      {
        timestamp: String,
        temperature: Number
      }
    ],

    activeVapor: {
      type: String,
      enum: ["none", "A", "B"],
      default: "none"
    },

    collectedVolumeA: { type: Number, default: 0 }, // mL of low-boiling distillate
    collectedVolumeB: { type: Number, default: 0 }, // mL of high-boiling distillate
    totalCollected: Number,

    fractionBreakPoint: Number, // actual transition temperature when mixture shifts A → B
  },

  // ======================================================
  // 🔥 SALT ANALYSIS (Placeholder)
  // ======================================================
  saltAnalysis: {
    confirmatoryTests: [String],
    cation: String,
    anion: String,
    finalResult: String,
  }

}, { timestamps: true });

export default mongoose.model("DistillationRun", DistillationRunSchema);
