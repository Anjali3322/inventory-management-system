import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { isin: { $regex: search, $options: "i" } }
      ]
    };

    const totalItems = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const data = await Category.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ data, totalPages, totalItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, isin, description, status } = req.body;
    
    const exactIsin = await Category.findOne({ isin });
    if (exactIsin) {
      return res.status(400).json({ message: "ISIN Number already exists!" });
    }

    const newCategory = new Category({ name, isin, description, status });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, isin, description, status } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, isin, description, status },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;