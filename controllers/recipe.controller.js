import recipeModel from '../models/recipe.model.js';

const getAllRecipes = async (req, res) => {
    try {
        let query = {};
        let sort = { _id: -1 }; // default descending sorting.
        let limit = 0;

        if(req.query.category) {
            query.category = req.query.category;
        }

        if(req.query.limit) {
            limit = parseInt(req.query.limit, 10) || 0;
        }

        const recipes = await recipeModel.find(query)
                                         .sort(sort)
                                         .limit(limit);

        res.status(200).json({ message: "Recipe Fetched", data: recipes });
    } catch (error) {
        console.log("Error in fetching all recipes", error);
        res.status(500).json({ message: "Error in fetching all recipes", error: error.message });
    }
}

const getUserCreatedRecipe = async (req, res) => {
    try {
        const recipes = await recipeModel.find({ userId: req.user._id }).sort({ _id: -1 });
        res.send(200).json({ message: "User Recipes Fetched", data: recipes });
    } catch (error) {
        console.log("Error in fetching all recipes", error);
        res.status(500).json({ message: "Error in fetching all recipes", error: error.message });
    }
}

const createNewRecipe = async (req, res) => {
    try {
        const { data: recipeData } = req.body;
        const user = req.user;
        const newRecipe = await recipeModel.create({
            ...recipeData,
            userId: user._id
        });
        res.status(201).json({ message: "Recipe created", data: newRecipe });
    } catch (error) {
        console.log("Error in saving to db", error);
        res.status(500).json({ message: "Error saving recipe", error: error.message });
    }
}

export { getAllRecipes, createNewRecipe, getUserCreatedRecipe };