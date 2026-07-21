// const BASE_URL = "http://localhost:5000/api/settings";
import API_URL from "./config";
const BASE_URL = `${API_URL}/api/settings`;

const handle = async (response, fallbackMessage) => {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || fallbackMessage);
  }
  return response.json();
};

export const getSettings = async () => {
  const response = await fetch(BASE_URL);
  return handle(response, "Failed to fetch settings");
};

export const updateCompanyProfile = async (data) => {
  const response = await fetch(`${BASE_URL}/company`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(response, "Failed to update company profile");
};

export const updateCurrencyTax = async (data) => {
  const response = await fetch(`${BASE_URL}/currency`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(response, "Failed to update currency & tax settings");
};

export const updateAppearance = async (data) => {
  const response = await fetch(`${BASE_URL}/appearance`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(response, "Failed to update appearance settings");
};

export const updateNotifications = async (data) => {
  const response = await fetch(`${BASE_URL}/notifications`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(response, "Failed to update notification preferences");
};

export const changePassword = async (data) => {
  const response = await fetch(`${BASE_URL}/security/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(response, "Failed to change password");
};

export const toggleTwoFactor = async () => {
  const response = await fetch(`${BASE_URL}/security/2fa`, { method: "PUT" });
  return handle(response, "Failed to update two-factor authentication");
};

export const updateRoles = async (roles) => {
  const response = await fetch(`${BASE_URL}/roles`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roles }),
  });
  return handle(response, "Failed to update roles & permissions");
};

// Triggers a browser download for the CSV export
export const exportInventoryCSV = () => {
  window.open(`${BASE_URL}/export-csv`, "_blank");
};

// Triggers a full JSON backup download
export const triggerBackup = async () => {
  const response = await fetch(`${BASE_URL}/backup`, { method: "POST" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to create backup");
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventra-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};