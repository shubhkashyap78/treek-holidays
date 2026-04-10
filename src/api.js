const BASE_URL = import.meta.env.VITE_API_URL || "";

function toQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  localStorage.setItem("admin_token", data.token);
  return data.token;
}

export function logout() {
  localStorage.removeItem("admin_token");
}

export function getToken() {
  return localStorage.getItem("admin_token");
}

export async function fetchList(path, params, fallback) {
  try {
    const headers = {};
    // Add auth headers for admin-only endpoints
    if (path.includes('/contact') || path.includes('/packages') || path.includes('/honeymoon') || path.includes('/family') || path.includes('/ltc') || path.includes('/group') || path.includes('/ferry')) {
      const token = localStorage.getItem("admin_token");
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    
    const res = await fetch(`${BASE_URL}${path}${toQuery(params)}`, { headers });
    if (!res.ok) {
      console.warn(`fetchList failed for ${path}:`, res.status, res.statusText);
      return fallback;
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return fallback;
  } catch (err) {
    console.error('fetchList error:', err);
    return fallback;
  }
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function createItem(path, payload) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateItem(path, id, payload) {
  const res = await fetch(`${BASE_URL}${path}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deleteItem(path, id) {
  const res = await fetch(`${BASE_URL}${path}/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  return handleResponse(res);
}
