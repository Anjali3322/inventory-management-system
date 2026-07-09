import { useState } from "react";
import { LayoutDashboard, Tags, Boxes, Package, Award, 
  Truck, Users, Settings, Moon, ChevronLeft, 
  LogOut, Search, Box} from "lucide-react";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Categories", icon: Tags },
    { name: "Products", icon: Boxes },
    { name: "Inventory", icon: Package },
    { name: "Brands", icon: Award },
    { name: "Suppliers", icon: Truck },
    { name: "Users", icon: Users },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className="w-65 h-screen bg-(--bg-dark) flex flex-col justify-between p-4 text-(--text-gray) font-sans border-r border-(--border-color)">
      
      <div className="flex flex-col gap-6">
      
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-10 h-10 rounded-xl bg-(--primary-purple) flex items-center justify-center text-white shadow-lg">
            <Box size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-(--text-white) font-bold text-lg leading-tight tracking-wide">Inventra</h2>
            <p className="text-xs text-(--text-gray) font-medium opacity-80">Management System</p>
          </div>
        </div>

        <div className="relative mx-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search menu..." 
            className="w-full bg-[#1e293b]/40 border border-(--border-color) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--text-white) placeholder-slate-500 focus:outline-none focus:border-(--primary-purple) transition-all"
          />
        </div>

        <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[50vh] pr-1 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer w-full text-left
                  ${isActive 
                    ? "bg-(--primary-purple) text-(--text-white) font-semibold shadow-md shadow-[#5B4CF7]/20" 
                    : "hover:bg-[#1e293b]/50 hover:text-(--text-white)"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-(--border-color)/60 pt-4 mb-2">
        <button className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-[#1e293b]/50 hover:text-(--text-white) transition-all text-left w-full cursor-pointer">
          <Moon size={20} className="text-slate-400" />
          Dark Mode
        </button>

        <button className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-[#1e293b]/50 hover:text-(--text-white) transition-all text-left w-full cursor-pointer">
          <ChevronLeft size={20} className="text-slate-400" />
          Collapse
        </button>

        <button className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left w-full mt-1 cursor-pointer">
          <LogOut size={20} className="text-red-400" />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;