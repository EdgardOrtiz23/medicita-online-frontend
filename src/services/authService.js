const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "medicita_token";
const USER_KEY = "medicita_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user, token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseError(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  const isPublicAuth = path === "/login" || path === "/register";
  if (response.status === 401 && !isPublicAuth) {
    clearSession();
    window.dispatchEvent(new Event("medicita:unauthorized"));
    throw new Error(await parseError(response, "Sesión expirada"));
  }

  return response;
}

export async function loginUser(credentials) {
  const response = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email?.trim(),
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Credenciales incorrectas"));
  }

  const data = await response.json();
  saveSession(data.user, data.token);
  return data;
}

export async function registerUser(userData) {
  const response = await apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword || userData.password,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Error al registrar usuario"));
  }

  const data = await response.json();
  saveSession(data.user, data.token);
  return data;
}

export async function fetchCurrentUser() {
  const response = await apiFetch("/user");

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo recuperar la sesión"));
  }

  const data = await response.json();
  const user = data.user || data;
  saveSession(user);
  return user;
}

export async function logoutUser() {
  try {
    if (getToken()) {
      await apiFetch("/logout", { method: "POST" });
    }
  } catch {
    // Si el backend no responde, igual se limpia la sesión local.
  } finally {
    clearSession();
  }
}

export async function getAllUsers() {
  const response = await apiFetch("/users");

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron cargar los usuarios"));
  }

  const data = await response.json();
  return data.users || [];
}

export async function updateUserRole(userId, newRole) {
  const response = await apiFetch(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role: newRole }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo actualizar el rol"));
  }

  return response.json();
}
