import { useState, useEffect } from "react";
import Common from "./Common";

const UserModal = ({ open, onClose, user, onSave }) => {
  // Safe default initial state jo backend data structure se match kare
  const defaultState = {
    username: "",
    email: "",
    phone: "",
    role: "employee", // Mapped to lowercase to match backend
    status: "Active",
  };

  const [formData, setFormData] = useState(defaultState);

  // Modal open hone par ya active user change hone par state control
  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          username: user.username || user.name || "", 
          email: user.email || "",
          phone: user.phone || "",
          role: user.role ? user.role.toLowerCase() : "employee", // Handle lowercase fallback
          status: user.status || "Active",
          _id: user._id || null, // Keeping the reference ID for updates
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [user, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 transition-all">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-white)] rounded-2xl w-full max-w-md p-5 md:p-6 shadow-2xl transition-colors duration-200 max-h-[90vh] overflow-y-auto invisible-scrollbar">

        <h2 className="text-xl font-bold mb-4 text-[var(--text-white)]">
          {user ? "Edit User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3.5">

          {/* Username Input Field */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-[var(--text-gray)] uppercase tracking-wider">
              Username / Full Name
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)]/50 text-[var(--text-white)] text-sm outline-none focus:border-[var(--primary-purple)] transition-all"
            />
          </div>

          {/* Email Input Field */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-[var(--text-gray)] uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)]/50 text-[var(--text-white)] text-sm outline-none focus:border-[var(--primary-purple)] transition-all"
            />
          </div>

          {/* Phone Input Field */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-[var(--text-gray)] uppercase tracking-wider">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)]/50 text-[var(--text-white)] text-sm outline-none focus:border-[var(--primary-purple)] transition-all"
            />
          </div>

          {/* Role Selection Dropdown */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-[var(--text-gray)] uppercase tracking-wider">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)] text-[var(--text-white)] text-sm outline-none focus:border-[var(--primary-purple)] transition-all cursor-pointer"
            >
              <option value="admin" className="bg-[var(--bg-card)] text-[var(--text-white)]">Admin</option>
              <option value="manager" className="bg-[var(--bg-card)] text-[var(--text-white)]">Manager</option>
              <option value="employee" className="bg-[var(--bg-card)] text-[var(--text-white)]">Staff / Employee</option>
            </select>
          </div>

          {/* Status Selection Dropdown */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-[var(--text-gray)] uppercase tracking-wider">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)] text-[var(--text-white)] text-sm outline-none focus:border-[var(--primary-purple)] transition-all cursor-pointer"
            >
              <option value="Active" className="bg-[var(--bg-card)] text-[var(--text-white)]">Active</option>
              <option value="Inactive" className="bg-[var(--bg-card)] text-[var(--text-white)]">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]/40">
            <Common 
              text="Cancel" 
              type="button" 
              bgColor="bg-slate-500/10 text-slate-400 hover:bg-slate-500/20" 
              onClick={onClose} 
            />
            <Common 
              text={user ? "Update" : "Save"} 
              type="submit" 
              bgColor="bg-[var(--primary-purple)] hover:bg-[var(--hover-purple)] text-white" 
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserModal;