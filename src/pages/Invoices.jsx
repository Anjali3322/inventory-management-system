import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus, Search, Eye, Pencil, Trash2, DollarSign, Wallet, AlertTriangle, FileText } from "lucide-react";
import { getInvoices, getInvoiceSummary, deleteInvoice, updateInvoiceStatus } from "../api/invoiceApi";
import InvoiceModal from "../components/InvoiceModal";
import InvoiceViewModal from "../components/InvoiceViewModal";

const statusStyles = {
  Paid: "bg-emerald-500/10 text-emerald-500",
  Unpaid: "bg-amber-500/10 text-amber-500",
  Overdue: "bg-rose-500/10 text-rose-500",
  Draft: "bg-slate-500/10 text-slate-400",
};

const avatarColors = ["bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-blue-500", "bg-indigo-500", "bg-orange-500"];

const getInitials = (name) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const filters = ["All", "Draft", "Unpaid", "Paid", "Overdue"];

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (search) params.search = search;

      const [invoiceData, summaryData] = await Promise.all([getInvoices(params), getInvoiceSummary()]);
      setInvoices(invoiceData);
      setSummary(summaryData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this invoice? Stock will be restored.");
    if (!confirmDelete) return;
    try {
      await deleteInvoice(id);
      toast.success("Invoice deleted");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateInvoiceStatus(id, status);
      toast.success("Status updated");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openCreate = () => {
    setEditInvoice(null);
    setModalOpen(true);
  };

  const openEdit = (invoice) => {
    setEditInvoice(invoice);
    setModalOpen(true);
  };

  const cards = [
    { label: "Total Revenue", value: `$${(summary?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "bg-emerald-500" },
    { label: "Outstanding", value: `$${(summary?.outstanding ?? 0).toLocaleString()}`, icon: Wallet, color: "bg-amber-500" },
    { label: "Overdue", value: summary?.overdueCount ?? 0, icon: AlertTriangle, color: "bg-rose-500" },
    { label: "Total Invoices", value: summary?.totalInvoices ?? 0, icon: FileText, color: "bg-(--primary-purple)" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-(--bg-dark) min-h-screen font-sans transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-white)">Invoices</h1>
          <p className="text-sm text-(--text-gray) mt-0.5">{summary?.totalInvoices ?? 0} invoices total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} className="stroke-3" />
          New Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-(--bg-card) border border-(--border-color) rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className={`h-11 w-11 rounded-xl ${card.color} flex items-center justify-center text-white shadow-sm shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-(--text-white)">{card.value}</h3>
                <p className="text-sm text-(--text-gray) mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-gray)" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-full bg-(--bg-dark) border border-(--border-color) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--text-white) placeholder-slate-500 focus:outline-none focus:border-(--primary-purple) transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-(--bg-dark) border border-(--border-color) rounded-xl p-1 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === f ? "bg-(--bg-card) text-(--text-white) shadow-sm" : "text-(--text-gray) hover:text-(--text-white)"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-(--text-gray) py-10">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="text-center text-(--text-gray) py-10">No invoices found</p>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="text-left text-(--text-gray) border-b border-(--border-color) uppercase text-xs">
                  <th className="pb-3 font-medium">Invoice #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Issue Date</th>
                  <th className="pb-3 font-medium">Due Date</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={invoice._id} className="border-b border-(--border-color) last:border-0">
                    <td className="py-3.5 font-semibold text-(--primary-purple)">{invoice.invoiceNumber}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                          {getInitials(invoice.customerName)}
                        </div>
                        <div>
                          <p className="text-(--text-white) font-medium">{invoice.customerName}</p>
                          <p className="text-xs text-(--text-gray)">{invoice.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-(--text-gray)">{new Date(invoice.issueDate).toLocaleDateString("en-CA")}</td>
                    <td className={`py-3.5 ${invoice.status === "Overdue" ? "text-rose-500 font-medium" : "text-(--text-gray)"}`}>
                      {new Date(invoice.dueDate).toLocaleDateString("en-CA")}
                    </td>
                    <td className="py-3.5 text-(--text-gray)">{invoice.items.length} items</td>
                    <td className="py-3.5 text-(--text-white) font-semibold">${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-3.5">
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${statusStyles[invoice.status]}`}
                      >
                        {filters.slice(1).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewInvoice(invoice)} className="p-2 rounded-lg hover:bg-(--bg-dark) text-(--text-gray) hover:text-(--primary-purple) cursor-pointer">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openEdit(invoice)} className="p-2 rounded-lg hover:bg-(--bg-dark) text-(--text-gray) hover:text-(--primary-purple) cursor-pointer">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(invoice._id)} className="p-2 rounded-lg hover:bg-(--bg-dark) text-(--text-gray) hover:text-rose-500 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <InvoiceModal
          invoice={editInvoice}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            fetchData();
          }}
        />
      )}

      {viewInvoice && <InvoiceViewModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />}
    </div>
  );
};

export default Invoices;