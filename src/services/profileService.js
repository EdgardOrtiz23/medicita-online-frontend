import { api } from "./api";

const getDefaultProfile = (user = {}) => ({
  nombreCompleto: user?.name || "",
  correoElectronico: user?.email || "",
  fechaNacimiento: user?.fecha_nacimiento || "",
  sexo: user?.sexo || "",
  telefono: user?.telefono || "",
  peso: user?.peso || "",
  altura: user?.altura || "",
  direccion: user?.direccion || "",
  ciudad: user?.ciudad || "",
  contactoEmergencia: user?.contacto_emergencia || "",
  telefonoEmergencia: user?.telefono_emergencia || "",
});

export async function getProfile(user) {
  try {
    const response = await api.get("/profile");
    const userData = response.user || response;
    return getDefaultProfile(userData);
  } catch (error) {
    console.error("Error obteniendo perfil desde el backend:", error);
    return getDefaultProfile(user);
  }
}

export async function updateProfile(user, changes) {
  const payload = {
    name: changes.nombreCompleto,
    email: changes.correoElectronico,
    fecha_nacimiento: changes.fechaNacimiento,
    sexo: changes.sexo,
    telefono: changes.telefono,
    peso: changes.peso,
    altura: changes.altura,
    direccion: changes.direccion,
    ciudad: changes.ciudad,
    contacto_emergencia: changes.contactoEmergencia,
    telefono_emergencia: changes.telefonoEmergencia,
  };

  try {
    const response = await api.patch("/profile", payload);
    return getDefaultProfile(response.user);
  } catch (error) {
    console.error("Error actualizando perfil en el backend:", error);
    throw error;
  }
}

export const saveProfile = updateProfile;