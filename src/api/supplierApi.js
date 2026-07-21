// const BASE_URL = "http://localhost:5000/api/suppliers";
import API_URL from "./config";
const BASE_URL = `${API_URL}/api/suppliers`;

export const getSuppliers = async (page, limit, search) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}&search=${search}`);
  if (!response.ok) throw new Error("Failed to fetch suppliers data");
  return response.json();
};

export const createSupplier = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to create supplier");
  }
  return response.json();
};

export const updateSupplier = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update supplier");
  return response.json();
};

export const deleteSupplier = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete supplier");
  return response.json();
};