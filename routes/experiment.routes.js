import express from "express";
import {
  getExperiments,
  getExperimentById,
  createExperiment,
  deleteExperiment
} from "../controllers/experiment.controller.js";
import TitrationRun from "../models/titration.model.js";
import DistillationRun from "../models/distillation.model.js";
import SaltAnalysisRun from "../models/saltanalysis.model.js";
import Experiment from "../models/experiment.model.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// GET all
router.get("/", authMiddleware, getExperiments);

router.get("/:experimentId/all", async (req, res) => {
  try {
    const { experimentId } = req.params;

    // 1. Find the experiment to check its type
    const experiment = await Experiment.findById(experimentId);
    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    let runs = [];

    // 2. Fetch runs from the correct collection based on type
    if (experiment.type === 'titration') {
      runs = await TitrationRun.find({ experimentId })
        .populate("userId", "firstname lastname email")
        .populate("experimentId", "title");
    } else if (experiment.type === 'distillation') {
      runs = await DistillationRun.find({ experimentId })
        .populate("userId", "firstname lastname email")
        .populate("experimentId", "title");
    } else if (experiment.type === 'salt-analysis') {
      runs = await SaltAnalysisRun.find({ experimentId })
        .populate("userId", "firstname lastname email")
        .populate("experimentId", "title");
    }

    res.status(200).json(runs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch insights", error: err.message });
  }
});

// GET one
router.get("/:id", authMiddleware, getExperimentById);

// CREATE (Admin only)
router.post("/", authMiddleware, roleMiddleware("admin"), createExperiment);

// DELETE (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteExperiment);

export default router;