import express from "express";
import {
  getExperiments,
  getExperimentById,
  createExperiment,
  deleteExperiment
} from "../controllers/experiment.controller.js";
import TitrationRun from "../models/titration.model.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// GET all
router.get("/", authMiddleware, getExperiments);

router.get("/:experimentId/all", async (req, res) => {
  try {
    const { experimentId } = req.params;

    const runs = await TitrationRun.find({ experimentId })
      .populate("userId", "firstname lastname email")
      .populate("experimentId", "title");

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