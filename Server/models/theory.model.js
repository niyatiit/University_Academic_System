import mongoose from "mongoose";

const theorySchema = new mongoose.Schema(
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
      required: [true, "rate is required"],
    },
    totalDays: {
      type: Number,
      required: [true, "Total Days is required"],
    },
    totalRemuneration: {
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

const Theory = mongoose.model("Theory", theorySchema);

export default Theory;
