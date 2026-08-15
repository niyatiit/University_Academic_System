import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    examiner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Examiner",
      required: [true, "Examiner is required"],
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
      match: [
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Invalid IFSC code format (e.g. SBIN0001234)",
      ],
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Bank = mongoose.model("Bank", bankSchema);

export default Bank;
