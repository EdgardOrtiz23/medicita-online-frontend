const STORAGE_PREFIX = "medicita_appointments_";

function getStorageKey(user) {
  const identity = user?.email || user?.name || "guest";
  const normalized = String(identity).trim().toLowerCase().replace(/[^a-z0-9@._-]/g, "_");
  return `${STORAGE_PREFIX}${normalized || "guest"}`;
}

function readAppointments(user) {
  try {
    const raw = localStorage.getItem(getStorageKey(user));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAppointments(user, appointments) {
  localStorage.setItem(getStorageKey(user), JSON.stringify(appointments));
}

export function getAppointments(user) {
  return readAppointments(user);
}

export function createAppointment(user, appointmentData) {
  const appointment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    especialidad: appointmentData.especialidad,
    medico: appointmentData.medico,
    fecha: appointmentData.fecha,
    hora: appointmentData.hora,
    motivo: appointmentData.motivo?.trim() || "",
    estado: "Pendiente",
  };

  const appointments = readAppointments(user);
  writeAppointments(user, [...appointments, appointment]);
  return appointment;
}

export function cancelAppointment(user, appointmentId) {
  const appointments = readAppointments(user);
  const updated = appointments.map((appointment) =>
    appointment.id === appointmentId
      ? { ...appointment, estado: "Cancelada" }
      : appointment,
  );

  writeAppointments(user, updated);
  return updated.find((appointment) => appointment.id === appointmentId) || null;
}

export function deleteCancelledAppointment(user, appointmentId) {
  const appointments = readAppointments(user);
  const target = appointments.find((appointment) => appointment.id === appointmentId);

  // A defensive check prevents the delete action from removing an active appointment.
  if (!target || target.estado !== "Cancelada") {
    return false;
  }

  const updated = appointments.filter((appointment) => appointment.id !== appointmentId);
  writeAppointments(user, updated);
  return true;
}
