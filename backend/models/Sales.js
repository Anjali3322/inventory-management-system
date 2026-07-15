import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  revenue: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
});

salesSchema.index({ month: 1, year: 1 }, { unique: true });

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;