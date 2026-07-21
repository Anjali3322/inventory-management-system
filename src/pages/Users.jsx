import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import UserModal from "../components/UserModal";
import Tables from "../components/Tables";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";

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

// Crash-proof getInitials function
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  
  const trimmedName = name.trim();
  if (!trimmedName) return "?";

  const parts = trimmedName.split(" ");
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return trimmedName.slice(0, 2).toUpperCase();
};

// Database lowercase strings se align kiya gaya role configurations
const roleStyles = {
  admin: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20",
  manager: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
  employee: "bg-slate-500/10 text-slate-400 dark:bg-slate-500/20",
  staff: "bg-slate-500/10 text-slate-400 dark:bg-slate-500/20", // Double layer safety fallback
};

const Users = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers(currentPage, itemsPerPage, search);
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchUsers]);

  const handleEdit = (item) => {
    setSelectedUser(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete the selected item.");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser._id, formData);
      } else {
        await createUser(formData);
        setCurrentPage(1);
      }
      setOpenModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.message);
    }
  };

  const columns = ["USER", "EMAIL", "PHONE", "ROLE", "STATUS", "LAST LOGIN", "ACTIONS"];

  const renderUserRow = (item, index) => {
    // DB values schema handle karne ke liye fallbacks aur key extraction
    const currentUsername = item.username || item.name || "Unknown User";
    const currentRole = item.role ? item.role.toLowerCase() : "employee";

    return (
      <tr key={item._id} className="hover:bg-(--bg-dark)/30 transition-colors border-t border-(--border-color)/60">
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 flex items-center justify-center rounded-full text-[13px] font-bold text-white shrink-0 ${avatarColors[index % avatarColors.length]}`}>
              {getInitials(currentUsername)}
            </div>
            <span className="font-semibold text-(--text-white)">{currentUsername}</span>
          </div>
        </td>
        <td className="py-4 px-6 text-(--primary-purple) font-medium">{item.email || "N/A"}</td>
        <td className="py-4 px-6 text-(--text-gray) text-[13px]">{item.phone || "N/A"}</td>
        <td className="py-4 px-6">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium transition-all ${roleStyles[currentRole] || "bg-slate-500/10 text-slate-400"}`}>
            {item.role || "Employee"}
          </span>
        </td>
        <td className="py-4 px-6">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium transition-all ${
            item.status === "Active"
              ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
              : "bg-slate-500/10 text-slate-400 dark:bg-slate-500/20"
          }`}>
            {item.status || "Inactive"}
          </span>
        </td>
        <td className="py-4 px-6 text-(--text-gray) text-[13px]">{item.lastLogin || "Never"}</td>
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
  };

  return (
    <div className="p-8 bg-(--bg-dark) min-h-screen font-sans transition-colors duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-white)">Users</h1>
          <p className="text-sm text-(--text-gray) mt-0.5">{totalItems} users registered</p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-[14px] shadow-sm transition-all cursor-pointer"
        >
          <FiPlus size={16} className="stroke-3" />
          Add User
        </button>
      </div>

      <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-(--border-color)">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-(--text-gray)" />
            <input
              type="text"
              placeholder="Search users..."
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
              Loading user records from Database...
            </div>
          ) : (
            <Tables columns={columns} data={users} renderRow={renderUserRow} />
          )}
        </div>

        <div className="p-4 px-6 border-t border-(--border-color) flex items-center justify-between text-(--text-gray) text-[13px] font-medium">
          <div>
            Showing {users.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
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

      <UserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
};

export default Users;