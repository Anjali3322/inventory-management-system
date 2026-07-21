// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// const Layout = ({ children }) => {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [globalSearch, setGlobalSearch] = useState("");

//   const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
//   const closeMobileSidebar = () => setIsMobileOpen(false);

//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F17]">
      
//       <Sidebar isMobileOpen={isMobileOpen} closeMobileSidebar={closeMobileSidebar} />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <Navbar 
//           toggleMobileSidebar={toggleMobileSidebar} 
//           onSearch={setGlobalSearch} 
//         />
        
//         <main className="flex-1 overflow-y-auto p-6">
          
//           {typeof children === "function" ? children(globalSearch) : children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F17]">
      <Sidebar isMobileOpen={isMobileOpen} closeMobileSidebar={closeMobileSidebar} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar toggleMobileSidebar={toggleMobileSidebar} onSearch={setGlobalSearch} />
        <main className="flex-1 overflow-y-auto p-6">
          {typeof children === "function" ? children(globalSearch) : children}
        </main>
      </div>
    </div>
  );
};

export default Layout;