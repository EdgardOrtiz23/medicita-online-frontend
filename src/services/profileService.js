const STORAGE_PREFIX = "medicita_profile_";

function getStorageKey(user) {
  const identity = user?.email || user?.name || "guest";
  const normalized = String(identity).trim().toLowerCase().replace(/[^a-z0-9@._-]/g, "_");
  return `${STORAGE_PREFIX}${normalized || "guest"}`;
}

const getDefaultProfile = (user = {}) => ({
  nombreCompleto: user?.name || "",
  correoElectronico: user?.email || "",
  fechaNacimiento: "",
  sexo: "",
  telefono: "",
  peso: "",
  altura: "",
  direccion: "",
  ciudad: "",
  contactoEmergencia: "",
  telefonoEmergencia: "",
});

export function getProfile(user) {
  const defaults = getDefaultProfile(user);

  try {
    const raw = localStorage.getItem(getStorageKey(user));
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return defaults;
    }

    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function saveProfile(user, profile) {
  const nextProfile = {
    ...getDefaultProfile(user),
    ...profile,
  };

  localStorage.setItem(getStorageKey(user), JSON.stringify(nextProfile));
  return nextProfile;
}

export function updateProfile(user, changes) {
  return saveProfile(user, {
    ...getProfile(user),
    ...changes,
  });
}
