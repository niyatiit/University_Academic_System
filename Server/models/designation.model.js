import mongoose from "mongoose";

const designationSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Designation title is required"],
        unique : true,
        trim : true,
    },
    rate : {
        type : Number,
        required : [true, "Rate is required"],
    },
},{
    timestamps : true
})

const Designation = new mongoose.model("Designation" , designationSchema)

export default Designation;