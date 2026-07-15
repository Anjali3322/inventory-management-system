import { useState, useEffect } from "react";
import Common from "./Common";

const CategoryModal = ({ open, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    isin: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: "",
        isin: "",
        description: "",
        status: "Active",
      });
    }
  }, [category]);

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
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">Category Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">ISIN Number</label>
            <input
              type="text"
              name="isin"
              placeholder="e.g. CAT-001"
              required
              value={formData.isin}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)]/50 text-[var(--text-white)] text-sm outline-none placeholder:text-[var(--text-gray)]/40 focus:border-[var(--primary-purple)] transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-[var(--text-gray)] uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)]/50 text-[var(--text-white)] text-sm outline-none focus:border-[var(--primary-purple)] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-[var(--bg-dark)] text-[var(--text-white)] text-sm outline-none focus:border-[var(--primary-purple)] transition-all cursor-pointer"
            >
              <option value="Active" className="bg-[var(--bg-card)] text-[var(--text-white)]">Active</option>
              <option value="Inactive" className="bg-[var(--bg-card)] text-[var(--text-white)]">Inactive</option>
            </select>    
          </div>         

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]/40">
            <Common text="Cancel" bgColor="bg-slate-500/10 text-slate-400 hover:bg-slate-500/20" onClick={onClose} />
            <Common text={category ? "Update" : "Save"} type="submit" bgColor="bg-[var(--primary-purple)] hover:bg-[var(--hover-purple)] text-white" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default CategoryModal;