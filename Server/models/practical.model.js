import mongoose from "mongoose";

const practicalSchema = new mongoose.Schema(
  {
    examiner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Examiner",
      required: [true, "Examiner is required"],
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: [true, "Designation is required"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
    },
    totalDays: {
      type: Number,
      required: [true, "Total days is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
    },
    personName: {
      type: String,
      trim: true,
      default: "",
    },
    ta: {
      type: Number,
      required: [true, "TA amount is required"],
      default: 0,
    },
    da: {
      type: Number,
      required: [true, "DA amount is required"],
      default: 0,
    },
    honorarium: {
      type: Number,
      required: [true, "Honorarium amount is required"],
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["BBA", "MBA", "BCA", "MCA", "JMC", "B.TECH", "BCOM"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },
  },

  {
    timestamps: true,
  },
);

const Practical = mongoose.model("Practical", practicalSchema);
export default Practical;
