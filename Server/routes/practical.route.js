import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import { addPractical, getPractical } from "../controllers/practical.controller.js";

const practicalRouter = express.Router()

practicalRouter.post('/add' , protect,addPractical)
practicalRouter.get('/all' , protect,getPractical)

export default practicalRouter