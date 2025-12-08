import express from "express";
import {
  startTitrationRun,
  addObservation,
  finalizeRun,
  deleteRun,
  getRuns,
  getRunById,
  checkIfUserCompletedExperiment
} from "../controllers/titration.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected — authenticated users only
router.use(authMiddleware);

// student or admin can view runs
router.get("/", getRuns);

// get one the titration experiment
router.get("/:id", getRunById);

// start a new run (student)
router.post("/", startTitrationRun);

// add observation to run
router.post("/:id/observations", addObservation);

// finalize run (mark complete)
router.post("/:id/finalize", finalizeRun);

// delete (owner or admin)
router.delete("/:id", deleteRun);

// Check if a user completed a specific experiment
router.get("/status/:experimentId", checkIfUserCompletedExperiment);

export default router;