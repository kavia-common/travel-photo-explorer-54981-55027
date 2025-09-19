/**
 * Resolve API base URL with robust defaults:
 * - Prefer REACT_APP_BACKEND_URL when provided (no trailing slash)
 * - Otherwise, infer from current location to avoid mixed-content:
 *   Use same protocol/host with port 3001 (FastAPI default in this project)
 */
const envUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
let inferredUrl = "";
try {
  const { protocol, hostname } = window.location;
  // Keep current protocol to avoid mixed-content issues; default to port 3001
  inferredUrl = `${protocol}//${hostname}:3001`;
} catch (_e) {
  inferredUrl = "http://localhost:3001";
}
const API_URL = envUrl || inferredUrl;

// Basic wrapper around fetch with auth support and clearer network error messages
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Network/CORS/mixed-content errors are thrown here before res is available
    const tip = envUrl
      ? `Please verify REACT_APP_BACKEND_URL (${envUrl}) is reachable and uses the correct protocol (http/https).`
      : `Consider setting REACT_APP_BACKEND_URL in .env to your FastAPI URL (e.g., https://<host>:3001) to avoid mixed-content/CORS.`;
    throw new Error(`Network error: failed to reach backend. ${tip}`);
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.detail || data?.message || res.statusText || "Request failed";
    throw new Error(typeof message === "string" ? message : "Request failed");
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Login user and return AuthResponse */
  // PUBLIC_INTERFACE
  async login(email, password) {
    return request("/auth/login", { method: "POST", body: { email, password } });
  },

  /** Get current user profile using token */
  // PUBLIC_INTERFACE
  async me(token) {
    return request("/auth/me", { token });
  },

  /** List my photos (optional location filter) */
  // PUBLIC_INTERFACE
  async listMyPhotos(token, location) {
    const q = location ? `?location=${encodeURIComponent(location)}` : "";
    return request(`/photos${q}`, { token });
  },

  /** Search within my photos by location */
  // PUBLIC_INTERFACE
  async searchMyPhotos(token, q) {
    const qs = `?q=${encodeURIComponent(q)}`;
    return request(`/search/photos${qs}`, { token });
  },

  /** Search Unsplash by query (unauthenticated to our backend) */
  // PUBLIC_INTERFACE
  async searchUnsplash(query, page = 1, perPage = 12) {
    const qs = `?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    return request(`/unsplash/search${qs}`);
  },
};

export default api;
