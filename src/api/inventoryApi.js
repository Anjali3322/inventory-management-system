const BASE_URL = "http://localhost:5000/api/inventory";

export const getInventory = async (page, limit, search) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}&search=${search}`);
  if (!response.ok) throw new Error("Failed to fetch inventory data");
  return response.json();
};

export const updateStock = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update stock");
  return response.json();
};