const API_URL = import.meta.env.VITE_API_URL;

// Usuario de prueba local para desarrollo sin backend
export const DEMO_USER = {
  email: "prueba",
  password: "123qwe",
  name: "Usuario de Prueba",
};

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(
      "Backend no disponible, verificando credenciales locales de prueba...",
    );
  }

  // Fallback con usuario de prueba si la API falla o no está encendida
  if (
    credentials.email === DEMO_USER.email &&
    credentials.password === DEMO_USER.password
  ) {
    return {
      success: true,
      user: { name: DEMO_USER.name, email: DEMO_USER.email },
    };
  }

  throw new Error("Credenciales incorrectas");
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("Backend no disponible, registrando de forma simulada...");
  }

  // Simulación si no hay backend activo
  return {
    success: true,
    user: { name: userData.name || "Nuevo Usuario", email: userData.email },
  };
}
