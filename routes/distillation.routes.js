import express from "express";
import {
  startDistillation,
  updateDistillation,
  completeDistillation
} from "../controllers/distillation.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/start", authMiddleware, startDistillation);
router.put("/:runId/update", authMiddleware, updateDistillation);
router.post("/:runId/complete", authMiddleware, completeDistillation);

export default router;
