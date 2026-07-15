const BASE_URL = "http://localhost:5000/api/users";

// 1. GET Users (Handles pagination, search, and 304 caching)
export const getUsers = async (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({ page, limit, search });
  
  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    // Optional: Agar aap chahte hain ki browser cache na kare aur 304 na aaye, 
    // toh niche wali line uncomment kar sakte hain:
    // cache: "no-store" 
  });

  // 304 Not Modified ek valid response hai, isliye ispe error throw nahi hona chahiye
  if (!response.ok && response.status !== 304) {
    throw new Error("Failed to fetch users data");
  }

  return response.json();
};

// 2. CREATE User
export const createUser = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to create user");
  }

  return response.json();
};

// 3. UPDATE User
export const updateUser = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update user");
  }

  return response.json();
};

// 4. DELETE User
export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to delete user");
  }

  return response.json();
};