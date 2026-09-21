import { api } from "./api";

export async function getAppointments() {
  try {
    const citas = await api.get("/citas");
    return citas.map(cita => ({
      id: cita.id,
      pacienteNombre: cita.patient?.name || "Paciente",
      pacienteEmail: cita.patient?.email || "",
      medico_id: cita.doctor_id,
      medico: cita.doctor?.name || "Por asignar",
      fecha: cita.appointment_date,
      hora: cita.appointment_time,
      estado: mapStatusToFrontend(cita.status),
      especialidad: "General", 
      motivo: "Consulta médica"
    }));
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    throw error;
  }
}

export async function createAppointment(user, appointmentData) {
  const payload = {
    doctor_id: appointmentData.medico_id || appointmentData.medico, 
    appointment_date: appointmentData.fecha,
    appointment_time: appointmentData.hora,
    status: "pendiente"
  };

  const cita = await api.post("/citas", payload);
  return cita;
}

export async function updateAppointmentStatus(appointmentId, newStatus) {
  const payload = {
    status: mapStatusToBackend(newStatus)
  };
  const cita = await api.patch(`/citas/${appointmentId}`, payload);
  return cita;
}

export async function cancelAppointment(user, appointmentId) {
  return updateAppointmentStatus(appointmentId, "cancelada");
}

export async function deleteCancelledAppointment(user, appointmentId) {
  await api.delete(`/citas/${appointmentId}`);
  return true;
}

function mapStatusToFrontend(status) {
  const s = status.toLowerCase();
  if (s === 'pendiente') return 'Pendiente';
  if (s === 'cancelada') return 'Cancelada';
  if (s === 'aceptada' || s === 'confirmada') return 'Aceptada';
  return 'Pendiente';
}

function mapStatusToBackend(status) {
  const s = status.toLowerCase();
  if (s.includes('cancel')) return 'cancelada';
  if (s.includes('acept')) return 'aceptada';
  return 'pendiente';
}