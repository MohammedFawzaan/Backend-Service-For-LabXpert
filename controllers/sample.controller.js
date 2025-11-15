import sampleModel from "../models/sample.model.js";

const sample = (req, res) => {
    res.status(200).json({ message: "hello there !" });
}

const getData = async (req, res) => {
    const getAllData = await sampleModel.find({ user: req.user._id });
    res.status(200).json({ getAllData: getAllData });
}

const addData = async (req, res) => {
    const { text }= req.body;
    const newData = await sampleModel.create({
        user: req.user._id,
        text: text
    });
    res.status(201).json({ message: "Created" });
}

export { sample, getData, addData }