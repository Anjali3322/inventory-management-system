import express from "express";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

const router = express.Router();

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments({ invoiceNumber: { $regex: `^INV-${year}-` } });
  return `INV-${year}-${String(count + 1).padStart(3, "0")}`;
};

router.get("/summary", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((sum, i) => sum + i.total, 0);
    const outstanding = invoices
      .filter((i) => i.status === "Unpaid" || i.status === "Overdue")
      .reduce((sum, i) => sum + i.total, 0);
    const overdueCount = invoices.filter((i) => i.status === "Overdue").length;

    res.json({ totalInvoices, totalRevenue, outstanding, overdueCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (search) filter.$or = [
      { invoiceNumber: { $regex: search, $options: "i" } },
      { customerName: { $regex: search, $options: "i" } },
    ];

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items, taxRate, discount, dueDate, notes, status } = req.body;

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = (subtotal * (taxRate || 0)) / 100;
    const total = subtotal + taxAmount - (discount || 0);

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items: items.map((item) => ({ ...item, total: item.quantity * item.price })),
      subtotal,
      taxRate: taxRate || 0,
      taxAmount,
      discount: discount || 0,
      total,
      status: status || "Unpaid",
      dueDate,
      notes,
    });

    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
      }
    }

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items, taxRate, discount, dueDate, notes, status } = req.body;

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = (subtotal * (taxRate || 0)) / 100;
    const total = subtotal + taxAmount - (discount || 0);

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items: items.map((item) => ({ ...item, total: item.quantity * item.price })),
        subtotal,
        taxRate: taxRate || 0,
        taxAmount,
        discount: discount || 0,
        total,
        status,
        dueDate,
        notes,
      },
      { new: true }
    );

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    for (const item of invoice.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { quantity: item.quantity } });
      }
    }

    await invoice.deleteOne();
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;