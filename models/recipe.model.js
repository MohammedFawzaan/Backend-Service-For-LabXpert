import mongoose from "mongoose";

const schema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true,
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    steps: {
        type: [String],
    },
    ingredients: {
        type: [{
            icon: {
                type: String,
            },
            quantity: {
                type: String,
            },
            ingredient: {
                type: String,
            }
        }]
    },
    calories: {
        type: Number
    },
    cookTime: {
        type: Number
    },
    serveTo: {
        type: Number
    },
    imagePrompt: {
        type: String
    },
    recipeImage: {
        type: String
    }
});

const recipeModel = mongoose.model('recipeModel', schema);

export default recipeModel;