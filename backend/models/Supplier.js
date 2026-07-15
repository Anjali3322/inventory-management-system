import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  products: { type: Number, default: 0 },
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;