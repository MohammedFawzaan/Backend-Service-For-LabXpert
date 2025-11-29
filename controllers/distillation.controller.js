import DistillationRun from "../models/distillation.model.js";
import Experiment from "../models/experiment.model.js";
import mongoose from "mongoose";

/**
 * Start a new distillation run
 * POST /api/distillation
 * body: { experimentId }
 */
export const startDistillationRun = async (req, res) => {
  try {
    const { experimentId } = req.body;
    if (!experimentId) return res.status(400).json({ message: "experimentId required" });

    // Validate experiment exists and is of type distillation
    const experiment = await Experiment.findById(experimentId);
    if (!experiment) return res.status(404).json({ message: "Experiment not found" });

    const run = new DistillationRun({
      userId: req.user._id,
      experimentId,
      experimentTitle: experiment.title,
      experimentType: "distillation",
      startedAt: new Date(),
      observations: [],
      distillation: {
        initialMixture: {
          componentA: "Ethanol",
          componentB: "Water",
          bpA: 78,
          bpB: 100
        },
        temperatureProfile: [],
        collectedVolumeA: 0,
        collectedVolumeB: 0,
        totalCollected: 0
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
 * POST /api/distillation/:id/observations
 * body: { message, temperature, vaporRate, collectedVolume }
 */
export const addObservation = async (req, res) => {
  try {
    const runId = req.params.id;
    const { message, temperature, vaporRate, collectedVolume } = req.body;

    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await DistillationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });
    if (String(run.userId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    const obs = {
      message: message || "",
      time: new Date().toLocaleTimeString(),
    };

    run.observations.push(obs);

    // Update distillation specific fields
    if (typeof temperature === 'number') {
      run.distillation.temperatureProfile.push({
        timestamp: new Date().toISOString(),
        temperature
      });
    }

    if (typeof collectedVolume === 'number') {
      run.distillation.totalCollected = collectedVolume;
    }

    run.stats.totalObservations = run.observations.length;
    await run.save();

    res.status(201).json(run);
  } catch (err) {
    res.status(500).json({ message: "Failed to add observation", error: err.message });
  }
};


/**
 * Finalize run (called when experiment completes)
 * POST /api/distillation/:id/finalize
 * body: { finalTemperature, totalCollected }
 */
export const finalizeRun = async (req, res) => {
  try {
    const runId = req.params.id;
    const { finalTemperature, totalCollected } = req.body;

    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await DistillationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });
    if (String(run.userId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    run.distillation.totalCollected = typeof totalCollected === "number" ? totalCollected : run.distillation.totalCollected;
    run.isComplete = true;
    run.completedAt = new Date();

    // compute simple stats
    run.stats.timeTaken = Math.round((run.completedAt.getTime() - run.startedAt.getTime()) / 1000);
    run.stats.totalObservations = run.observations.length;

    await run.save();
    res.status(200).json(run);
  } catch (err) {
    res.status(500).json({ message: "Failed to finalize run", error: err.message });
  }
};


/**
 * Delete run
 * DELETE /api/distillation/:id
 */
export const deleteRun = async (req, res) => {
  try {
    const runId = req.params.id;
    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await DistillationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });
    // allow only owner or admin to delete
    if (String(run.userId) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await DistillationRun.findByIdAndDelete(runId);
    res.status(200).json({ message: "Run deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete run", error: err.message });
  }
};


/**
 * Get runs for current user (student) or all runs if admin
 * GET /api/distillation
 */
export const getRuns = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const runs = await DistillationRun.find().populate("userId", "firstname lastname email").populate("experimentId", "title");
      return res.status(200).json(runs);
    }
    const runs = await DistillationRun.find({ userId: req.user._id }).populate("experimentId", "title");
    res.status(200).json(runs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load runs", error: err.message });
  }
};


/**
 * GET single run (owner or admin)
 * GET /api/distillation/:id
 */
export const getRunById = async (req, res) => {
  try {
    const runId = req.params.id;
    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await DistillationRun.findById(runId)
      .populate("userId", "firstname lastname email");

    if (!run) return res.status(404).json({ message: "Run not found" });

    // allow only owner or admin to view
    const runUserId = run.userId._id ? String(run.userId._id) : String(run.userId);
    if (runUserId !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(run);
  } catch (err) {
    res.status(500).json({ message: "Failed to load run", error: err.message });
  }
};