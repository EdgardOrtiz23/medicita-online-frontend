import { useMemo, useState } from "react";

const doctorsBySpecialty = {
  "Medicina General": ["Dr. Carlos Martínez", "Dra. Ana López"],
  Pediatría: ["Dra. María González", "Dr. Roberto Pérez"],
  Cardiología: ["Dr. Javier Ramírez", "Dra. Laura Torres"],
  Dermatología: ["Dra. Sofía Herrera", "Dr. Andrés Molina"],
  Ginecología: ["Dra. Valentina Ruiz", "Dra. Patricia Gómez"],
  Odontología: ["Dr. Daniel Castro", "Dra. Elena Vargas"],
  Psicología: ["Dra. Gabriela Navarro", "Dr. Miguel Sánchez"],
};

export const SPECIALTIES = Object.keys(doctorsBySpecialty);
export const getDoctors = (specialty) => doctorsBySpecialty[specialty] || [];

export default function AppointmentForm({ lang, onSave, onClose }) {
  const copy = lang === "en"
    ? {
        title: "Book an appointment",
        subtitle: "Choose the specialty, doctor and time that work best for you.",
        specialty: "Medical specialty",
        doctor: "Doctor",
        date: "Date",
        time: "Available time",
        reason: "Reason for visit",
        reasonPlaceholder: "Optional: tell us briefly why you need the appointment",
        select: "Select an option",
        save: "Book appointment",
        close: "Cancel",
        required: "Please complete all required fields.",
      }
    : {
        title: "Solicitar una cita",
        subtitle: "Elige la especialidad, médico y horario que mejor te convengan.",
        specialty: "Especialidad médica",
        doctor: "Médico",
        date: "Fecha",
        time: "Hora disponible",
        reason: "Motivo de consulta",
        reasonPlaceholder: "Opcional: escribe brevemente el motivo de tu consulta",
        select: "Selecciona una opción",
        save: "Solicitar cita",
        close: "Cancelar",
        required: "Completa todos los campos obligatorios.",
      };

  const today = useMemo(() => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  }, []);

  const [form, setForm] = useState({
    especialidad: "",
    medico: "",
    fecha: "",
    hora: "",
    motivo: "",
  });
  const [error, setError] = useState("");

  const doctors = getDoctors(form.especialidad);
  const times = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const update = (field, value) => {
    setError("");
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "especialidad" ? { medico: "" } : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.especialidad || !form.medico || !form.fecha || !form.hora) {
      setError(copy.required);
      return;
    }
    onSave(form);
  };

  return (
    <div className="appointment-overlay" role="dialog" aria-modal="true" aria-labelledby="appointment-form-title">
      <div className="appointment-modal">
        <div className="modal-heading">
          <div>
            <span className="modal-kicker">MEDICITA ONLINE</span>
            <h2 id="appointment-form-title">{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label={copy.close}>×</button>
        </div>

        {error && <div className="appointment-error" role="alert">{error}</div>}

        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>{copy.specialty}</span>
              <select value={form.especialidad} onChange={(e) => update("especialidad", e.target.value)} required>
                <option value="">{copy.select}</option>
                {SPECIALTIES.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}
              </select>
            </label>

            <label>
              <span>{copy.doctor}</span>
              <select value={form.medico} onChange={(e) => update("medico", e.target.value)} disabled={!form.especialidad} required>
                <option value="">{copy.select}</option>
                {doctors.map((doctor) => <option key={doctor} value={doctor}>{doctor}</option>)}
              </select>
            </label>

            <label>
              <span>{copy.date}</span>
              <input type="date" min={today} value={form.fecha} onChange={(e) => update("fecha", e.target.value)} required />
            </label>

            <label>
              <span>{copy.time}</span>
              <select value={form.hora} onChange={(e) => update("hora", e.target.value)} required>
                <option value="">{copy.select}</option>
                {times.map((time) => (
                  <option key={time} value={time}>{new Date(`2000-01-01T${time}:00`).toLocaleTimeString(lang === "en" ? "en-US" : "es-NI", { hour: "numeric", minute: "2-digit" })}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>{copy.reason}</span>
            <textarea value={form.motivo} onChange={(e) => update("motivo", e.target.value)} placeholder={copy.reasonPlaceholder} rows="4" />
          </label>

          <div className="modal-actions">
            <button type="button" className="modal-secondary" onClick={onClose}>{copy.close}</button>
            <button type="submit" className="modal-primary">{copy.save}<span>→</span></button>
          </div>
        </form>
      </div>
    </div>
  );
}
