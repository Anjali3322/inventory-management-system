// import { useState, useEffect } from "react";
// import { LayoutDashboard, Tags, Boxes, Package, Award, 
//   Truck, Users, Settings, ChevronLeft, ChevronRight, 
//   LogOut, Search, Box, X } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Receipt } from "lucide-react";

// const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [activeMenu, setActiveMenu] = useState("Dashboard");
//   const [showSideBar, setShowSideBar] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const menuItems = [
//     { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
//     { name: "Categories", icon: Tags, path: "/categories" },
//     { name: "Products", icon: Boxes, path: "/products" },
//     { name: "Inventory", icon: Package, path: "/inventory" },
//     { name: "Brands", icon: Award, path: "/brands" },
//     { name: "Suppliers", icon: Truck, path: "/suppliers" },
//     { name: "Users", icon: Users, path: "/users" },
//     { name: "Invoices", icon: Receipt, path: "/invoices" },
//     { name: "Settings", icon: Settings, path: "/settings" },
//   ];

//   useEffect(() => {
//     const currentPath = location.pathname;
//     const matchingMenu = menuItems.find(item => item.path === currentPath);
//     if (matchingMenu) {
//       setActiveMenu(matchingMenu.name);
//     }
//   }, [location.pathname]);

//   const toggleSidebar = () => setShowSideBar((prev) => !prev);

//   const handleLogout = () => {
//     const confirmLogout = window.confirm("Do you wanna Logout?");
//     if (confirmLogout) {
//       localStorage.removeItem("userToken"); 
//       sessionStorage.clear();
//       navigate("/login"); 
//     }
//   };

//   const filteredMenuItems = menuItems.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const tooltipClasses =
//     "absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#1E293B] text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg border border-[#24304F] pointer-events-none";

//   return (
//     <>
//       {/* Mobile Dark Backdrop Overlay */}
//       {isMobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       {/* Sidebar Drawer */}
//       <div 
//         className={`h-screen bg-[#0F172A] border-r border-[#1E293B] flex flex-col justify-between p-4 text-slate-400 font-sans transition-all duration-300 ease-in-out
//           fixed inset-y-0 left-0 lg:sticky lg:top-0 z-50
//           ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
//           ${showSideBar ? "lg:w-64" : "lg:w-20"}`}
//       >
//         <div className="flex flex-col gap-6 overflow-hidden flex-1">
//           <div className="flex items-center justify-between px-2 pt-2 shrink-0">
//             <div className={`flex items-center gap-3 ${(!showSideBar && !isMobileOpen) ? "lg:justify-center w-full" : ""}`}>
//               <div className="w-10 h-10 rounded-xl bg-[#5B4CF7] flex items-center justify-center text-white shadow-lg shrink-0">
//                 <Box size={22} className="stroke-[2.5]" />
//               </div>
//               {(showSideBar || isMobileOpen) && (
//                 <div className="transition-all duration-200">
//                   <h2 className="text-white font-bold text-lg leading-tight tracking-wide">Inventra</h2>
//                   <p className="text-xs text-slate-400 font-medium opacity-80">Management System</p>
//                 </div>
//               )}
//             </div>

//             {isMobileOpen && (
//               <button 
//                 onClick={closeMobileSidebar} 
//                 className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             )}
//           </div>

//           {(showSideBar || isMobileOpen) && (
//             <div className="relative mx-1 shrink-0 transition-all duration-200">
//               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//               <input 
//                 type="text" 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)} 
//                 placeholder="Search menu..." 
//                 className="w-full bg-[#1e293b]/60 border border-[#24304F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5B4CF7] transition-all"
//               />
//             </div>
//           )}

//           <nav className={`flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 ${(showSideBar || isMobileOpen) ? "scrollbar-thin" : "scrollbar-none"}`}>
//             {filteredMenuItems.length > 0 ? (
//               filteredMenuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeMenu === item.name;
                
//                 return (
//                   <button
//                     key={item.name}
//                     onClick={() => {
//                       setActiveMenu(item.name);
//                       navigate(item.path);
//                       if (isMobileOpen) closeMobileSidebar();
//                     }}
//                     className={`relative group flex items-center rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer w-full text-left shrink-0 py-3
//                       ${(showSideBar || isMobileOpen) ? "px-4 gap-3.5" : "justify-center px-0"}
//                       ${isActive 
//                         ? "bg-[#5B4CF7] text-white font-semibold shadow-md shadow-[#5B4CF7]/20" 
//                         : "hover:bg-[#1e293b]/50 hover:text-white"
//                       }`}
//                   >
//                     <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
//                     {(showSideBar || isMobileOpen) && <span className="transition-all duration-200">{item.name}</span>}
//                     {(!showSideBar && !isMobileOpen) && <span className={tooltipClasses}>{item.name}</span>}
//                   </button>
//                 );
//               })
//             ) : (
//               (showSideBar || isMobileOpen) && <p className="text-xs text-slate-500 text-center mt-4">No results found</p>
//             )}
//           </nav>
//         </div>

//         <div className="flex flex-col gap-1 border-t border-[#24304F]/60 pt-4 mb-2 shrink-0">
//           <button 
//             onClick={toggleSidebar}
//             title={!showSideBar ? "Expand" : "Collapse"}
//             className={`hidden lg:flex items-center rounded-xl text-[15px] font-medium hover:bg-[#1e293b]/50 hover:text-white transition-all text-left w-full cursor-pointer py-2.5
//               ${showSideBar ? "px-4 gap-3.5" : "justify-center px-0"}`}
//           >
//             {showSideBar ? (
//               <>
//                 <ChevronLeft size={20} className="text-slate-400" />
//                 <span>Collapse</span>
//               </>
//             ) : (
//               <>
//                 <ChevronRight size={20} className="text-slate-400" />
//               </>
//             )}
//           </button>

