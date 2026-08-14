import Designation from "../models/designation.model.js";
import Examiner from "../models/examiner.model.js";

// @desc   Add new examiner
// @route  POST /api/examiner/add
const addExaminer = async (req, res) => {
  try {
    const { name, designationTitle, rate } = req.body;

    if (!name || !designationTitle || !rate) {
      return res.status(400).json({
        message: "Name, designation, and rate are required",
      });
    }

    // Check if designation already exists (case-insensitive match)
    let designation = await Designation.findOne({
      title: { $regex: `^${designationTitle.trim()}$`, $options: "i" },
    });

    if (designation) {
      // Update existing designation's rate to the new value
      designation.rate = rate;
      await designation.save();
    } else {
      // Create new designation
      designation = await Designation.create({
        title: designationTitle.trim(),
        rate,
      });
    }

    const examiner = await Examiner.create({
      name,
      designation: designation._id,
    });

    // Populate designation before sending back
    await examiner.populate("designation");

    res.status(201).json({
      message: "Examiner added successfully",
      examiner,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all examiners (for dropdown)
// @route  GET /api/examiner/all
const getExaminer = async (req, res) => {
  try {
    const examiners = await Examiner.find().populate(
      "designation",
      "title rate",
    );

    res.status(200).json(examiners);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all designations (for dropdown)
// @route  GET /api/examiner/designations
const getDesignation = async (req, res) => {
  try {
    const designations = await Designation.find();

    return res.status(200).json(designations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc   Add a designation (rate master data)
// @route  POST /api/examiner/designation/add
const addDesignation = async (req, res) => {
  try {
    const { title, rate } = req.body;

    if (!title || !rate) {
      return res.status(400).json({ message: "Title and rate are required" });
    }

    const existing = await Designation.findOne({ title });

    if (existing) {
      return res.status(400).json({ message: "Designation already exists" });
    }

    const designation = await Designation.create({ title, rate });

    res.status(201).json({
      message: "Designation added successfully",
      designation,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export { addExaminer, getExaminer, getDesignation, addDesignation };
