import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    supplier: { type: String, default: "" },
    purchasePrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 0 },
    minStock: { type: Number, required: true, default: 10 },
    unit: { type: String, default: "pcs" },
    description: { type: String, default: "" },
    status: { type: String, default: "Active" },
    variants: [
      {
        variantName: { type: String, required: true },
        variantValue: { type: String, required: true },
        additionalPrice: { type: Number, default: 0 },
        stockCount: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;