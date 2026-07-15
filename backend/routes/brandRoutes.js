import express from "express";
import Brand from "../models/Brand.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" }
    };

    const totalItems = await Brand.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const data = await Brand.find(query)
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
    const { name, description, products, status } = req.body;
    const newBrand = new Brand({ name, description, products, status });
    const savedBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, description, products, status } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description, products, status },
      { new: true }
    );
    res.json(updatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;