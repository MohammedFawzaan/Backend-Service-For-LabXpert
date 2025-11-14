import mongoose, { model, Types } from "mongoose";

const sampleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const sampleModel = mongoose.model('sampleModel', sampleSchema);

export default sampleModel;