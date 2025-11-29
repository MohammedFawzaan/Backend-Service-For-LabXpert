import express from "express";
import {
  startDistillationRun,
  addObservation,
  finalizeRun,
  deleteRun,
  getRuns,
  getRunById
} from "../controllers/distillation.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected — authenticated users only
router.use(authMiddleware);

// student or admin can view runs
router.get("/", getRuns);

router.get("/:id", getRunById);

// start a new run (student)
router.post("/", startDistillationRun);

// add observation to run
router.post("/:id/observations", addObservation);

// finalize run (mark complete)
router.post("/:id/finalize", finalizeRun);

// delete (owner or admin)
router.delete("/:id", deleteRun);

export default router;
