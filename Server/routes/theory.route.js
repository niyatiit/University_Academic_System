import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addTheoryExam,
  exportTheoryExcel,
  exportTheoryPDF,
  getTheoryExam,
} from "../controllers/theory.controller.js";

const theoryRouter = express.Router();

theoryRouter.post("/add", protect, addTheoryExam);
theoryRouter.get("/all", protect, getTheoryExam);
theoryRouter.get("/export/excel", protect, exportTheoryExcel);
theoryRouter.get("/export/pdf", protect, exportTheoryPDF);

export default theoryRouter;