//           <button 
//             onClick={handleLogout}
//             className={`relative group flex items-center rounded-xl text-[15px] font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left w-full mt-1 cursor-pointer py-2.5
//               ${(showSideBar || isMobileOpen) ? "px-4 gap-3.5" : "justify-center px-0"}`}
//           >
//             <LogOut size={20} className="text-red-400" />
//             {(showSideBar || isMobileOpen) && <span>Logout</span>}
//             {(!showSideBar && !isMobileOpen) && <span className={tooltipClasses}>Logout</span>}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import { useState, useEffect } from "react";
import { LayoutDashboard, Tags, Boxes, Package, Award,
  Truck, Users, Settings, ChevronLeft, ChevronRight,
  LogOut, Search, Box, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Receipt } from "lucide-react";

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showSideBar, setShowSideBar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Categories", icon: Tags, path: "/categories" },
    { name: "Products", icon: Boxes, path: "/products" },
    { name: "Inventory", icon: Package, path: "/inventory" },
    { name: "Brands", icon: Award, path: "/brands" },
    { name: "Suppliers", icon: Truck, path: "/suppliers" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Invoices", icon: Receipt, path: "/invoices" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingMenu = menuItems.find((item) => item.path === currentPath);
    if (matchingMenu) {
      setActiveMenu(matchingMenu.name);
    }
  }, [location.pathname]);

  const toggleSidebar = () => setShowSideBar((prev) => !prev);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you wanna Logout?");
    if (confirmLogout) {
      localStorage.removeItem("userToken");
      sessionStorage.clear();
      navigate("/login");
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tooltipClasses =
    "absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#1E293B] text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg border border-[#24304F] pointer-events-none";

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      <div
        className={`h-screen bg-[#0F172A] border-r border-[#1E293B] flex flex-col justify-between p-4 text-slate-400 font-sans transition-transform duration-300 ease-in-out
          fixed inset-y-0 left-0 z-50 w-64
          lg:sticky lg:top-0 lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${showSideBar ? "lg:w-64" : "lg:w-20"}`}
      >
        <div className="flex flex-col gap-6 overflow-hidden flex-1">
          <div className="flex items-center justify-between px-2 pt-2 shrink-0">
            <div className={`flex items-center gap-3 ${(!showSideBar && !isMobileOpen) ? "lg:justify-center w-full" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-[#5B4CF7] flex items-center justify-center text-white shadow-lg shrink-0">
                <Box size={22} className="stroke-[2.5]" />
              </div>
              {(showSideBar || isMobileOpen) && (
                <div className="transition-all duration-200">
                  <h2 className="text-white font-bold text-lg leading-tight tracking-wide">Inventra</h2>
                  <p className="text-xs text-slate-400 font-medium opacity-80">Management System</p>
                </div>
              )}
            </div>

            {isMobileOpen && (
              <button
                onClick={closeMobileSidebar}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {(showSideBar || isMobileOpen) && (
            <div className="relative mx-1 shrink-0 transition-all duration-200">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full bg-[#1e293b]/60 border border-[#24304F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5B4CF7] transition-all"
              />
            </div>
          )}

          <nav className={`flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 ${(showSideBar || isMobileOpen) ? "scrollbar-thin" : "scrollbar-none"}`}>
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveMenu(item.name);
                      navigate(item.path);
                      if (isMobileOpen) closeMobileSidebar();
                    }}
                    className={`relative group flex items-center rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer w-full text-left shrink-0 py-3
                      ${(showSideBar || isMobileOpen) ? "px-4 gap-3.5" : "justify-center px-0"}
                      ${isActive
                        ? "bg-[#5B4CF7] text-white font-semibold shadow-md shadow-[#5B4CF7]/20"
                        : "hover:bg-[#1e293b]/50 hover:text-white"
                      }`}
                  >
                    <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                    {(showSideBar || isMobileOpen) && <span className="transition-all duration-200">{item.name}</span>}
                    {(!showSideBar && !isMobileOpen) && <span className={tooltipClasses}>{item.name}</span>}
                  </button>
                );
              })
            ) : (
              (showSideBar || isMobileOpen) && <p className="text-xs text-slate-500 text-center mt-4">No results found</p>
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-[#24304F]/60 pt-4 mb-2 shrink-0">
          <button
            onClick={toggleSidebar}
            title={!showSideBar ? "Expand" : "Collapse"}
            className={`hidden lg:flex items-center rounded-xl text-[15px] font-medium hover:bg-[#1e293b]/50 hover:text-white transition-all text-left w-full cursor-pointer py-2.5
              ${showSideBar ? "px-4 gap-3.5" : "justify-center px-0"}`}
          >
            {showSideBar ? (
              <>
                <ChevronLeft size={20} className="text-slate-400" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronRight size={20} className="text-slate-400" />
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`relative group flex items-center rounded-xl text-[15px] font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left w-full mt-1 cursor-pointer py-2.5
              ${(showSideBar || isMobileOpen) ? "px-4 gap-3.5" : "justify-center px-0"}`}
          >
            <LogOut size={20} className="text-red-400" />
            {(showSideBar || isMobileOpen) && <span>Logout</span>}
            {(!showSideBar && !isMobileOpen) && <span className={tooltipClasses}>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;