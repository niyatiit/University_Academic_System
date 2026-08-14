import express from "express";
import {
  getEligibleExaminers,
  getExaminerTotalAmount,
  addBankDetails,
  getAllBankDetails,
} from "../controllers/bank.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const bankRouter = express.Router();

bankRouter.get("/examiners", protect, getEligibleExaminers);
bankRouter.get("/amount/:examinerId", protect, getExaminerTotalAmount);
bankRouter.post("/add", protect, addBankDetails);
bankRouter.get("/all", protect, getAllBankDetails);

export default bankRouter;