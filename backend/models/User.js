import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, default: "Staff", enum: ["Admin", "Manager", "Staff"] },
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
  lastLogin: { type: String, default: "Never" }
});

const User = mongoose.model("User", userSchema);

export default User;