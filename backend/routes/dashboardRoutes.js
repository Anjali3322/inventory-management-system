import express from "express";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import Sales from "../models/Sales.js";

const router = express.Router();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getMonthRange = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
};

const percentChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

router.get("/summary", async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const totalProducts = await Product.countDocuments();

    const thisMonth = getMonthRange(0);
    const lastMonth = getMonthRange(-1);

    const productsThisMonth = await Product.countDocuments({ createdAt: { $gte: thisMonth.start, $lt: thisMonth.end } });
    const productsLastMonth = await Product.countDocuments({ createdAt: { $gte: lastMonth.start, $lt: lastMonth.end } });
    const productsChange = percentChange(productsThisMonth, productsLastMonth);

    const currentMonthName = MONTHS[new Date().getMonth()];
    const lastMonthName = MONTHS[(new Date().getMonth() + 11) % 12];
    const prevSalesYear = currentMonthName === "Jan" ? year - 1 : year;

    const currentSales = await Sales.findOne({ year, month: currentMonthName });
    const prevSales = await Sales.findOne({ year: prevSalesYear, month: lastMonthName });

    const monthlySales = currentSales?.revenue || 0;
    const salesChange = percentChange(monthlySales, prevSales?.revenue || 0);

    const lowStockItems = await Product.countDocuments({ $expr: { $lte: ["$quantity", "$minStock"] } });

    const activeSuppliers = await Supplier.countDocuments({ status: "Active" });
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    const suppliersThisMonth = await Supplier.countDocuments({
      status: "Active",
      date: { $regex: `^${currentMonthPrefix}` },
    });

    const salesRecords = await Sales.find({ year });
    const revenueOverview = MONTHS.map((m) => {
      const record = salesRecords.find((s) => s.month === m);
      return { month: m, revenue: record?.revenue || 0, expenses: record?.expenses || 0 };
    });

    const lowStockAlerts = await Product.find({ $expr: { $lte: ["$quantity", "$minStock"] } })
      .sort({ quantity: 1 })
      .limit(3);

    res.json({
      totalProducts,
      productsChange,
      monthlySales,
      salesChange,
      lowStockItems,
      activeSuppliers,
      suppliersThisMonth,
      revenueOverview,
      lowStockAlerts: lowStockAlerts.map((p) => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/sales", async (req, res) => {
  try {
    const { month, year, revenue, expenses } = req.body;
    const updated = await Sales.findOneAndUpdate(
      { month, year },
      { revenue, expenses },
      { new: true, upsert: true }
    );
    res.status(201).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;