import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiX, FiUploadCloud, FiTrash } from "react-icons/fi";

const Products = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantsList, setVariantsList] = useState([]);
  const [variantForm, setVariantForm] = useState({
    variantName: "", 
    variantValue: "", 
    additionalPrice: 0,
    stockCount: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    unit: "pcs",
    description: "",
    status: "Active"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${search}&category=${selectedCategory}`
      );
      
      if (!response.ok) throw new Error("Failed to pipeline data from Server");
      
      const data = await response.json();
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Database parsing error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, selectedCategory]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: `PRD-${Math.floor(1000 + Math.random() * 9000)}`, 
      category: "",
      supplier: "",
      purchasePrice: 0,
      sellingPrice: 0,
      quantity: 0,
      unit: "pcs",
      description: "",
      status: "Active"
    });
    setVariantsList([]);
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setFormData({
      name: item.name || "",
      sku: item.sku || "",
      category: item.category || "",
      supplier: item.supplier || "",
      purchasePrice: item.purchasePrice || 0,
      sellingPrice: item.sellingPrice || 0,
      quantity: item.quantity || 0,
      unit: item.unit || "pcs",
      description: item.description || "",
      status: item.status || "Active"
    });
    setVariantsList(item.variants || []);
    setCurrentProductId(item._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddVariantClick = () => {
    setVariantForm({ variantName: "", variantValue: "", additionalPrice: 0, stockCount: formData.quantity });
    setIsVariantModalOpen(true);
  };

  const saveVariantToList = (e) => {
    e.preventDefault();
    if (!variantForm.variantName || !variantForm.variantValue) {
      alert("Please fill name and option parameter values.");
      return;
    }
    setVariantsList([...variantsList, variantForm]);
    setIsVariantModalOpen(false);
  };

  const removeVariantFromList = (indexToRemove) => {
    setVariantsList(variantsList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert("Please select a Category from drop-down before saving!");
      return;
    }

    const payload = {
      ...formData,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      quantity: Number(formData.quantity) || 0,
      variants: variantsList 
    };

    try {
      const url = isEditing 
        ? `http://localhost:5000/api/products/${currentProductId}`
        : "http://localhost:5000/api/products";
      
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchProducts(); 
      } else {
        const errResult = await response.json();
        alert(`Failed to save: ${errResult.message || "Server rejected parameters workflow."}`);
      }
    } catch (error) {
      console.error("Data pipeline submission lifecycle failure:", error);
      alert("Backend network cluster unreachable. Verify terminal instance is up.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to completely erase this product?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchProducts();
    } catch (error) {
      console.error("Deletion lifecycle failure:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "PR";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarBg = (initials) => {
    const charCodeSum = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    const colors = ["bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-sky-500", "bg-purple-500", "bg-indigo-500"];
    return colors[charCodeSum % colors.length];
  };

  return (
    <div className="p-4 md:p-8 bg-[var(--bg-dark)] min-h-screen font-sans transition-colors duration-200">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-white)] tracking-tight">Products</h1>
          <p className="text-sm text-[var(--text-gray)] mt-0.5">{totalItems} products in inventory</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--primary-purple)] hover:bg-[var(--hover-purple)] text-white px-5 py-2.5 rounded-xl font-medium text-[14px] shadow-sm transition-all cursor-pointer"
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden transition-all">
        
        <div className="p-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <FiSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--text-gray)]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl bg-[var(--bg-dark)]/40 border border-[var(--border-color)] py-2.5 pr-4 pl-11 text-[14px] text-[var(--text-white)] outline-none placeholder:text-[var(--text-gray)]/60 focus:border-[var(--primary-purple)] transition-all"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl bg-[var(--bg-dark)]/40 border border-[var(--border-color)] px-4 py-2.5 text-[14px] text-[var(--text-white)] outline-none focus:border-[var(--primary-purple)] cursor-pointer transition-all appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="All" className="bg-[#1e293b]">All</option>
              <option value="Electronics" className="bg-[#1e293b]">Electronics</option>
              <option value="Clothing & Apparel" className="bg-[#1e293b]">Clothing & Apparel</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto invisible-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[11px] font-bold tracking-wider text-[var(--text-gray)] bg-[var(--bg-dark)]/20">
                <th className="py-4 px-6 w-16 text-center">INITIAL</th>
                <th className="py-4 px-4">SKU</th>
                <th className="py-4 px-6">PRODUCT NAME</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">SUPPLIER</th>
                <th className="py-4 px-6">PURCHASE</th>
                <th className="py-4 px-6">SELLING</th>
                <th className="py-4 px-6 text-center">QTY</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[var(--border-color)]/60 text-[14px]">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-[var(--text-gray)] font-medium">Syncing product parameters from core cluster...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-[var(--text-gray)] font-medium">No active inventory records found.</td>
                </tr>
              ) : (
                products.map((item) => {
                  const initials = getInitials(item.name);
                  const avatarBg = getAvatarBg(initials);
                  
                  return (
                    <tr key={item._id} className="hover:bg-[var(--bg-dark)]/30 transition-colors">
                      <td className="py-3 px-6 text-center">
                        <div className={`w-8 h-8 rounded-lg ${avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>{initials}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-[var(--text-gray)] text-[12px] tracking-mono">{item.sku}</td>
                      <td className="py-3 px-6 font-semibold text-[var(--text-white)]">{item.name}</td>
                      <td className="py-3 px-6 text-[var(--text-gray)] font-medium">{item.category}</td>
                      <td className="py-3 px-6 text-[var(--text-gray)] opacity-90">{item.supplier || "—"}</td>
                      <td className="py-3 px-6 text-[var(--text-white)] font-medium">${item.purchasePrice}</td>
                      <td className="py-3 px-6 text-[var(--text-white)] font-semibold">${item.sellingPrice}</td>
                      <td className="py-3 px-6 text-center text-[var(--text-gray)] font-bold">{item.quantity}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-all ${
                          item.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : item.status === "Low Stock" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                        }`}>{item.status}</span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-3.5 text-[var(--text-gray)]">
                          <button onClick={() => handleOpenEditModal(item)} className="hover:text-[var(--primary-purple)] transition-colors p-1 cursor-pointer"><FiEdit2 size={14} /></button>
                          <button onClick={() => handleDelete(item._id)} className="hover:text-red-500 transition-colors p-1 cursor-pointer"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row gap-4 items-center justify-between text-[var(--text-gray)] text-[13px] font-medium">
          <div>Showing {products.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}</div>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className={`p-1.5 rounded-lg border border-[var(--border-color)] transition-all ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-[var(--bg-dark)]/40 cursor-pointer text-[var(--text-white)]"}`}><FiChevronLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`h-7 w-7 flex items-center justify-center rounded-lg font-semibold transition-all cursor-pointer ${index + 1 === currentPage ? "bg-[var(--primary-purple)] text-white shadow-sm" : "hover:bg-[var(--bg-dark)]/40 text-[var(--text-gray)]"}`}>{index + 1}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className={`p-1.5 rounded-lg border border-[var(--border-color)] transition-all ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-[var(--bg-dark)]/40 cursor-pointer text-[var(--text-white)]"}`}><FiChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{isEditing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"><FiX size={18} /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-400 uppercase">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Product Name <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder='e.g. MacBook Pro 14"' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg normal-case font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"/>
                </div>
                <div className="space-y-1.5">
                  <label>SKU</label>
                  <input type="text" placeholder="PRD-021" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Category <span className="text-red-500">*</span></label>
                  <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all cursor-pointer">
                    <option value="" disabled>Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing & Apparel">Clothing & Apparel</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Supplier</label>
                  <input type="text" placeholder="Supplier name" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg normal-case font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Purchase Price ($)</label>
                  <input type="number" min="0" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"/>
                </div>
                <div className="space-y-1.5">
                  <label>Selling Price ($)</label>
                  <input type="number" min="0" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Quantity</label>
                  <input type="number" min="0" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"/>
                </div>
                <div className="space-y-1.5">
                  <label>Unit</label>
                  <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all cursor-pointer">
                    <option value="pcs">pcs</option>
                    <option value="box">box</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Description</label>
                <textarea rows="2" placeholder="Product description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg normal-case font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all resize-none"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Image Upload</label>
                  <div className="w-full bg-slate-50 dark:bg-[#0F172A] border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 p-2.5 rounded-lg flex items-center justify-center gap-2 normal-case font-medium hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer">
                    <FiUploadCloud size={16} />
                    <span className="text-xs">Click to upload image</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px]">Product Variants ({variantsList.length})</label>
                  <button type="button" onClick={handleAddVariantClick} className="text-[var(--primary-purple)] text-[11px] font-bold lowercase hover:underline cursor-pointer">+ Add Variant</button>
                </div>

                {variantsList.length === 0 ? (
                  <div className="w-full border border-dashed border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-center normal-case text-slate-400 text-xs font-medium">
                    No variants — this is a single-variant product
                  </div>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto normal-case font-medium text-slate-600 dark:text-slate-200">
                    {variantsList.map((v, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-xs">
                        <span><strong>{v.variantName}:</strong> {v.variantValue} (+${v.additionalPrice}) — {v.stockCount} in stock</span>
                        <button type="button" onClick={() => removeVariantFromList(idx)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer"><FiTrash size={14}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 uppercase">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-medium text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-[var(--primary-purple)] hover:bg-[var(--hover-purple)] text-white rounded-xl font-medium text-xs shadow-md transition-all cursor-pointer">
                  {isEditing ? "Save Changes" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isVariantModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Configure Variant Parameter</h3>
              <button type="button" onClick={() => setIsVariantModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"><FiX size={16}/></button>
            </div>

            <form onSubmit={saveVariantToList} className="space-y-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <div className="space-y-1">
                <label>Variant Type</label>
                <input type="text" required placeholder="e.g. Color, Size, Storage" value={variantForm.variantName} onChange={(e) => setVariantForm({...variantForm, variantName: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-2.5 rounded-lg normal-case font-medium focus:outline-none"/>
              </div>

              <div className="space-y-1">
                <label>Value / Option</label>
                <input type="text" required placeholder="e.g. Red, XL, 256GB" value={variantForm.variantValue} onChange={(e) => setVariantForm({...variantForm, variantValue: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-2.5 rounded-lg normal-case font-medium focus:outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Extra Price ($)</label>
                  <input type="number" min="0" value={variantForm.additionalPrice} onChange={(e) => setVariantForm({...variantForm, additionalPrice: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-2.5 rounded-lg font-medium focus:outline-none"/>
                </div>
                <div className="space-y-1">
                  <label>Stock Count</label>
                  <input type="number" min="0" value={variantForm.stockCount} onChange={(e) => setVariantForm({...variantForm, stockCount: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-2.5 rounded-lg font-medium focus:outline-none"/>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button type="button" onClick={() => setIsVariantModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary-purple)] text-white rounded-lg shadow-md cursor-pointer">Add to Form</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Products;