import express from "express";
import {
    startSaltAnalysisRun,
    addObservation,
    finalizeRun,
    deleteRun,
    getRuns,
    getRunById
} from "../controllers/saltanalysis.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all runs for user/admin
router.get("/", authMiddleware, getRuns);

// GET single run by ID
router.get("/:id", authMiddleware, getRunById);

// POST - Start new run
router.post("/", authMiddleware, startSaltAnalysisRun);

// POST - Add observation
router.post("/:id/observations", authMiddleware, addObservation);

// POST - Finalize run
router.post("/:id/finalize", authMiddleware, finalizeRun);

// DELETE - Delete run
router.delete("/:id", authMiddleware, deleteRun);

export default router;
