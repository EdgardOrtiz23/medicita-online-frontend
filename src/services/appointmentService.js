const STORAGE_PREFIX = "medicita_appointments_";
const GLOBAL_APPOINTMENTS_KEY = "medicita_global_appointments";

// Citas de prueba iniciales para doctores
const INITIAL_MOCK_APPOINTMENTS = [
  {
    id: "apt_101",
    pacienteNombre: "Carlos Mendoza",
    pacienteEmail: "carlos@gmail.com",
    especialidad: "Medicina General",
    medico: "Dra. Sofía Martínez",
    fecha: "2026-09-10",
    hora: "09:00",
    motivo: "Chequeo de rutina y presión arterial.",
    estado: "Pendiente",
  },
  {
    id: "apt_102",
    pacienteNombre: "Lucía Fernández",
    pacienteEmail: "lucia@gmail.com",
    especialidad: "Cardiología",
    medico: "Dr. Roberto Gómez",
    fecha: "2026-09-12",
    hora: "10:30",
    motivo: "Evaluación por taquicardias ocasionales.",
    estado: "Pendiente",
  },
  {
    id: "apt_103",
    pacienteNombre: "Carlos Mendoza",
    pacienteEmail: "carlos@gmail.com",
    especialidad: "Pediatría",
    medico: "Dra. Sofía Martínez",
    fecha: "2026-09-15",
    hora: "14:00",
    motivo: "Consulta de seguimiento.",
    estado: "Aceptada",
  },
];

function getStorageKey(user) {
  const identity = user?.email || user?.name || "guest";
  const normalized = String(identity).trim().toLowerCase().replace(/[^a-z0-9@._-]/g, "_");
  return `${STORAGE_PREFIX}${normalized || "guest"}`;
}

export function getAllAppointmentsGlobal() {
  try {
    const raw = localStorage.getItem(GLOBAL_APPOINTMENTS_KEY);
    if (!raw) {
      localStorage.setItem(GLOBAL_APPOINTMENTS_KEY, JSON.stringify(INITIAL_MOCK_APPOINTMENTS));
      return INITIAL_MOCK_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_APPOINTMENTS;
  }
}

function writeGlobalAppointments(appointments) {
  localStorage.setItem(GLOBAL_APPOINTMENTS_KEY, JSON.stringify(appointments));
}

export function getAppointments(user) {
  const globalAppts = getAllAppointmentsGlobal();
  if (!user) return [];

  // Si es doctor, devuelve sus citas asignadas o todas si coincide el nombre
  const isDoctor =
    user.role === "doctor" || user.permissions?.includes("doctor.panel");

  if (isDoctor) {
    return globalAppts.filter(
      (a) =>
        a.medico?.toLowerCase().includes(user.name.toLowerCase()) ||
        a.medico === "Por asignar" ||
        !a.medico
    );
  }

  // Para paciente, filtra por email o consulta local
  return globalAppts.filter(
    (a) => a.pacienteEmail?.toLowerCase() === user.email?.toLowerCase()
  );
}

export function createAppointment(user, appointmentData) {
  const newAppointment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    pacienteNombre: user?.name || "Paciente",
    pacienteEmail: user?.email || "",
    especialidad: appointmentData.especialidad,
    medico: appointmentData.medico || "Por asignar",
    fecha: appointmentData.fecha,
    hora: appointmentData.hora,
    motivo: appointmentData.motivo?.trim() || "",
    estado: "Pendiente",
  };

  const all = getAllAppointmentsGlobal();
  const updated = [newAppointment, ...all];
  writeGlobalAppointments(updated);
  return newAppointment;
}

export function updateAppointmentStatus(appointmentId, newStatus) {
  const all = getAllAppointmentsGlobal();
  const updated = all.map((apt) =>
    apt.id === appointmentId ? { ...apt, estado: newStatus } : apt
  );
  writeGlobalAppointments(updated);
  return updated;
}

export function cancelAppointment(user, appointmentId) {
  return updateAppointmentStatus(appointmentId, "Cancelada");
}

export function deleteCancelledAppointment(user, appointmentId) {
  const appointments = getAllAppointmentsGlobal();
  const target = appointments.find((a) => a.id === appointmentId);

  if (!target || target.estado !== "Cancelada") {
    return false;
  }

  const updated = appointments.filter((a) => a.id !== appointmentId);
  writeGlobalAppointments(updated);
  return true;
}