const BASE_URL = "http://localhost:5000/api/dashboard";

export const getDashboardSummary = async (year) => {
  const response = await fetch(`${BASE_URL}/summary?year=${year}`);
  if (!response.ok) throw new Error("Failed to fetch dashboard data");
  return response.json();
};

export const saveSales = async (data) => {
  const response = await fetch(`${BASE_URL}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save sales data");
  return response.json();
};