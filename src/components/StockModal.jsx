import { useState, useEffect } from "react";
import Common from "./Common";

const StockModal = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    quantity: 0,
    minStock: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        quantity: product.quantity,
        minStock: product.minStock,
      });
    }
  }, [product]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 transition-all">
      <div className="bg-(--bg-card) border border-(--border-color) text-(--text-white) rounded-2xl w-full max-w-md p-5 md:p-6 shadow-2xl transition-colors duration-200">

        <h2 className="text-xl font-bold mb-4 text-(--text-white)">
          Update Stock — {product?.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3.5">

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">In Stock</label>
            <input
              type="number"
              name="quantity"
              min="0"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-(--text-gray) uppercase tracking-wider">Min Stock</label>
            <input
              type="number"
              name="minStock"
              min="0"
              required
              value={formData.minStock}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-(--border-color) bg-(--bg-dark)/50 text-(--text-white) text-sm outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-(--border-color)/40">
            <Common text="Cancel" bgColor="bg-slate-500/10 text-slate-400 hover:bg-slate-500/20" onClick={onClose} />
            <Common text="Update" type="submit" bgColor="bg-[var(--primary-purple)] hover:bg-[var(--hover-purple)] text-white" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default StockModal;