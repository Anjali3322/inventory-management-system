import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CategoryModal from "../components/CategoryModal";
import Tables from "../components/Tables"; 
import API_URL from "../api/config";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
      `${API_URL}/api/categories?page=${currentPage}&limit=${itemsPerPage}&search=${search}`
        
      );
      
      
      if (!response.ok) throw new Error("Failed to fetch data from API server");
      
      const data = await response.json();
      
      setCategories(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchCategories]);

  const handleEdit = (item) => {
    setSelectedCategory(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchCategories();
      } else {
        alert("Failed to delete the selected item.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCategory) {
        const response = await fetch(`${API_URL}/api/categories/${selectedCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) fetchCategories();
      } else {
        const response = await fetch(`${API_URL}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        console.log(response.data)
        if (!response.ok) {
          const errData = await response.json();
          alert(errData.message);
          return;
        }
        
        setCurrentPage(1);
        fetchCategories();
      }
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving category document structural schema:", error);
    }
  };

  const columns = ["NAME", "ISIN NUMBER", "DESCRIPTION", "STATUS", "CREATED AT", "ACTIONS"];

  const renderCategoryRow = (item) => (
    <tr key={item._id} className="hover:bg-(--bg-dark)/30 transition-colors border-t border-(--border-color)/60">
      <td className="py-4 px-6 font-semibold text-(--text-white)">{item.name}</td>
      <td className="py-4 px-6 font-medium text-(--text-gray) text-[13px]">{item.isin || "N/A"}</td>
      <td className="py-4 px-6 text-(--text-gray) opacity-90">{item.description || "—"}</td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium transition-all ${
          item.status === "Active" 
            ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20" 
            : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20"
        }`}>
          {item.status}
        </span>
      </td>
      <td className="py-4 px-6 text-(--text-gray) font-medium text-[13px]">{item.date}</td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-3 text-(--text-gray)">
          <button 
            onClick={() => handleEdit(item)}
            className="hover:text-(--primary-purple) transition-colors p-1 cursor-pointer"
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
    <div className="p-8 bg-(--bg-dark) min-h-screen font-sans transition-colors duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-white)">Categories</h1>
          <p className="text-sm text-(--text-gray) mt-0.5">{totalItems} categories total</p>
        </div>
        
        <button
          onClick={() => {
            setSelectedCategory(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-[14px] shadow-sm transition-all cursor-pointer"
        >
          <FiPlus size={16} className="stroke-3" />
          Add Category
        </button>
      </div>

      <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-(--border-color)">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-(--text-gray)" />
            <input
              type="text"
              placeholder="Search categories or ISIN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl bg-(--bg-dark)/40 border border-(--border-color) py-2.5 pr-4 pl-11 text-[14px] text-(--text-white) outline-none placeholder:text-(--text-gray)/60 focus:border-(--primary-purple) transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-(--text-gray) font-medium">
              Loading category records from Database...
            </div>
          ) : (
            <Tables columns={columns} data={categories} renderRow={renderCategoryRow} />
          )}
        </div>

        <div className="p-4 px-6 border-t border-(--border-color) flex items-center justify-between text-(--text-gray) text-[13px] font-medium">
          <div>
            Showing {categories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`p-1.5 rounded-lg border border-(--border-color) transition-all ${
                currentPage === 1 
                  ? "opacity-40 cursor-not-allowed text-slate-500" 
                  : "hover:bg-(--bg-dark)/40 cursor-pointer text-(--text-white)"
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
                      ? "bg-(--primary-purple) text-white shadow-sm"
                      : "hover:bg-(--bg-dark)/40 text-(--text-gray)"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`p-1.5 rounded-lg border border-(--border-color) transition-all ${
                currentPage === totalPages 
                  ? "opacity-40 cursor-not-allowed text-slate-500" 
                  : "hover:bg-(--bg-dark)/40 cursor-pointer text-(--text-white)"
              }`}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <CategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={selectedCategory}
        onSave={handleSave}
      />
    </div>
  );
};

export default Categories;