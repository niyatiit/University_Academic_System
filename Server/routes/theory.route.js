import express from "express"
import {protect} from "../middleware/auth.middleware.js"
import { addTheoryExam, getTheoryExam } from "../controllers/theory.controller.js"

const theoryRouter = express.Router()

theoryRouter.post('/add',protect , addTheoryExam)
theoryRouter.get('/all',protect , getTheoryExam)

export default theoryRouter