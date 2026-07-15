import { useState } from "react";
import Common from "./Common";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SalesModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear(),
    revenue: 0,
    expenses: 0,
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "month" ? value : Number(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 transition-all">
      <div className="bg-(--bg-card) border border-(--border-color) text-(--text-white) rounded-2xl w-full max-w-md p-5 md:p-6 shadow-2xl transition-colors duration-200">

        <h2 className="text-xl font-bold mb-4 text-(--text-white)">Update Monthly Sales</h2>

        <form onSubmit={handleSubmit} className="space-y-3.5">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">Month</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark) text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m} className="bg-(--bg-card) text-(--text-white)">{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">Year</label>
              <input
                type="number"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">Revenue ($)</label>
            <input
              type="number"
              name="revenue"
              min="0"
              required
              value={formData.revenue}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">Expenses ($)</label>
            <input
              type="number"
              name="expenses"
              min="0"
              required
              value={formData.expenses}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-(--border-color)/40">
            <Common text="Cancel" bgColor="bg-slate-500/10 text-slate-400 hover:bg-slate-500/20" onClick={onClose} />
            <Common text="Save" type="submit" bgColor="bg-[var(--primary-purple)] hover:bg-[var(--hover-purple)] text-white" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default SalesModal;