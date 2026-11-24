const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (response.status === 204) {
    if (!response.ok) throw new Error("Request failed");
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function getBooks(params = {}, signal) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) query.set(key, value);
  });
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/books${suffix}`, { signal });
}

export const getStats = () => request("/stats");
export const addBook = book => request("/books", { method: "POST", body: JSON.stringify(book) });
export const replaceBook = (id, book) => request(`/books/${id}`, { method: "PUT", body: JSON.stringify(book) });
export const patchBook = (id, changes) => request(`/books/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
export const removeBook = id => request(`/books/${id}`, { method: "DELETE" });