import { Router } from "express";
import { sample } from "../controllers/user.controllers.js";

const router = Router();

router.get('/', sample);

export default router;