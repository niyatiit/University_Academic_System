//import all dependancy
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import userRouter from "./routes/user.route.js"
import examinerRouter from './routes/examiner.route.js'
import theoryRouter from "./routes/theory.route.js"
import practicalRouter from "./routes/practical.route.js"
import bankRouter from "./routes/bank.route.js"


//load env variable
dotenv.config()

//connect to mongodb
connectDB()


const app = express();

//middlwares use
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true}))
app.use(cors());


// Test Routes
app.get("/",(req,res)=>{
    res.send("🥳🥳 Academic Payment Portal API is running .... ");
})

// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });
// Routes (we'll add these one by one)
app.use("/api/user", userRouter)
app.use("/api/examiner",examinerRouter );
app.use("/api/theory", theoryRouter);
app.use("/api/practical", practicalRouter);
app.use("/api/bank", bankRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`🖥️  Server running on port ${PORT}`)
})