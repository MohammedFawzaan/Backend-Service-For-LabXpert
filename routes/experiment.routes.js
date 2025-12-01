import express from "express";
import {
  getExperiments,
  getExperimentsAdmin,
  getExperimentById,
  getAllExpById,
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

// GET all exp for admin
router.get("/admin", authMiddleware, getExperimentsAdmin);

// GET all runs (titration | distillation | saltanalysis) by expId.
router.get("/:experimentId/all", getAllExpById);

// GET one
router.get("/:id", authMiddleware, getExperimentById);

// CREATE (Admin only)
router.post("/", authMiddleware, roleMiddleware("admin"), createExperiment);

// DELETE (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteExperiment);

export default router;