import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";  
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  // origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  origin : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/api/test-server", (req, res) => {
  res.json({ status: "alive", message: "Server is freshly updated!" });
});

app.use("/api/settings", settingsRoutes);  
app.use("/api/invoices", invoiceRoutes);    
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
});