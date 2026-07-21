import { useState, useEffect } from "react";
import Common from "./Common";

const UserModal = ({ open, onClose, user, onSave }) => {
  const defaultState = {
    username: "",
    email: "",
    phone: "",
    role: "employee", 
    status: "Active",
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          username: user.username || user.name || "", 
          email: user.email || "",
          phone: user.phone || "", 
          role: user.role ? user.role.toLowerCase() : "employee", 
          status: user.status || "Active",
          _id: user._id || null,
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
      <div className="bg-(--bg-card) border border-(--border-color) text-(--text-white) rounded-2xl w-full max-w-md p-5 md:p-6 shadow-2xl transition-colors duration-200 max-h-[90vh] overflow-y-auto invisible-scrollbar">

        <h2 className="text-xl font-bold mb-4 text-(--text-white)">
          {user ? "Edit User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3.5">

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">
              Username / Full Name
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark) text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all cursor-pointer"
            >
              <option value="admin" className="bg-(--bg-card) text-(--text-white)">Admin</option>
              <option value="manager" className="bg-(--bg-card) text-(--text-white)">Manager</option>
              <option value="employee" className="bg-(--bg-card) text-(--text-white)">Staff / Employee</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark) text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all cursor-pointer"
            >
              <option value="Active" className="bg-(--bg-card) text-(--text-white)">Active</option>
              <option value="Inactive" className="bg-(--bg-card) text-(--text-white)">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-(--border-color)/40">
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