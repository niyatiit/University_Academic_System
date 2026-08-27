import Designation from "../models/designation.model.js";
import Examiner from "../models/examiner.model.js";

// @desc   Add new examiner
// @route  POST /api/examiner/add
const addExaminer = async (req, res) => {
  try {
    const { name, designationTitle, rate, accountNumber, ifscCode, bankName } =
      req.body;

    if (
      !name ||
      !designationTitle ||
      !rate ||
      !accountNumber ||
      !ifscCode ||
      !bankName
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const accountPattern = /^\d{9,18}$/;
    if (!accountPattern.test(accountNumber)) {
      return res.status(400).json({
        message: "Account number must be 9-18 digits (numbers only)",
      });
    }

    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscPattern.test(ifscCode.toUpperCase())) {
      return res.status(400).json({
        message: "Invalid IFSC code format (e.g. SBIN0001234)",
      });
    }

    const existingAccount = await Examiner.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(400).json({
        message: "This account number already exists",
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
      accountNumber,
      ifscCode: ifscCode.toUpperCase(),
      bankName,
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


// @desc   Update examiner
// @route  PUT /api/examiner/:id
const updateExaminer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designationTitle, rate, accountNumber, ifscCode, bankName } = req.body;

    const examiner = await Examiner.findById(id);
    if (!examiner) {
      return res.status(404).json({ message: "Examiner not found" });
    }

    if (accountNumber && accountNumber !== examiner.accountNumber) {
      const accountPattern = /^\d{9,18}$/;
      if (!accountPattern.test(accountNumber)) {
        return res.status(400).json({
          message: "Account number must be 9-18 digits (numbers only)",
        });
      }
      const existingAccount = await Examiner.findOne({ accountNumber, _id: { $ne: id } });
      if (existingAccount) {
        return res.status(400).json({ message: "This account number already exists" });
      }
      examiner.accountNumber = accountNumber;
    }

    if (ifscCode) {
      const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscPattern.test(ifscCode.toUpperCase())) {
        return res.status(400).json({
          message: "Invalid IFSC code format (e.g. SBIN0001234)",
        });
      }
      examiner.ifscCode = ifscCode.toUpperCase();
    }

    if (name) examiner.name = name;
    if (bankName) examiner.bankName = bankName;

    if (designationTitle && rate) {
      let designation = await Designation.findOne({
        title: { $regex: `^${designationTitle.trim()}$`, $options: "i" },
      });
      if (designation) {
        designation.rate = rate;
        await designation.save();
      } else {
        designation = await Designation.create({ title: designationTitle.trim(), rate });
      }
      examiner.designation = designation._id;
    }

    await examiner.save();
    await examiner.populate("designation");

    res.status(200).json({ message: "Examiner updated successfully", examiner });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc   Delete examiner
// @route  DELETE /api/examiner/:id
const deleteExaminer = async (req, res) => {
  try {
    const { id } = req.params;
    const examiner = await Examiner.findByIdAndDelete(id);

    if (!examiner) {
      return res.status(404).json({ message: "Examiner not found" });
    }

    res.status(200).json({ message: "Examiner deleted successfully" });
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

// @desc   Get all examiners
// @route  GET /api/examiner/all
const getExaminers = async (req, res) => {
  try {
    const examiners = await Examiner.find().populate("designation", "title rate");
    res.status(200).json(examiners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
export { addExaminer,updateExaminer , deleteExaminer, getExaminer, addDesignation };
