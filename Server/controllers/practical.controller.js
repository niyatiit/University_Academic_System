import Examiner from "../models/examiner.model.js";
import Practical from "../models/practical.model.js";
import { generateExcel, generatePDF } from "../utils/export.util.js";

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
      department,
      semester,
    } = req.body;

    if (
      !examiner ||
      !totalDays ||
      !date ||
      !subjectCode ||
      !department ||
      !semester
    ) {
      return res.status(400).json({
        message:
          "Examiner, total days, date, subject code, department, and semester are required",
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
      department,
      semester: Number(semester),
      ta: taAmount,
      da: daAmount,
      honorarium: honorariumAmount,
      total,
    });
    return res
      .status(201)
      .json({ message: "Data entered successfully", practical });
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

const exportPracticalExcel = async (req, res) => {
  try {
    const practicalExams = await Practical.find()
      .populate("examiner", "name")
      .populate("designation", "title");

    const columns = [
      { header: "Examiner Name", key: "examinerName", width: 22 },
      { header: "Designation", key: "designationTitle", width: 18 },
      { header: "Rate", key: "rate", width: 10 },
      { header: "Total Days", key: "totalDays", width: 12 },
      { header: "Date", key: "date", width: 15 },
      { header: "Subject Code", key: "subjectCode", width: 15 },
      { header: "Person Name", key: "personName", width: 18 },
      { header: "TA", key: "ta", width: 10 },
      { header: "DA", key: "da", width: 10 },
      { header: "Honorarium", key: "honorarium", width: 14 },
      { header: "Total", key: "total", width: 14 },
    ];

    const rows = practicalExams.map((item) => ({
      examinerName: item.examiner?.name || "N/A",
      designationTitle: item.designation?.title || "N/A",
      rate: item.rate,
      totalDays: item.totalDays,
      date: item.date ? new Date(item.date).toLocaleDateString() : "",
      subjectCode: item.subjectCode,
      personName: item.personName || "-",
      ta: item.ta,
      da: item.da,
      honorarium: item.honorarium,
      total: item.total,
    }));

    const buffer = await generateExcel("Practical Examination", columns, rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=PracticalExamination.xlsx",
    );
    res.send(buffer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

const exportPracticalPDF = async (req, res) => {
  try {
    const practicalExams = await Practical.find()
      .populate("examiner", "name")
      .populate("designation", "title");

    const columns = [
      { header: "Examiner", key: "examinerName" },
      { header: "Designation", key: "designationTitle" },
      { header: "Rate", key: "rate" },
      { header: "Days", key: "totalDays" },
      { header: "Date", key: "date" },
      { header: "Subject", key: "subjectCode" },
      { header: "TA", key: "ta" },
      { header: "DA", key: "da" },
      { header: "Honorarium", key: "honorarium" },
      { header: "Total", key: "total" },
    ];

    const rows = practicalExams.map((item) => ({
      examinerName: item.examiner?.name || "N/A",
      designationTitle: item.designation?.title || "N/A",
      rate: item.rate,
      totalDays: item.totalDays,
      date: item.date ? new Date(item.date).toLocaleDateString() : "",
      subjectCode: item.subjectCode,
      ta: item.ta,
      da: item.da,
      honorarium: item.honorarium,
      total: item.total,
    }));

    const buffer = await generatePDF(
      "Practical Examination Report",
      columns,
      rows,
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=PracticalExamination.pdf",
    );
    res.send(buffer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

export { addPractical, getPractical, exportPracticalExcel, exportPracticalPDF };
