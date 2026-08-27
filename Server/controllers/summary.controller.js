import Theory from "../models/theory.model.js";
import Practical from "../models/practical.model.js";
import Examiner from "../models/examiner.model.js";
import { generateExcel, generatePDF } from "../utils/export.util.js";

// @desc   Get filtered summary by department/semester (based on Theory + Practical entries)
// @route  GET /api/summary?department=X&semester=Y
const getFilteredSummary = async (req, res) => {
  try {
    const { department, semester } = req.query;

    const theoryFilter = {};
    const practicalFilter = {};

    if (department) {
      theoryFilter.department = department;
      practicalFilter.department = department;
    }
    if (semester) {
      theoryFilter.semester = Number(semester);
      practicalFilter.semester = Number(semester);
    }

    const theoryEntries = await Theory.find(theoryFilter).populate("examiner");
    const practicalEntries = await Practical.find(practicalFilter).populate("examiner");

    const totals = {};

    theoryEntries.forEach((entry) => {
      if (!entry.examiner) return;
      const id = entry.examiner._id.toString();
      if (!totals[id]) {
        totals[id] = {
          examiner: entry.examiner,
          total: 0,
        };
      }
      totals[id].total += entry.totalRemuneration;
    });

    practicalEntries.forEach((entry) => {
      if (!entry.examiner) return;
      const id = entry.examiner._id.toString();
      if (!totals[id]) {
        totals[id] = {
          examiner: entry.examiner,
          total: 0,
        };
      }
      totals[id].total += entry.total;
    });

    const summary = Object.values(totals).map((item) => ({
      examinerId: item.examiner._id,
      name: item.examiner.name,
      accountNumber: item.examiner.accountNumber,
      ifscCode: item.examiner.ifscCode,
      bankName: item.examiner.bankName,
      amount: item.total,
    }));

    return res.status(200).json({
      message: "Fetched filtered summary successfully",
      summary,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Export summary as Excel
// @route  GET /api/summary/export/excel
const exportSummaryExcel = async (req, res) => {
  try {
    const { department, semester } = req.query;
    const summaryRes = await buildSummary(department, semester);

    const columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "A/C No", key: "accountNumber", width: 20 },
      { header: "IFSC Code", key: "ifscCode", width: 15 },
      { header: "Bank Name", key: "bankName", width: 22 },
      { header: "Total Amount", key: "amount", width: 16 },
    ];

    const buffer = await generateExcel("Summary Report", columns, summaryRes);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Summary.xlsx");
    res.send(buffer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

// @desc   Export summary as PDF (styled report)
// @route  GET /api/summary/export/pdf
const exportSummaryPDF = async (req, res) => {
  try {
    const { department, semester } = req.query;
    const summaryRes = await buildSummary(department, semester);

    const columns = [
      { header: "Name", key: "name" },
      { header: "A/C No", key: "accountNumber" },
      { header: "IFSC Code", key: "ifscCode" },
      { header: "Bank Name", key: "bankName" },
      { header: "Total Amount", key: "amount" },
    ];

    const title = department
      ? `Summary Report - ${department}${semester ? ` Semester ${semester}` : ""}`
      : "Summary Report";

    const buffer = await generatePDF(title, columns, summaryRes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Summary.pdf");
    res.send(buffer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

// Shared helper used by both export functions
const buildSummary = async (department, semester) => {
  const theoryFilter = {};
  const practicalFilter = {};

  if (department) {
    theoryFilter.department = department;
    practicalFilter.department = department;
  }
  if (semester) {
    theoryFilter.semester = Number(semester);
    practicalFilter.semester = Number(semester);
  }

  const theoryEntries = await Theory.find(theoryFilter).populate("examiner");
  const practicalEntries = await Practical.find(practicalFilter).populate("examiner");

  const totals = {};

  theoryEntries.forEach((entry) => {
    if (!entry.examiner) return;
    const id = entry.examiner._id.toString();
    if (!totals[id]) totals[id] = { examiner: entry.examiner, total: 0 };
    totals[id].total += entry.totalRemuneration;
  });

  practicalEntries.forEach((entry) => {
    if (!entry.examiner) return;
    const id = entry.examiner._id.toString();
    if (!totals[id]) totals[id] = { examiner: entry.examiner, total: 0 };
    totals[id].total += entry.total;
  });

  return Object.values(totals).map((item) => ({
    name: item.examiner.name,
    accountNumber: item.examiner.accountNumber,
    ifscCode: item.examiner.ifscCode,
    bankName: item.examiner.bankName,
    amount: item.total,
  }));
};

export { getFilteredSummary, exportSummaryExcel, exportSummaryPDF };