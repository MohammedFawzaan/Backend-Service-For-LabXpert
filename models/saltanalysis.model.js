import mongoose from "mongoose";

const SaltAnalysisRunSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    experimentId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
    experimentTitle: String,
    experimentType: {
        type: String,
        enum: ["titration", "distillation", "salt-analysis"],
        required: true
    },

    // Common fields
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
        timeTaken: Number,
        totalObservations: Number,
        totalTests: Number,
    },

    // Salt Analysis specific fields
    saltAnalysis: {
        preliminaryTests: [
            {
                testName: String,        // e.g., "pH Test", "Flame Test"
                result: String,          // e.g., "Acidic", "Green Flame"
                timestamp: String,
            }
        ],

        confirmatoryTests: [
            {
                testName: String,        // e.g., "Ferric Chloride Test", "Barium Chloride Test"
                reagent: String,         // Reagent used
                observation: String,     // e.g., "White precipitate formed"
                timestamp: String,
            }
        ],

        detectedCation: String,      // e.g., "Fe³⁺", "Cu²⁺", "Zn²⁺", "Ca²⁺"
        detectedAnion: String,       // e.g., "Cl⁻", "SO₄²⁻", "NO₃⁻", "CO₃²⁻"
        finalResult: String,         // e.g., "FeCl₃ (Ferric Chloride)"
    }

}, { timestamps: true });

export default mongoose.model("SaltAnalysisRun", SaltAnalysisRunSchema);
