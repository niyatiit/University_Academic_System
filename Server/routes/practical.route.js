import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import { addPractical, exportPracticalExcel, exportPracticalPDF, getPractical, updatePractical, deletePractical } from "../controllers/practical.controller.js";

const practicalRouter = express.Router()

practicalRouter.post('/add' , protect,addPractical)
practicalRouter.get('/all' , protect,getPractical)
practicalRouter.put('/update/:id', protect, updatePractical)
practicalRouter.delete('/delete/:id', protect, deletePractical)
practicalRouter.get('/export/excel',protect,exportPracticalExcel);
practicalRouter.get('/export/pdf',protect,exportPracticalPDF);


export default practicalRouter