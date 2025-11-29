import SaltAnalysisRun from "../models/saltanalysis.model.js";
import Experiment from "../models/experiment.model.js";
import mongoose from "mongoose";

/**
 * Start a new salt analysis run
 * POST /api/saltanalysis
 * body: { experimentId }
 */
export const startSaltAnalysisRun = async (req, res) => {
    try {
        const { experimentId } = req.body;
        if (!experimentId) return res.status(400).json({ message: "experimentId required" });

        const experiment = await Experiment.findById(experimentId);
        if (!experiment) return res.status(404).json({ message: "Experiment not found" });

        const run = new SaltAnalysisRun({
            userId: req.user._id,
            experimentId,
            experimentTitle: experiment.title,
            experimentType: "salt-analysis",
            startedAt: new Date(),
            observations: [],
            saltAnalysis: {
                preliminaryTests: [],
                confirmatoryTests: [],
                detectedCation: null,
                detectedAnion: null,
                finalResult: null
            }
        });

        await run.save();
        res.status(201).json(run);
    } catch (err) {
        res.status(500).json({ message: "Failed to start run", error: err.message });
    }
};

/**
 * Add an observation
 * POST /api/saltanalysis/:id/observations
 * body: { message, testType, testName, result, reagent, observation }
 */
export const addObservation = async (req, res) => {
    try {
        const runId = req.params.id;
        const { message, testType, testName, result, reagent, observation } = req.body;

        if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

        const run = await SaltAnalysisRun.findById(runId);
        if (!run) return res.status(404).json({ message: "Run not found" });
        if (String(run.userId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

        const obs = {
            message: message || "",
            time: new Date().toLocaleTimeString(),
        };

        run.observations.push(obs);

        // Add to specific test arrays based on type
        if (testType === 'preliminary' && testName && result) {
            run.saltAnalysis.preliminaryTests.push({
                testName,
                result,
                timestamp: new Date().toISOString()
            });
        } else if (testType === 'confirmatory' && testName) {
            run.saltAnalysis.confirmatoryTests.push({
                testName,
                reagent: reagent || "",
                observation: observation || "",
                timestamp: new Date().toISOString()
            });
        }

        run.stats.totalObservations = run.observations.length;
        run.stats.totalTests = run.saltAnalysis.preliminaryTests.length + run.saltAnalysis.confirmatoryTests.length;

        await run.save();
        res.status(201).json(run);
    } catch (err) {
        res.status(500).json({ message: "Failed to add observation", error: err.message });
    }
};

/**
 * Finalize run
 * POST /api/saltanalysis/:id/finalize
 * body: { detectedCation, detectedAnion, finalResult }
 */
export const finalizeRun = async (req, res) => {
    try {
        const runId = req.params.id;
        const { detectedCation, detectedAnion, finalResult } = req.body;

        if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

        const run = await SaltAnalysisRun.findById(runId);
        if (!run) return res.status(404).json({ message: "Run not found" });
        if (String(run.userId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

        run.saltAnalysis.detectedCation = detectedCation || run.saltAnalysis.detectedCation;
        run.saltAnalysis.detectedAnion = detectedAnion || run.saltAnalysis.detectedAnion;
        run.saltAnalysis.finalResult = finalResult || run.saltAnalysis.finalResult;

        run.isComplete = true;
        run.completedAt = new Date();

        // Compute stats
        run.stats.timeTaken = Math.round((run.completedAt.getTime() - run.startedAt.getTime()) / 1000);
        run.stats.totalObservations = run.observations.length;
        run.stats.totalTests = run.saltAnalysis.preliminaryTests.length + run.saltAnalysis.confirmatoryTests.length;

        await run.save();
        res.status(200).json(run);
    } catch (err) {
        res.status(500).json({ message: "Failed to finalize run", error: err.message });
    }
};

/**
 * Delete run
 * DELETE /api/saltanalysis/:id
 */
export const deleteRun = async (req, res) => {
    try {
        const runId = req.params.id;
        if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

        const run = await SaltAnalysisRun.findById(runId);
        if (!run) return res.status(404).json({ message: "Run not found" });

        if (String(run.userId) !== String(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        await SaltAnalysisRun.findByIdAndDelete(runId);
        res.status(200).json({ message: "Run deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete run", error: err.message });
    }
};

/**
 * Get runs for current user or all runs if admin
 * GET /api/saltanalysis
 */
export const getRuns = async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const runs = await SaltAnalysisRun.find()
                .populate("userId", "firstname lastname email")
                .populate("experimentId", "title");
            return res.status(200).json(runs);
        }
        const runs = await SaltAnalysisRun.find({ userId: req.user._id })
            .populate("experimentId", "title");
        res.status(200).json(runs);
    } catch (err) {
        res.status(500).json({ message: "Failed to load runs", error: err.message });
    }
};

/**
 * GET single run (owner or admin)
 * GET /api/saltanalysis/:id
 */
export const getRunById = async (req, res) => {
    try {
        const runId = req.params.id;
        if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

        const run = await SaltAnalysisRun.findById(runId)
            .populate("userId", "firstname lastname email");

        if (!run) return res.status(404).json({ message: "Run not found" });

        const runUserId = run.userId._id ? String(run.userId._id) : String(run.userId);
        if (runUserId !== String(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.status(200).json(run);
    } catch (err) {
        res.status(500).json({ message: "Failed to load run", error: err.message });
    }
};
