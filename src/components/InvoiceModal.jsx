import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { createInvoice, updateInvoice, getProductsForInvoice } from "../api/invoiceApi";

const emptyItem = { product: "", name: "", sku: "", quantity: 1, price: 0 };

const inputClasses =
  "w-full bg-(--bg-dark) border border-(--border-color) rounded-xl px-4 py-2.5 text-sm text-(--text-white) placeholder-slate-500 focus:outline-none focus:border-(--primary-purple) transition-all";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold tracking-wide text-(--text-gray) uppercase mb-1.5">{label}</label>
    {children}
  </div>
);

const InvoiceModal = ({ invoice, onClose, onSaved }) => {
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    customerName: invoice?.customerName || "",
    customerEmail: invoice?.customerEmail || "",
    customerPhone: invoice?.customerPhone || "",
    customerAddress: invoice?.customerAddress || "",
    dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
    taxRate: invoice?.taxRate ?? 0,
    discount: invoice?.discount ?? 0,
    notes: invoice?.notes || "",
    status: invoice?.status || "Unpaid",
  });

  const [items, setItems] = useState(
    invoice?.items?.length ? invoice.items.map((i) => ({ ...i, product: i.product || "" })) : [emptyItem]
  );

  useEffect(() => {
    getProductsForInvoice()
      .then(setProducts)
      .catch(() => toast.error("Failed to load products"));
  }, []);

  const updateItem = (index, changes) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  };

  const handleProductSelect = (index, productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) {
      updateItem(index, { product: "", name: "", sku: "", price: 0 });
      return;
    }
    updateItem(index, { product: product._id, name: product.name, sku: product.sku, price: product.price || 0 });
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem]);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
  const taxAmount = (subtotal * (Number(form.taxRate) || 0)) / 100;
  const total = subtotal + taxAmount - (Number(form.discount) || 0);

  const handleSubmit = async () => {
    if (!form.customerName || !form.dueDate || items.some((i) => !i.name || !i.quantity)) {
      toast.error("Fill in customer name, due date, and all item fields");
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form, items };
      if (invoice) {
        await updateInvoice(invoice._id, payload);
        toast.success("Invoice updated");
      } else {
        await createInvoice(payload);
        toast.success("Invoice created");
      }
      onSaved();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-(--border-color) sticky top-0 bg-(--bg-card)">
          <h2 className="text-lg font-bold text-(--text-white)">{invoice ? "Edit Invoice" : "New Invoice"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-(--bg-dark) text-(--text-gray) cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Customer Name">
              <input className={inputClasses} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </Field>
            <Field label="Customer Email">
              <input className={inputClasses} value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input className={inputClasses} value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
            </Field>
            <Field label="Due Date">
              <input type="date" className={inputClasses} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
            <Field label="Address">
              <input className={inputClasses} value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} />
            </Field>
            <Field label="Status">
              <select className={inputClasses} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {["Draft", "Unpaid", "Paid", "Overdue"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-wide text-(--text-gray) uppercase">Items</p>
              <button onClick={addItem} className="flex items-center gap-1.5 text-sm text-(--primary-purple) font-medium cursor-pointer">
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 bg-(--bg-dark) border border-(--border-color) rounded-xl p-3">
                  <select
                    className={`${inputClasses} sm:flex-1`}
                    value={item.product}
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className={`${inputClasses} sm:w-24`}
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 0 })}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    className={`${inputClasses} sm:w-28`}
                    value={item.price}
                    onChange={(e) => updateItem(index, { price: parseFloat(e.target.value) || 0 })}
                  />
                  <div className="flex items-center gap-2 sm:w-28">
                    <span className="text-sm text-(--text-white) font-medium">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</span>
                  </div>
                  <button onClick={() => removeItem(index)} className="p-2 rounded-lg hover:bg-(--bg-card) text-(--text-gray) hover:text-rose-500 cursor-pointer shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Tax Rate (%)">
              <input type="number" step="0.1" className={inputClasses} value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })} />
            </Field>
            <Field label="Discount ($)">
              <input type="number" step="0.01" className={inputClasses} value={form.discount} onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })} />
            </Field>
          </div>

          <Field label="Notes">
            <textarea rows={2} className={inputClasses} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>

          <div className="border-t border-(--border-color) pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-(--text-gray)">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-(--text-gray)">
              <span>Tax</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-(--text-gray)">
              <span>Discount</span>
              <span>-${(Number(form.discount) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-(--text-white) font-bold text-base pt-1.5 border-t border-(--border-color)">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-(--border-color) sticky bottom-0 bg-(--bg-card)">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-sm text-(--text-gray) hover:text-(--text-white) cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {invoice ? "Update Invoice" : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;