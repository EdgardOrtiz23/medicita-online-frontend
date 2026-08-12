import { useEffect, useState } from "react";
import "./HomePage.css";
import AppointmentsList from "../components/AppointmentsList";
import { cancelAppointment, deleteCancelledAppointment, getAppointments } from "../services/appointmentService";

export default function AppointmentsPage({ lang, user, onBack, onRequestAppointment }) {
  const [appointments, setAppointments] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setAppointments(getAppointments(user));
  }, [user]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleCancel = (id) => {
    cancelAppointment(user, id);
    setAppointments(getAppointments(user));
  };

  const handleDelete = (id) => {
    const deleted = deleteCancelledAppointment(user, id);
    if (!deleted) return;
    setAppointments(getAppointments(user));
    setNotice(
      lang === "en"
        ? "Appointment deleted successfully."
        : "Cita eliminada correctamente.",
    );
  };

  const copy =
    lang === "en"
      ? {
          back: "← Back to Home",
          kicker: "MEDICITA ONLINE",
          title: "My appointments",
          subtitle: "Manage your upcoming medical visits and review your appointment history.",
          newAppointment: "Book an appointment",
        }
      : {
          back: "← Volver al inicio",
          kicker: "MEDICITA ONLINE",
          title: "Mis citas",
          subtitle: "Gestiona tus próximas consultas médicas y revisa tu historial de citas.",
          newAppointment: "Solicitar una cita",
        };

  return (
    <main className="appointments-page">
      {notice && <div className="appointment-toast" role="status"><span>✓</span>{notice}</div>}
      <div className="appointments-page-shell">
        <div className="appointments-page-topbar">
          <button type="button" className="appointments-back" onClick={onBack}>
            {copy.back}
          </button>
          <button type="button" className="appointments-new" onClick={onRequestAppointment}>
            <span>＋</span>{copy.newAppointment}
          </button>
        </div>

        <header className="appointments-page-header">
          <span className="section-kicker">{copy.kicker}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </header>

        <AppointmentsList
          lang={lang}
          appointments={appointments}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onRequestAppointment={onRequestAppointment}
          fullPage
        />
      </div>
    </main>
  );
}
