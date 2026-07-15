import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  products: { type: Number, default: 0 },
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;