import express from "express"
import protect from "../middlwares/auth.middlware.js"
import { addDesignation, addExaminer, getDesignation, getExaminer } from "../controllers/examiner.controller.js"

const examierRouter = express.Router()

examierRouter.post("/add" , protect,addExaminer);
examierRouter.get("/all",protect,getExaminer);
examierRouter.get("/designations",protect,getDesignation);
examierRouter.post("/designation/add",protect,addDesignation);


export default examierRouter