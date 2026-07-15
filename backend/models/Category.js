import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isin: { type: String, required: true, unique: true },
  description: { type: String },
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;