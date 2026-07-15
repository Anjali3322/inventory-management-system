import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BrandModal from "../components/BrandModal";
import Tables from "../components/Tables";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../api/brandApi";

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

const getInitial = (name) => name.trim().charAt(0).toUpperCase();

const Brands = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBrands(currentPage, itemsPerPage, search);
      setBrands(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBrands();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchBrands]);

  const handleEdit = (item) => {
    setSelectedBrand(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      await deleteBrand(id);
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete the selected item.");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedBrand) {
        await updateBrand(selectedBrand._id, formData);
      } else {
        await createBrand(formData);
        setCurrentPage(1);
      }
      setOpenModal(false);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert(error.message);
    }
  };

  const columns = ["LOGO", "BRAND NAME", "DESCRIPTION", "PRODUCTS", "STATUS", "ACTIONS"];

  const renderBrandRow = (item, index) => (
    <tr key={item._id} className="hover:bg-[var(--bg-dark)]/30 transition-colors border-t border-[var(--border-color)]/60">
      <td className="py-4 px-6">
        <div className={`h-9 w-9 flex items-center justify-center rounded-full text-[14px] font-bold text-white shrink-0 ${avatarColors[index % avatarColors.length]}`}>
          {getInitial(item.name)}
        </div>
      </td>
      <td className="py-4 px-6 font-semibold text-[var(--text-white)]">{item.name}</td>
      <td className="py-4 px-6 text-[var(--primary-purple)] font-medium">{item.description || "—"}</td>
      <td className="py-4 px-6 text-[var(--text-gray)]">{item.products}</td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium transition-all ${
          item.status === "Active"
            ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
            : "bg-slate-500/10 text-slate-400 dark:bg-slate-500/20"
        }`}>
          {item.status}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-3 text-[var(--text-gray)]">
          <button
            onClick={() => handleEdit(item)}
            className="hover:text-[var(--primary-purple)] transition-colors p-1 cursor-pointer"
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="hover:text-red-500 transition-colors p-1 cursor-pointer"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 bg-[var(--bg-dark)] min-h-screen font-sans transition-colors duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-white)]">Brands</h1>
          <p className="text-sm text-[var(--text-gray)] mt-0.5">{totalItems} brands registered</p>
        </div>

        <button
          onClick={() => {
            setSelectedBrand(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-[var(--primary-purple)] hover:bg-[var(--hover-purple)] text-white px-5 py-2.5 rounded-xl font-medium text-[14px] shadow-sm transition-all cursor-pointer"
        >
          <FiPlus size={16} className="stroke-3" />
          Add Brand
        </button>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-[var(--border-color)]">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--text-gray)]" />
            <input
              type="text"
              placeholder="Search brands..."
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
              Loading brand records from Database...
            </div>
          ) : (
            <Tables columns={columns} data={brands} renderRow={renderBrandRow} />
          )}
        </div>

        <div className="p-4 px-6 border-t border-[var(--border-color)] flex items-center justify-between text-[var(--text-gray)] text-[13px] font-medium">
          <div>
            Showing {brands.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
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
                  : "hover:bg-(--bg-dark)/40 cursor-pointer text-[var(--text-white)]"
              }`}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <BrandModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        brand={selectedBrand}
        onSave={handleSave}
      />
    </div>
  );
};

export default Brands;