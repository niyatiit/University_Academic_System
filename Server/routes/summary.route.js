import express from "express";
import {
  getFilteredSummary,
  exportSummaryExcel,
  exportSummaryPDF,
} from "../controllers/summary.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const summaryRouter = express.Router();

summaryRouter.get("/", protect, getFilteredSummary);
summaryRouter.get("/export/excel", protect, exportSummaryExcel);
summaryRouter.get("/export/pdf", protect, exportSummaryPDF);

export default summaryRouter;