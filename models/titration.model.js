import mongoose from "mongoose";

const ObservationSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  message: { type: String },
  volume: { type: Number },
  pH: { type: Number },
  color: { type: String },
}, { _id: false });

const TitrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experimentId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
  experimentTitle: { type: String },
  experimentType: { type: String, default: "titration" },

  observations: [ObservationSchema],

  // final measurements
  finalVolume: { type: Number, default: 0 },
  finalPH: { type: Number, default: 0 },
  finalColor: { type: String, default: "" },

  // run metadata
  isComplete: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },

  // computed stats
  stats: {
    totalObservations: { type: Number, default: 0 },
    timeTakenSeconds: { type: Number, default: 0 },
    endpointVolume: { type: Number, default: null },
    phChangeRate: { type: Number, default: null }, // ΔpH / Δvolume
  },
}, { timestamps: true });

export default mongoose.model("Titration", TitrationSchema);