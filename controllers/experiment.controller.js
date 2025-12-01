import Experiment from "../models/experiment.model.js";

// GET ALLL
export const getExperiments = async (req, res) => {
  try {
    const userId = req.user._id;
    const experiments = await Experiment.find()
      .populate("createdBy", "firstname lastname email");

    res.status(200).json(experiments);
  } catch (error) {
    res.status(500).json({ message: "Failed to load experiments", error: error.message });
  }
};

// GET Exp for Admin
export const getExperimentsAdmin = async (req, res) => {
  try {
    const userId = req.user._id;
    const experiments = await Experiment.find({ createdBy: userId })
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

// GET All runs (titration | distillation | saltanalysis) by expId.
export const getAllExpById = async (req, res) => {
  try {
    const { experimentId } = req.params;

    // 1. Find the experiment to check its type
    const experiment = await Experiment.findById(experimentId);
    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    let runs = [];

    // 2. Fetch runs from the correct collection based on type
    if (experiment.type === 'titration') {
      runs = await TitrationRun.find({ experimentId })
        .populate("userId", "firstname lastname email")
        .populate("experimentId", "title");
    } else if (experiment.type === 'distillation') {
      runs = await DistillationRun.find({ experimentId })
        .populate("userId", "firstname lastname email")
        .populate("experimentId", "title");
    } else if (experiment.type === 'salt-analysis') {
      runs = await SaltAnalysisRun.find({ experimentId })
        .populate("userId", "firstname lastname email")
        .populate("experimentId", "title");
    }

    res.status(200).json(runs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch insights", error: err.message });
  }
}


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
    const userId = req.user._id
    const deleted = await Experiment.findOneAndDelete({ _id: req.params.id, createdBy: userId });

    if (!deleted)
      return res.status(404).json({ message: "Experiment not found" });

    res.status(200).json({ message: "Experiment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete experiment", error: error.message });
  }
};