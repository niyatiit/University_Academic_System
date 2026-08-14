import express from "express"
import protect from "../middlwares/auth.middlware.js"
import { addTheoryExam, getTheoryExam } from "../controllers/theory.controller.js"

const theoryRouter = express.Router()

theoryRouter.post('/add',protect , addTheoryExam)
theoryRouter.get('/all',protect , getTheoryExam)

export default theoryRouter