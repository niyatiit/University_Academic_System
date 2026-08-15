import Bank from "../models/bank.model.js";
import Theory from "../models/theory.model.js";
import Practical from "../models/practical.model.js";
import Examiner from "../models/examiner.model.js";
import { generatePDF } from "../utils/export.util.js";

// @desc   Get examiners who have Theory or Practical entries (for dropdown)
// @route  GET /api/bank/examiners
const getEligibleExaminers = async (req, res) => {
  try {
    const theoryExaminerIds = await Theory.distinct("examiner");
    const practicalExaminerIds = await Practical.distinct("examiner");

    const allIds = [...theoryExaminerIds, ...practicalExaminerIds];
    const uniqueIds = [...new Set(allIds.map((id) => id.toString()))];

    const examiners = await Examiner.find({ _id: { $in: uniqueIds } });

    return res.status(200).json({
      message: "Fetched eligible examiners successfully",
      examiners,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get total amount (Theory + Practical) for a specific examiner
// @route  GET /api/bank/amount/:examinerId
const getExaminerTotalAmount = async (req, res) => {
  try {
    const { examinerId } = req.params;

    const theoryEntries = await Theory.find({ examiner: examinerId });
    const practicalEntries = await Practical.find({ examiner: examinerId });

    const theoryTotal = theoryEntries.reduce(
      (sum, entry) => sum + entry.totalRemuneration,
      0,
    );
    const practicalTotal = practicalEntries.reduce(
      (sum, entry) => sum + entry.total,
      0,
    );

    const totalAmount = theoryTotal + practicalTotal;

    return res.status(200).json({
      message: "Total amount calculated successfully",
      totalAmount,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Add Bank Details entry
// @route  POST /api/bank/add
const addBankDetails = async (req, res) => {
  try {
    const { examiner, accountNumber, ifscCode, bankName } = req.body;

    if (!examiner || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate account number format
    const accountPattern = /^\d{9,18}$/;
    if (!accountPattern.test(accountNumber)) {
      return res.status(400).json({
        message: "Account number must be 9-18 digits (numbers only)",
      });
    }

    // Validate IFSC code format
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscPattern.test(ifscCode.toUpperCase())) {
      return res.status(400).json({
        message: "Invalid IFSC code format (e.g. SBIN0001234)",
      });
    }

    const existingAccount = await Bank.findOne({ accountNumber });

    if (existingAccount) {
      return res
        .status(400)
        .json({ message: "This account number already exists" });
    }

    const theoryEntries = await Theory.find({ examiner });
    const practicalEntries = await Practical.find({ examiner });

    const theoryTotal = theoryEntries.reduce(
      (sum, entry) => sum + entry.totalRemuneration,
      0,
    );
    const practicalTotal = practicalEntries.reduce(
      (sum, entry) => sum + entry.total,
      0,
    );

    const amount = theoryTotal + practicalTotal;

    const bankDetails = await Bank.create({
      examiner,
      accountNumber,
      ifscCode,
      bankName,
      amount,
    });

    return res.status(201).json({
      message: "Data entered successfully",
      bankDetails,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get all Bank Details (for Summary page)
// @route  GET /api/bank/all
const getAllBankDetails = async (req, res) => {
  try {
    const bankDetails = await Bank.find().populate("examiner", "name");

    return res.status(200).json({
      message: "Fetched data successfully",
      bankDetails,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const exportBankPDF = async (req, res) => {
  try {
    const bankDetails = await Bank.find().populate("examiner", "name");

    const columns = [
      { header: "Name", key: "name" },
      { header: "A/C No", key: "accountNumber" },
      { header: "IFSC Code", key: "ifscCode" },
      { header: "Bank Name", key: "bankName" },
      { header: "Amount", key: "amount" },
    ];

    const rows = bankDetails.map((item) => ({
      name: item.examiner?.name || "N/A",
      accountNumber: item.accountNumber,
      ifscCode: item.ifscCode,
      bankName: item.bankName,
      amount: item.amount,
    }));

    const buffer = await generatePDF("Bank Details Report", columns, rows);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=BankDetails.pdf",
    );
    res.send(buffer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get filtered summary by department/semester (based on Theory + Practical entries)
// @route  GET /api/bank/summary?department=X&semester=Y
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

    const theoryEntries = await Theory.find(theoryFilter).populate(
      "examiner",
      "name",
    );
    const practicalEntries = await Practical.find(practicalFilter).populate(
      "examiner",
      "name",
    );

    // Group totals by examiner
    const totals = {};

    theoryEntries.forEach((entry) => {
      if (!entry.examiner) return;
      const id = entry.examiner._id.toString();
      if (!totals[id]) totals[id] = { name: entry.examiner.name, total: 0 };
      totals[id].total += entry.totalRemuneration;
    });

    practicalEntries.forEach((entry) => {
      if (!entry.examiner) return;
      const id = entry.examiner._id.toString();
      if (!totals[id]) totals[id] = { name: entry.examiner.name, total: 0 };
      totals[id].total += entry.total;
    });

    const examinerIds = Object.keys(totals);

    // Fetch bank details for these examiners
    const bankRecords = await Bank.find({ examiner: { $in: examinerIds } });

    const summary = examinerIds.map((id) => {
      const bank = bankRecords.find((b) => b.examiner.toString() === id);
      return {
        examinerId: id,
        name: totals[id].name,
        accountNumber: bank?.accountNumber || "Not added yet",
        ifscCode: bank?.ifscCode || "-",
        bankName: bank?.bankName || "-",
        amount: totals[id].total,
      };
    });

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

export {
  getEligibleExaminers,
  getExaminerTotalAmount,
  addBankDetails,
  getAllBankDetails,
  exportBankPDF,
  getFilteredSummary,
};
