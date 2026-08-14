import Examiner from "../models/examiner.model.js";
import Theory from "../models/theory.model.js";

const addTheoryExam = async (req, res) => {
  try {
    const { examiner, totalDays } = req.body;

    if (!examiner || !totalDays) {
      return res.status.json(400)({
        message: "Examiner and total days are required",
      });
    }

    const examinerData =
      await Examiner.findById(examiner).populate("designation");

    if (!examinerData) {
      return res.status(400).json({ message: "Invalid Examiner selected" });
    }

    const rate = examinerData.designation.rate;
    const daysNum = Number(totalDays);
    const totalRemuneration = rate * daysNum;

    const theoryExam = await Theory.create({
      examiner,
      designation: examinerData.designation._id,
      rate,
      totalDays: daysNum,
      totalRemuneration,
    });
    return res
      .status(201)
      .json({ message: "Data entered successfully", theoryExam });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getTheoryExam = async (req, res) => {
  try {
    const theoryExams = await Theory.find()
      .populate("examiner", "name")
      .populate("designation", "title");

    return res
      .status(200)
      .json({ message: "Fetched data successfully", theoryExams });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      error: error.message,
    });
  }
};
export { addTheoryExam, getTheoryExam };
