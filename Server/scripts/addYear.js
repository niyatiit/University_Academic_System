import dotenv from "dotenv";
import mongoose from "mongoose";
import Theory from "../models/theory.model.js";
import Practical from "../models/practical.model.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const t = await Theory.updateMany({}, { $set: { year: 2026 } });
  const p = await Practical.updateMany({}, { $set: { year: 2026 } });

  console.log("Theory entries updated:", t.modifiedCount);
  console.log("Practical entries updated:", p.modifiedCount);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
