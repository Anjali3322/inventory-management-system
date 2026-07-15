import express from "express";
import bcrypt from "bcryptjs";
import Settings from "../models/Settings.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Supplier from "../models/Supplier.js";
import Sales from "../models/Sales.js";

const router = express.Router();

/* ---------------------------------------------------------
   GET /api/settings  -> returns the whole settings document
--------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   PUT /api/settings/company
--------------------------------------------------------- */
router.put("/company", async (req, res) => {
  try {
    const { name, email, phone, website, address, logoUrl } = req.body;
    const settings = await Settings.getSingleton();
    settings.companyProfile = {
      name: name ?? settings.companyProfile.name,
      email: email ?? settings.companyProfile.email,
      phone: phone ?? settings.companyProfile.phone,
      website: website ?? settings.companyProfile.website,
      address: address ?? settings.companyProfile.address,
      logoUrl: logoUrl ?? settings.companyProfile.logoUrl,
    };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   PUT /api/settings/currency
--------------------------------------------------------- */
router.put("/currency", async (req, res) => {
  try {
    const { currency, currencySymbol, taxRate, dateFormat } = req.body;
    const settings = await Settings.getSingleton();
    settings.currencyTax = {
      currency: currency ?? settings.currencyTax.currency,
      currencySymbol: currencySymbol ?? settings.currencyTax.currencySymbol,
      taxRate: taxRate ?? settings.currencyTax.taxRate,
      dateFormat: dateFormat ?? settings.currencyTax.dateFormat,
    };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   PUT /api/settings/appearance
--------------------------------------------------------- */
router.put("/appearance", async (req, res) => {
  try {
    const { theme, accentColor } = req.body;
    const settings = await Settings.getSingleton();
    settings.appearance = {
      theme: theme ?? settings.appearance.theme,
      accentColor: accentColor ?? settings.appearance.accentColor,
    };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   PUT /api/settings/notifications
--------------------------------------------------------- */
router.put("/notifications", async (req, res) => {
  try {
    const { lowStockAlerts, newOrderReceived, supplierUpdates, weeklyReportEmail } = req.body;
    const settings = await Settings.getSingleton();
    settings.notifications = {
      lowStockAlerts: lowStockAlerts ?? settings.notifications.lowStockAlerts,
      newOrderReceived: newOrderReceived ?? settings.notifications.newOrderReceived,
      supplierUpdates: supplierUpdates ?? settings.notifications.supplierUpdates,
      weeklyReportEmail: weeklyReportEmail ?? settings.notifications.weeklyReportEmail,
    };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   PUT /api/settings/security/password
   body: { email, currentPassword, newPassword }
--------------------------------------------------------- */
router.put("/security/password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   PUT /api/settings/security/2fa
--------------------------------------------------------- */
router.put("/security/2fa", async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    settings.security.twoFactorEnabled = !settings.security.twoFactorEnabled;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   PUT /api/settings/roles  -> replace the full roles array
--------------------------------------------------------- */
router.put("/roles", async (req, res) => {
  try {
    const { roles } = req.body;
    const settings = await Settings.getSingleton();
    settings.roles = roles;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   GET /api/settings/export-csv -> download inventory as CSV
--------------------------------------------------------- */
router.get("/export-csv", async (req, res) => {
  try {
    const products = await Product.find().lean();

    const header = ["Name", "SKU", "Quantity", "MinStock", "Price"];
    const rows = products.map((p) =>
      [p.name, p.sku, p.quantity, p.minStock, p.price].map((v) => `"${v ?? ""}"`).join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=inventory-export.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ---------------------------------------------------------
   POST /api/settings/backup -> download a full JSON backup
--------------------------------------------------------- */
router.post("/backup", async (req, res) => {
  try {
    const [products, categories, brands, suppliers, sales, settings] = await Promise.all([
      Product.find().lean(),
      Category.find().lean(),
      Brand.find().lean(),
      Supplier.find().lean(),
      Sales.find().lean(),
      Settings.getSingleton(),
    ]);

    settings.security.lastBackupAt = new Date();
    await settings.save();

    const backup = {
      generatedAt: new Date().toISOString(),
      products,
      categories,
      brands,
      suppliers,
      sales,
      settings,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=inventra-backup.json");
    res.send(JSON.stringify(backup, null, 2));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;