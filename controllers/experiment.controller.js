import Experiment from "../models/experiment.model.js";

// GET ALL
export const getExperiments = async (req, res) => {
  try {
    const experiments = await Experiment.find()
      .populate("createdBy", "firstname lastname email");

    res.status(200).json(experiments);
  } catch (error) {
    res.status(500).json({ message: "Failed to load experiments", error: error.message });
  }
};


// GET ONE
export const getExperimentById = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id)
      .populate("createdBy", "firstname lastname email");

    if (!experiment)
      return res.status(404).json({ message: "Experiment not found" });

    res.status(200).json(experiment);
  } catch (error) {
    res.status(500).json({ message: "Failed to load experiment", error: error.message });
  }
};


// CREATE
export const createExperiment = async (req, res) => {
  try {
    const experiment = new Experiment({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      type: req.body.type,
      videoUrl: req.body.videoUrl || null,
      createdBy: req.user._id
    });

    const saved = await experiment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Failed to create experiment", error: error.message });
  }
};


// DELETE
export const deleteExperiment = async (req, res) => {
  try {
    const deleted = await Experiment.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Experiment not found" });

    res.status(200).json({ message: "Experiment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete experiment", error: error.message });
  }
};