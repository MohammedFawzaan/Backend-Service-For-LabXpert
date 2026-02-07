import mongoose from "mongoose";

const ObservationSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  message: { type: String },
}, { _id: false });

const DistillationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experimentId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
  experimentTitle: String,
  experimentType: {
    type: String,
    enum: ["titration", "distillation", "salt-analysis"],
    required: true,
    default: "distillation"
  },

  observations: [ObservationSchema],

  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  isComplete: { type: Boolean, default: false },

  stats: {
    deviation: Number,
    timeTaken: Number,
    totalObservations: Number,
  },

  // Distillation Specific Fields
  results: {
    initialMixture: {
      componentA: { type: String },   // Example: Ethanol
      componentB: { type: String },   // Example: Water
      bpA: Number,                    // Boiling point A
      bpB: Number,                    // Boiling point B
    },

    temperatureProfile: [
      {
        timestamp: { type: Date, default: Date.now },
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
}, { timestamps: true });

export default mongoose.model("Distillation", DistillationSchema);