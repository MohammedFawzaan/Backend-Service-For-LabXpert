import DistillationRun from "../models/distillation.model.js";
import Experiment from "../models/experiment.model.js";

// ----------------------------------------------------------
// START DISTILLATION RUN
// ----------------------------------------------------------
export const startDistillation = async (req, res) => {
  try {
    const { experimentId } = req.body;

    const experiment = await Experiment.findById(experimentId);
    if (!experiment) return res.status(404).json({ message: "Experiment not found" });

    const run = await DistillationRun.create({
      userId: req.user._id,
      experimentId,
      experimentTitle: experiment.title,
      experimentType: "distillation",
      startedAt: new Date(),

      distillation: {
        initialMixture: {
          componentA: "Ethanol",
          componentB: "Water",
          bpA: 78,
          bpB: 100
        }
      }
    });

    res.status(201).json(run);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ----------------------------------------------------------
// UPDATE LIVE DISTILLATION DATA
// (Temperature, vapor type, collected volume, observations)
// ----------------------------------------------------------
export const updateDistillation = async (req, res) => {
  try {
    const { runId } = req.params;
    const { temperature, vapor, collectedA, collectedB, observation } = req.body;

    const run = await DistillationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });

    // Update temperature profile
    if (temperature !== undefined) {
      run.distillation.temperatureProfile.push({
        timestamp: new Date().toLocaleTimeString(),
        temperature
      });
    }

    // Active vapor
    if (vapor) {
      run.distillation.activeVapor = vapor;
    }

    // Collected volume
    if (collectedA !== undefined) {
      run.distillation.collectedVolumeA = collectedA;
    }
    if (collectedB !== undefined) {
      run.distillation.collectedVolumeB = collectedB;
    }

    run.distillation.totalCollected =
      (collectedA || run.distillation.collectedVolumeA) +
      (collectedB || run.distillation.collectedVolumeB);

    // Observations
    if (observation) {
      run.observations.push({
        time: new Date().toLocaleTimeString(),
        message: observation
      });
    }

    await run.save();

    res.status(200).json(run);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ----------------------------------------------------------
// COMPLETE DISTILLATION RUN
// ----------------------------------------------------------
export const completeDistillation = async (req, res) => {
  try {
    const { runId } = req.params;

    const run = await DistillationRun.findById(runId);
    if (!run) return res.status(404).json({ message: "Run not found" });

    run.isComplete = true;
    run.completedAt = new Date();

    // Stats
    run.stats.timeTaken =
      (run.completedAt - run.startedAt) / 1000;

    run.stats.totalObservations = run.observations.length;

    await run.save();

    res.status(200).json(run);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
