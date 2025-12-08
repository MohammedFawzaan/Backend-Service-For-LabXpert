import TitrationRun from "../models/titration.model.js";
import Experiment from "../models/experiment.model.js";
import mongoose from "mongoose";

/**
 * Start a new titration run
 * POST /api/titration-runs
 * body: { experimentId }
 */
export const startTitrationRun = async (req, res) => {
  try {
    const { experimentId } = req.body;
    if (!experimentId) return res.status(400).json({ message: "experimentId required" });

    // Validate experiment exists and is of type titration
    const experiment = await Experiment.findById(experimentId);
    if (!experiment) return res.status(404).json({ message: "Experiment not found" });
    if (experiment.type !== "titration") {
      return res.status(400).json({ message: "Experiment type mismatch — expected titration" });
    }

    const run = new TitrationRun({
      userId: req.user._id,
      experimentId,
      experimentTitle: experiment.title,
      experimentType: "titration",
      startedAt: new Date(),
    });

    await run.save();
    res.status(201).json(run);
  } catch (err) {
    res.status(500).json({ message: "Failed to start run", error: err.message });
  }
};


/**
 * Add an observation
 * POST /api/titration-runs/:id/observations
 * body: { message, volume, pH, color }
 */
export const addObservation = async (req, res) => {
  try {
    const runId = req.params.id;
    const { message, volume, pH, color } = req.body;

    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await TitrationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });
    if (String(run.userId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    const obs = {
      message: message || "",
      volume: typeof volume === "number" ? volume : undefined,
      pH: typeof pH === "number" ? pH : undefined,
      color: color || undefined,
      time: new Date(),
    };

    run.observations.push(obs);
    run.stats.totalObservations = run.observations.length;
    await run.save();

    res.status(201).json(run);
  } catch (err) {
    res.status(500).json({ message: "Failed to add observation", error: err.message });
  }
};


/**
 * Finalize run (called when experiment completes)
 * POST /api/titration-runs/:id/finalize
 * body: { finalVolume, finalPH, finalColor }
 */
export const finalizeRun = async (req, res) => {
  try {
    const runId = req.params.id;
    const { finalVolume, finalPH, finalColor } = req.body;

    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await TitrationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });
    if (String(run.userId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    run.finalVolume = typeof finalVolume === "number" ? finalVolume : run.finalVolume;
    run.finalPH = typeof finalPH === "number" ? finalPH : run.finalPH;
    run.finalColor = finalColor || run.finalColor;
    run.isComplete = true;
    run.completedAt = new Date();

    // compute simple stats: timeTaken and endpointVolume and pH change rate
    run.stats.timeTakenSeconds = Math.round((run.completedAt.getTime() - run.startedAt.getTime()) / 1000);
    run.stats.endpointVolume = run.finalVolume || (run.observations.length ? run.observations[run.observations.length - 1].volume : null);
    run.stats.totalObservations = run.observations.length;

    // compute pH change rate if we have two measurements
    if (run.observations.length >= 2) {
      const first = run.observations[0];
      const last = run.observations[run.observations.length - 1];
      if (typeof first.pH === "number" && typeof last.pH === "number" && typeof first.volume === "number" && typeof last.volume === "number") {
        run.stats.phChangeRate = (last.pH - first.pH) / (last.volume - first.volume || 1);
      }
    }

    await run.save();
    res.status(200).json(run);
  } catch (err) {
    res.status(500).json({ message: "Failed to finalize run", error: err.message });
  }
};


/**
 * Delete run
 * DELETE /api/titration-runs/:id
 */
export const deleteRun = async (req, res) => {
  try {
    const runId = req.params.id;
    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await TitrationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });
    // allow only owner or admin to delete
    if (String(run.userId) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await TitrationRun.findByIdAndDelete(runId);
    res.status(200).json({ message: "Run deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete run", error: err.message });
  }
};


/**
 * Get runs for current user (student) or all runs if admin
 * GET /api/titration-runs
 */
export const getRuns = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const runs = await TitrationRun.find().populate("userId", "firstname lastname email").populate("experimentId", "title");
      return res.status(200).json(runs);
    }
    const runs = await TitrationRun.find({ userId: req.user._id }).populate("experimentId", "title");
    res.status(200).json(runs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load runs", error: err.message });
  }
};


/**
 * GET single run (owner or admin)
 * GET /api/titration-runs/:id
 */
export const getRunById = async (req, res) => {
  try {
    const runId = req.params.id;
    if (!mongoose.isValidObjectId(runId)) return res.status(400).json({ message: "Invalid run id" });

    const run = await TitrationRun.findById(runId)
      .populate("userId", "firstname lastname email")
      .populate("experimentId", "title");

    console.log(run);

    if (!run) return res.status(404).json({ message: "Run not found" });

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (String(run.userId._id) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(run);
  } catch (err) {
    console.error("Get run error:", err); // log full error
    res.status(500).json({ message: "Failed to load run", error: err.message });
  }
};

export const checkIfUserCompletedExperiment = async (req, res) => {
  try {
    const { experimentId } = req.params;
    const run = await TitrationRun.findOne({ userId: req.user._id, experimentId });

    res.status(200).json({ isCompleted: run ? run.isComplete : false, runId: run ? run._id : null });
  } catch (err) {
    res.status(500).json({ message: "Failed to check experiment status", error: err.message });
  }
}