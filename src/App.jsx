import { Routes, Route, Navigate } from "react-router-dom"; 
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products"; 
import Brands from "./pages/Brands";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings"; 
import Invoices from "./pages/Invoices";  
import { ThemeProvider } from "./context/ThemeContext";

const DashboardLayout = () => {
  const isAuthenticated = localStorage.getItem("userToken") || localStorage.getItem("user");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-[#f8fafc] dark:bg-[#0b0f19] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/categories" element={<Categories />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/users" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/settings" element={<Settings />} />   
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() { 
  return (
     <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;