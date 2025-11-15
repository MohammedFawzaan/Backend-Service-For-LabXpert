import { Router } from "express";
import { sample, getData, addData } from "../controllers/sample.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/', sample);

router.get('/getData', authMiddleware, getData);

router.post('/addData', authMiddleware, addData);

export default router;