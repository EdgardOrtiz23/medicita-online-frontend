import { api, ApiError } from "./api";

const USERS_STORAGE_KEY = "medicita_users_list";

// Usuarios de prueba predeterminados para la gestión del Admin
const INITIAL_MOCK_USERS = [
  { id: "usr_1", name: "Carlos Mendoza", email: "carlos@gmail.com", password: "123", role: "paciente", phone: "8888-1111" },
  { id: "usr_2", name: "Dra. Sofía Martínez", email: "sofia.med@gmail.com", password: "123", role: "doctor", phone: "8888-2222" },
  { id: "usr_3", name: "Lucía Fernández", email: "lucia@gmail.com", password: "123", role: "paciente", phone: "8888-3333" },
  { id: "usr_4", name: "Dr. Roberto Gómez", email: "roberto.med@gmail.com", password: "123", role: "doctor", phone: "8888-4444" },
];

export const ADMIN_USER = {
  name: "Administrador",
  email: "Admin",
  role: "admin",
};

export function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
      return INITIAL_MOCK_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_USERS;
  }
}

export function updateUserRole(userId, newRole) {
  const users = getAllUsers();
  const updated = users.map((user) =>
    user.id === userId ? { ...user, role: newRole } : user
  );
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function loginUser(credentials) {
  const trimmedEmail = credentials.email?.trim();
  const trimmedPassword = credentials.password?.trim();

  if (trimmedEmail === "Admin" && trimmedPassword === "admin") {
    return { success: true, user: ADMIN_USER };
  }

  try {
    return await api.post("/login", credentials);
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 422].includes(error.status)) throw error;
    console.warn("Backend no disponible, verificando usuarios de prueba...");
  }

  const users = getAllUsers();
  const foundUser = users.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase() && u.password === trimmedPassword);
  if (foundUser) return { success: true, user: { name: foundUser.name, email: foundUser.email, role: foundUser.role || "paciente" } };

  throw new Error("Credenciales incorrectas");
}

export async function registerUser(userData) {
  try {
    return await api.post("/register", userData);
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 422].includes(error.status)) throw error;
    console.warn("Backend no disponible, registrando de forma simulada...");
  }

  const users = getAllUsers();
  const newUser = {
    id: `usr_${Date.now()}`,
    name: userData.name || "Nuevo Usuario",
    email: userData.email,
    password: userData.password,
    role: "paciente",
    phone: userData.phone || "Sin teléfono",
  };

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
  return { success: true, user: { name: newUser.name, email: newUser.email, role: newUser.role } };
}
