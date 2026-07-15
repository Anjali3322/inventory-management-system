import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiDownload, FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StockModal from "../components/StockModal";
import Tables from "../components/Tables";
import { getInventory, updateStock } from "../api/inventoryApi";

const avatarColors = [
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-600",
  "bg-cyan-500",
  "bg-pink-500",
];

const getInitials = (name) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const statusStyles = {
  "OK": "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
  "Low Stock": "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
  "Out of Stock": "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20",
};

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 6;

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInventory(currentPage, itemsPerPage, search);
      setInventory(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventory();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchInventory]);

  const handleEdit = (item) => {
    setSelectedProduct(item);
    setOpenModal(true);
  };

  const handleSave = async (formData) => {
    try {
      await updateStock(selectedProduct._id, formData);
      setOpenModal(false);
      fetchInventory();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleExport = () => {
    const headers = ["Product", "SKU", "Category", "In Stock", "Min Stock", "Unit", "Stock Status"];
    const rows = inventory.map((item) => [
      item.name,
      item.sku,
      item.category,
      item.quantity,
      item.minStock,
      item.unit,
      item.stockStatus,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = ["PRODUCT", "SKU", "CATEGORY", "IN STOCK", "MIN STOCK", "UNIT", "STOCK STATUS", "ACTIONS"];

  const renderInventoryRow = (item, index) => (
    <tr key={item._id} className="hover:bg-[var(--bg-dark)]/30 transition-colors border-t border-[var(--border-color)]/60">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 flex items-center justify-center rounded-full text-[13px] font-bold text-white shrink-0 ${avatarColors[index % avatarColors.length]}`}>
            {getInitials(item.name)}
          </div>
          <span className="font-semibold text-[var(--text-white)]">{item.name}</span>
        </div>
      </td>
      <td className="py-4 px-6 font-medium text-[var(--text-gray)] text-[13px]">{item.sku}</td>
      <td className="py-4 px-6 text-[var(--primary-purple)] font-medium">{item.category}</td>
      <td className={`py-4 px-6 font-semibold ${item.stockStatus === "Low Stock" ? "text-amber-500" : item.stockStatus === "Out of Stock" ? "text-rose-500" : "text-emerald-500"}`}>
        {item.quantity}
      </td>
      <td className="py-4 px-6 text-[var(--text-gray)]">{item.minStock}</td>
      <td className="py-4 px-6 text-[var(--text-gray)]">{item.unit}</td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium transition-all ${statusStyles[item.stockStatus]}`}>
          {item.stockStatus}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-center text-[var(--text-gray)]">
          <button
            onClick={() => handleEdit(item)}
            className="hover:text-[var(--primary-purple)] transition-colors p-1 cursor-pointer"
          >
            <FiEdit2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 bg-[var(--bg-dark)] min-h-screen font-sans transition-colors duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-white)]">Inventory</h1>
          <p className="text-sm text-[var(--text-gray)] mt-0.5">Stock levels and availability</p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--primary-purple)]/10 text-[var(--primary-purple)] px-5 py-2.5 rounded-xl font-medium text-[14px] shadow-sm transition-all cursor-pointer"
        >
          <FiDownload size={16} />
          Export
        </button>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-[var(--border-color)]">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--text-gray)]" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl bg-[var(--bg-dark)]/40 border border-[var(--border-color)] py-2.5 pr-4 pl-11 text-[14px] text-[var(--text-white)] outline-none placeholder:text-[var(--text-gray)]/60 focus:border-[var(--primary-purple)] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-[var(--text-gray)] font-medium">
              Loading inventory records from Database...
            </div>
          ) : (
            <Tables columns={columns} data={inventory} renderRow={renderInventoryRow} />
          )}
        </div>

        <div className="p-4 px-6 border-t border-[var(--border-color)] flex items-center justify-between text-[var(--text-gray)] text-[13px] font-medium">
          <div>
            Showing {inventory.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`p-1.5 rounded-lg border border-[var(--border-color)] transition-all ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed text-slate-500"
                  : "hover:bg-[var(--bg-dark)]/40 cursor-pointer text-[var(--text-white)]"
              }`}
            >
              <FiChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-7 w-7 flex items-center justify-center rounded-lg font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[var(--primary-purple)] text-white shadow-sm"
                      : "hover:bg-[var(--bg-dark)]/40 text-[var(--text-gray)]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`p-1.5 rounded-lg border border-[var(--border-color)] transition-all ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed text-slate-500"
                  : "hover:bg-[var(--bg-dark)]/40 cursor-pointer text-[var(--text-white)]"
              }`}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <StockModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={selectedProduct}
        onSave={handleSave}
      />
    </div>
  );
};

export default Inventory;