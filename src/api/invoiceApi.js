// const BASE_URL = "http://localhost:5000/api/invoices";
// const PRODUCTS_URL = "http://localhost:5000/api/products";
import API_URL from "./config";
const BASE_URL = `${API_URL}/api/invoices`;
const PRODUCTS_URL = `${API_URL}/api/products`;

const handle = async (response, fallbackMessage) => {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || fallbackMessage);
  }
  return response.json();
};

export const getInvoices = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}${query ? `?${query}` : ""}`);
  return handle(response, "Failed to fetch invoices");
};

export const getInvoiceSummary = async () => {
  const response = await fetch(`${BASE_URL}/summary`);
  return handle(response, "Failed to fetch invoice summary");
};

export const getInvoice = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handle(response, "Failed to fetch invoice");
};

export const createInvoice = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(response, "Failed to create invoice");
};

export const updateInvoice = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(response, "Failed to update invoice");
};

export const updateInvoiceStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handle(response, "Failed to update invoice status");
};

export const deleteInvoice = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return handle(response, "Failed to delete invoice");
};

export const getProductsForInvoice = async () => {
  const response = await fetch(PRODUCTS_URL);
  return handle(response, "Failed to fetch products");
};