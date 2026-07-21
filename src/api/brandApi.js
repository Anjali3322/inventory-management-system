

import API_URL from "./config";
const BASE_URL = `${API_URL}/api/brands`;
// const BASE_URL = "http://localhost:5000/api/brands";


export const getBrands = async (page, limit, search) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}&search=${search}`);
  if (!response.ok) throw new Error("Failed to fetch brands data");
  return response.json();
};

export const createBrand = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to create brand");
  }
  return response.json();
};

export const updateBrand = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update brand");
  return response.json();
};

export const deleteBrand = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete brand");
  return response.json();
};