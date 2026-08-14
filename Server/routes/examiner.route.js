import express from "express"
import {protect} from "../middleware/auth.middleware.js"
import { addDesignation, addExaminer, getDesignation, getExaminer } from "../controllers/examiner.controller.js"

const examinerRouter = express.Router()

examinerRouter.post("/add" , protect,addExaminer);
examinerRouter.get("/all",protect,getExaminer);
examinerRouter.get("/designations",protect,getDesignation);
examinerRouter.post("/designation/add",protect,addDesignation);


export default examinerRouter