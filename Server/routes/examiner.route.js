import express from "express"
import {protect} from "../middleware/auth.middleware.js"
import { addDesignation, addExaminer, deleteExaminer, getExaminer, updateExaminer } from "../controllers/examiner.controller.js"
import mcaOnly from "../middleware/mca.middleware.js";

const examinerRouter = express.Router()

examinerRouter.get("/all",protect,getExaminer);
examinerRouter.post("/add" , protect,addExaminer);
examinerRouter.put("/:id" , protect , mcaOnly , updateExaminer);
examinerRouter.delete("/:id" , protect , mcaOnly , deleteExaminer);
examinerRouter.post("/designation/add",protect,addDesignation);


export default examinerRouter