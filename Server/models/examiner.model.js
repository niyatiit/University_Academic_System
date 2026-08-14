import mongoose from "mongoose";

const examinerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Examiner name is required"],
        trim : true,
    },
    designation : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Designation",
        required : [true , "Designation is required"],
    },
},{
    timestamps : true
})

const Examiner = new mongoose.model("Examiner" , examinerSchema)

export default Examiner