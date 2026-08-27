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
     accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      unique: true,
      trim: true,
      match: [/^\d{9,18}$/, "Account number must be 9-18 digits"],
    },
    ifscCode: {
      type: String,
      required: [true, "IFSC code is required"],
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format (e.g. SBIN0001234)"],
    },
     bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
    },
},{
    timestamps : true
})

const Examiner = new mongoose.model("Examiner" , examinerSchema)

export default Examiner