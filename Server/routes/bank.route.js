import express from "express";
import {
  getEligibleExaminers,
  getExaminerTotalAmount,
  addBankDetails,
  getAllBankDetails,
  exportBankPDF,
  getFilteredSummary,
} from "../controllers/bank.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const bankRouter = express.Router();

bankRouter.get("/examiners", protect, getEligibleExaminers);
bankRouter.get("/amount/:examinerId", protect, getExaminerTotalAmount);
bankRouter.post("/add", protect, addBankDetails);
bankRouter.get("/all", protect, getAllBankDetails);
bankRouter.get("/export/pdf", protect, exportBankPDF);
bankRouter.get("/summary",protect,getFilteredSummary)

export default bankRouter;
