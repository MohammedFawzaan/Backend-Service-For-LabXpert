import { Router } from "express";
import { getAllRecipes, createNewRecipe, getUserCreatedRecipe } from "../controllers/recipe.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/recipes', authMiddleware, getAllRecipes);

router.get('/recipes/user', authMiddleware, getUserCreatedRecipe);

router.post('/recipes', authMiddleware, createNewRecipe);

export default router;