import express from "express";
import {
  startTitrationRun,
  addObservation,
  finalizeRun,
  deleteRun,
  getRuns,
  getRunById
} from "../controllers/titration.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected — authenticated users only
router.use(authMiddleware);

// student or admin can view runs
router.get("/", getRuns);

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
router.get("/status/:experimentId", async (req, res) => {
  try {
    const { experimentId } = req.params;
    const run = await TitrationRun.findOne({ userId: req.user._id, experimentId });

    res.status(200).json({ isCompleted: run ? run.isComplete : false, runId: run ? run._id : null });
  } catch (err) {
    res.status(500).json({ message: "Failed to check experiment status", error: err.message });
  }
});


export default router;
