import { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Briefcase, DollarSign, AlertTriangle, Truck, Plus } from "lucide-react";
import SalesModal from "../components/SalesModal";
import { getDashboardSummary, saveSales } from "../api/dashboardApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const getInitials = (name) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const alertColors = ["bg-blue-500", "bg-indigo-500", "bg-orange-500", "bg-emerald-500", "bg-rose-500"];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary(new Date().getFullYear());
      setSummary(data);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleSaveSales = async (formData) => {
    try {
      await saveSales(formData);
      setOpenModal(false);
      fetchSummary();
    } catch (error) {
      console.error("Error saving sales:", error);
      alert(error.message);
    }
  };

  if (loading || !summary) {
    return (
      <div className="p-8 bg-(--bg-dark) min-h-screen flex items-center justify-center text-(--text-gray) font-medium">
        Loading dashboard...
      </div>
    );
  }

  const chartData = {
    labels: summary.revenueOverview.map((r) => r.month),
    datasets: [
      {
        label: "Revenue",
        data: summary.revenueOverview.map((r) => r.revenue),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.08)",
        pointBackgroundColor: "#6366f1",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: summary.revenueOverview.map((r) => r.expenses),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        pointBackgroundColor: "#10b981",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 12 } },
      },
      y: {
        grid: { color: "rgba(148, 163, 184, 0.15)" },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          callback: (value) => `$${value / 1000}k`,
        },
      },
    },
  };

  const cards = [
    {
      label: "Total Products",
      value: summary.totalProducts,
      change: `${summary.productsChange >= 0 ? "+" : ""}${summary.productsChange}%`,
      positive: summary.productsChange >= 0,
      icon: Briefcase,
      color: "bg-[var(--primary-purple)]",
    },
    {
      label: "Monthly Sales",
      value: `$${(summary.monthlySales / 1000).toFixed(1)}k`,
      change: `${summary.salesChange >= 0 ? "+" : ""}${summary.salesChange}%`,
      positive: summary.salesChange >= 0,
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      label: "Low Stock Items",
      value: summary.lowStockItems,
      change: summary.lowStockItems > 0 ? "Needs attention" : "All good",
      positive: summary.lowStockItems === 0,
      icon: AlertTriangle,
      color: "bg-amber-500",
    },
    {
      label: "Active Suppliers",
      value: summary.activeSuppliers,
      change: summary.suppliersThisMonth > 0 ? `+${summary.suppliersThisMonth} New` : "Same",
      positive: true,
      icon: Truck,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="p-8 bg-(--bg-dark) min-h-screen font-sans transition-colors duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-white)">Dashboard</h1>
          <p className="text-sm text-(--text-gray) mt-0.5">Welcome back — here's what's happening today.</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-[14px] shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} className="stroke-3" />
          Update Sales
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-(--bg-card) border border-(--border-color) rounded-2xl p-5 shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`h-10 w-10 rounded-xl ${card.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon size={18} />
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                    card.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-(--text-white)">{card.value}</h3>
              <p className="text-sm text-(--text-gray) mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-(--bg-card) border border-(--border-color) rounded-2xl p-6 shadow-sm transition-all">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-(--text-white)">Revenue Overview</h2>
              <p className="text-sm text-(--text-gray) mt-0.5">Revenue vs expenses — full year {new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-4 text-[13px] font-medium text-(--text-gray)">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" /> Expenses
              </span>
            </div>
          </div>
          <div className="h-75">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl p-6 shadow-sm transition-all">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-(--text-white)">Low Stock Alerts</h2>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">
              {summary.lowStockAlerts.length} items
            </span>
          </div>

          {summary.lowStockAlerts.length === 0 ? (
            <p className="text-sm text-(--text-gray) text-center py-8">All stock levels are healthy.</p>
          ) : (
            <div className="space-y-4">
              {summary.lowStockAlerts.map((item, index) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 flex items-center justify-center rounded-full text-[12px] font-bold text-white shrink-0 ${alertColors[index % alertColors.length]}`}>
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-(--text-white)">{item.name}</p>
                      <p className="text-xs text-(--text-gray)">{item.sku}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${item.quantity === 0 ? "text-rose-500" : "text-amber-500"}`}>
                    {item.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SalesModal open={openModal} onClose={() => setOpenModal(false)} onSave={handleSaveSales} />
    </div>
  );
};

export default Dashboard;