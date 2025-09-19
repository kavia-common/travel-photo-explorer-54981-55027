const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// Basic wrapper around fetch with auth support
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.detail || data?.message || res.statusText;
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
