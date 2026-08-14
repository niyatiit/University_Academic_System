import express from "express"
import { login, register } from "../controllers/auth.controller.js";


const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login' , login);
// userRouter.post('/add' , protect , );

export default userRouter