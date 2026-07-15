import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ]
    };

    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const data = products.map((item) => {
      let stockStatus = "OK";
      if (item.quantity === 0) stockStatus = "Out of Stock";
      else if (item.quantity <= item.minStock) stockStatus = "Low Stock";

      return {
        _id: item._id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        quantity: item.quantity,
        minStock: item.minStock,
        unit: item.unit,
        stockStatus,
      };
    });

    res.json({ data, totalPages, totalItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { quantity, minStock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { quantity, minStock },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;  