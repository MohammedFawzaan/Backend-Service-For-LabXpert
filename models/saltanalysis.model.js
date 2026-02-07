import mongoose from "mongoose";

const ObservationSchema = new mongoose.Schema({
    time: { type: Date, default: Date.now },
    message: { type: String },
}, { _id: false });

const SaltAnalysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    experimentId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
    experimentTitle: String,
    experimentType: {
        type: String,
        enum: ["titration", "distillation", "salt-analysis"],
        required: true,
        default: "salt-analysis"
    },

    observations: [ObservationSchema],

    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    isComplete: { type: Boolean, default: false },

    stats: {
        timeTaken: Number,
        totalObservations: Number,
        totalTests: Number,
    },

    // Salt Analysis specific fields
    results: {
        preliminaryTests: [
            {
                testName: String,        // e.g., "pH Test", "Flame Test"
                result: String,          // e.g., "Acidic", "Green Flame"
                timestamp: { type: Date, default: Date.now },
            }
        ],

        confirmatoryTests: [
            {
                testName: String,        // e.g., "Ferric Chloride Test", "Barium Chloride Test"
                reagent: String,         // Reagent used
                observation: String,     // e.g., "White precipitate formed"
                timestamp: { type: Date, default: Date.now },
            }
        ],

        detectedCation: String,      // e.g., "Fe³⁺", "Cu²⁺", "Zn²⁺", "Ca²⁺"
        detectedAnion: String,       // e.g., "Cl⁻", "SO₄²⁻", "NO₃⁻", "CO₃²⁻"
        finalResult: String,         // e.g., "FeCl₃ (Ferric Chloride)"
    }

}, { timestamps: true });

export default mongoose.model("SaltAnalysis", SaltAnalysisSchema);