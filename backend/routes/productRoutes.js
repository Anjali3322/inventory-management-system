import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const categoryFilter = req.query.category || "All";

    let query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { supplier: { $regex: search, $options: "i" } }
      ]
    };

    if (categoryFilter !== "All") {
      query.category = categoryFilter;
    }

    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const data = await Product.find(query).sort({ _id: -1 }).skip(skip).limit(limit);

    res.json({ data, totalPages, totalItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, sku, category, supplier, purchasePrice, sellingPrice, quantity, unit, description, status, variants } = req.body;

    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      return res.status(400).json({ message: "SKU already exists!" });
    }

    const newProduct = new Product({ name, sku, category, supplier, purchasePrice, sellingPrice, quantity, unit, description, status, variants });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, sku, category, supplier, purchasePrice, sellingPrice, quantity, unit, description, status, variants } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, category, supplier, purchasePrice, sellingPrice, quantity, unit, description, status, variants },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;