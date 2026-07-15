import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, default: "purple" },
    editable: { type: Boolean, default: true },
    permissions: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      export: { type: Boolean, default: false },
      manageUsers: { type: Boolean, default: false },
    },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    
    singleton: { type: String, default: "main", unique: true },

    companyProfile: {
      name: { type: String, default: "Inventra Corp" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      website: { type: String, default: "" },
      address: { type: String, default: "" },
      logoUrl: { type: String, default: "" },
    },

    currencyTax: {
      currency: { type: String, default: "USD" },
      currencySymbol: { type: String, default: "$" },
      taxRate: { type: Number, default: 0 },
      dateFormat: { type: String, default: "YYYY-MM-DD" },
    },

    appearance: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      accentColor: { type: String, default: "#5B4CF7" },
    },

    notifications: {
      lowStockAlerts: { type: Boolean, default: true },
      newOrderReceived: { type: Boolean, default: true },
      supplierUpdates: { type: Boolean, default: false },
      weeklyReportEmail: { type: Boolean, default: true },
    },

    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      lastBackupAt: { type: Date, default: null },
    },

    roles: {
      type: [roleSchema],
      default: [
        {
          key: "admin",
          name: "Admin",
          color: "purple",
          editable: false,
          permissions: { view: true, create: true, edit: true, delete: true, export: true, manageUsers: true },
        },
        {
          key: "employee",
          name: "Employee",
          color: "blue",
          editable: true,
          permissions: { view: true, create: true, edit: true, delete: false, export: false, manageUsers: false },
        },
      ],
    },
  },
  { timestamps: true }
);

settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ singleton: "main" });
  if (!doc) {
    doc = await this.create({ singleton: "main" });
  }
  return doc;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;