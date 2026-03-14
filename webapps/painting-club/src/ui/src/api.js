const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const detail = data?.detail || `Request failed with status ${response.status}`;
    throw new Error(detail);
  }

  return data;
}

export function getHealth() {
  return request("/health");
}

export function getUsers() {
  return request("/members");
}

export function createUser(payload) {
  return request("/members/new", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login_user(payload) {
  return request("/members/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
