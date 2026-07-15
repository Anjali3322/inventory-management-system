import { useState, useEffect, useRef } from "react";
import { FiSearch, FiBell, FiMoon, FiSun, FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom"; 

const Navbar = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/categories": return "Categories";
      case "/products": return "Products";
      case "/inventory": return "Inventory";
      case "/brands": return "Brands";
      case "/suppliers": return "Suppliers";
      case "/users": return "Users";
      case "/settings": return "Settings";
      default: return "Dashboard";
    }
  };

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return {
          name: parsed.name || "User",
          email: parsed.email || "No Email Found", 
          role: parsed.role || "Admin",
          hasNotifications: true,
        };
      }
    } catch (e) {
      console.error("Error parsing user data from localStorage", e);
    }
    return {
      name: "User",
      email: "No Email Found",
      role: "Admin",
      hasNotifications: true,
    };
  });

  const getInitials = (name) => {
    if (!name || name === "User") return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to logout from the current session?");
    if (confirmLogout) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      sessionStorage.clear();
      setDropdownOpen(false);
      navigate("/login");
    }
  };

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111820] px-6 py-3 transition-colors duration-200">
      
      <div className="flex flex-1 items-center gap-6">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 min-w-30">
          {getPageTitle()}
        </h1>

        <div className="relative w-full max-w-md hidden sm:block">
          <FiSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Dashboard..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2.5 pr-4 pl-11 text-[14px] text-slate-700 dark:text-slate-200 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 dark:focus:border-slate-700 focus:bg-white dark:focus:bg-[#111820]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FiSun size={20} className="text-amber-500" /> : <FiMoon size={20} />}
        </button>

        <button className="relative rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
          <FiBell size={20} />
          {currentUser.hasNotifications && (
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#111820]" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block" />

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-[14px] font-bold text-white tracking-wider shadow-sm transition-transform active:scale-95">
              {getInitials(currentUser.name)}
            </div>

            <div className="flex items-center gap-1.5 hidden xs:flex">
              <span className="text-[14px] font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {currentUser.name}
              </span>
              <FiChevronDown 
                size={16} 
                className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} 
              />
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3.5 w-64 origin-top-right rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#1a222d] p-1.5 shadow-xl ring-1 ring-black/5 z-999">
              
              <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400/80 font-medium truncate mt-0.5">
                  {currentUser.email}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-2">
                  {currentUser.role}
                </span>
              </div>

              <button 
                onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-left text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <FiUser size={16} className="text-slate-400" />
                Profile
              </button>

              <button 
                onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-left text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <FiSettings size={16} className="text-slate-400" />
                Settings
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800/60" />

              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-left text-[14px] font-semibold text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 transition-all cursor-pointer"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;