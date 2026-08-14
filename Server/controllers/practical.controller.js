import Examiner from "../models/examiner.model.js";
import Practical from "../models/practical.model.js";

const addPractical = async (req, res) => {
  try {
    const {
      examiner,
      totalDays,
      date,
      subjectCode,
      personName,
      ta,
      da,
      honorarium,
    } = req.body;

    if (!examiner || !totalDays || !date || !subjectCode) {
      return res.status(400).json({
        message: "Examiner, total days, date, and subject code are required",
      });
    }

    const examinerData =
      await Examiner.findById(examiner).populate("designation");

    if (!examinerData) {
      return res.status(400).json({ message: "Invalid Examiner Selected" });
    }

    const rate = examinerData.designation.rate;

    // Convert everything to actual numbers first
    const daysNum = Number(totalDays);
    const taAmount = Number(ta) || 0;
    const daAmount = Number(da) || 0;
    const honorariumAmount = Number(honorarium) || 0;

    const total = rate * daysNum + taAmount + daAmount + honorariumAmount;

    const practical = await Practical.create({
      examiner,
      designation: examinerData.designation._id,
      rate,
      totalDays: daysNum,
      date,
      subjectCode,
      personName: personName || "",
      ta: taAmount,
      da: daAmount,
      honorarium: honorariumAmount,
      total,
    });
    return res.status(201).json({ message: "Data enterd successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Server Error", error: error.message });
  }
};
const getPractical = async (req, res) => {
  try {
    const practicalExams = await Practical.find()
      .populate("examiner", "name")
      .populate("designation", "title");

    return res
      .status(200)
      .json({ message: "Fetched data succesfully", practicalExams });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Server Error", error: error.message });
  }
};

export { addPractical, getPractical };
