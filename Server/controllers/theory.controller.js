import Examiner from "../models/examiner.model.js";
import Theory from "../models/theory.model.js";
import { generateExcel, generatePDF } from "../utils/export.util.js";

const addTheoryExam = async (req, res) => {
  try {
    const { examiner, totalDays, department, semester } = req.body;

    if (!examiner || !totalDays || !department || !semester) {
      return res.status(400).json({
        message: "Examiner, total days, department, and semester are required",
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
      department,
      semester: Number(semester),
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

const exportTheoryExcel = async (req, res) => {
  try {
    const theoryExams = await Theory.find()
      .populate("examiner", "name")
      .populate("designation", "title");

    const columns = [
      { header: "Examiner Name", key: "examinerName", width: 25 },
      { header: "Designation", key: "designationTitle", width: 20 },
      { header: "Rate", key: "rate", width: 12 },
      { header: "Total Days", key: "totalDays", width: 12 },
      { header: "Total Remuneration", key: "totalRemuneration", width: 18 },
    ];

    const rows = theoryExams.map((item) => ({
      examinerName: item.examiner?.name || "N/A",
      designationTitle: item.designation?.title || "N/A",
      rate: item.rate,
      totalDays: item.totalDays,
      totalRemuneration: item.totalRemuneration,
    }));

    const buffer = await generateExcel("Theory Examination", columns, rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=TheoryExamination.xlsx");
    res.send(buffer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

const exportTheoryPDF = async (req, res) => {
  try {
    const theoryExams = await Theory.find()
      .populate("examiner", "name")
      .populate("designation", "title");

    const columns = [
      { header: "Examiner Name", key: "examinerName" },
      { header: "Designation", key: "designationTitle" },
      { header: "Rate", key: "rate" },
      { header: "Total Days", key: "totalDays" },
      { header: "Total Remuneration", key: "totalRemuneration" },
    ];

    const rows = theoryExams.map((item) => ({
      examinerName: item.examiner?.name || "N/A",
      designationTitle: item.designation?.title || "N/A",
      rate: item.rate,
      totalDays: item.totalDays,
      totalRemuneration: item.totalRemuneration,
    }));

    const buffer = await generatePDF("Theory Examination Report", columns, rows);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=TheoryExamination.pdf");
    res.send(buffer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

export { addTheoryExam, getTheoryExam, exportTheoryExcel, exportTheoryPDF };