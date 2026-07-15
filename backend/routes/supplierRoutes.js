import express from "express";
import Supplier from "../models/Supplier.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ]
    };

    const totalItems = await Supplier.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const data = await Supplier.find(query)
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
    const { name, contact, email, phone, country, products, status } = req.body;
    const newSupplier = new Supplier({ name, contact, email, phone, country, products, status });
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, contact, email, phone, country, products, status } = req.body;
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, contact, email, phone, country, products, status },
      { new: true }
    );
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;