import React, { useState, useEffect } from "react";
import { getAppointments, updateAppointmentStatus } from "../services/appointmentService";
import "./DoctorDashboardPage.css";

export default function DoctorDashboardPage({ currentUser, setCurrentPage }) {
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadDoctorAppointments();
  }, [currentUser]);

  const loadDoctorAppointments = () => {
    setLoading(true);
    setLoadError("");
    try {
      const appointments = getAppointments(currentUser);
      setMyAppointments(appointments);
    } catch (error) {
      console.error(error);
      setLoadError("No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    setMyAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, estado: newStatus } : app))
    );
    setToastMessage(`Cita ${newStatus} correctamente`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="doctor-page">
      <button className="doctor-back" onClick={() => setCurrentPage("home")}>
        ← Volver al inicio
      </button>

      <div className="doctor-header">
        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0284c7" }}>
          MEDICITA ONLINE - DOCTOR
        </span>
        <h1>Portal Médico - Gestión de Citas</h1>
        <p>Revisa las citas asignadas de tus pacientes y decide si aceptarlas o rechazarlas.</p>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Cargando citas...</div>
      ) : loadError ? (
        <div role="alert" style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>{loadError}</div>
      ) : myAppointments.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          No tienes citas asignadas actualmente.
        </div>
      ) : (
        <div className="doctor-grid">
          {myAppointments.map((app) => (
            <div key={app.id} className="doctor-card">
              <div>
                <div className="doctor-card-header">
                  <div>
                    <h3>{app.pacienteNombre}</h3>
                    <div className="doctor-card-email">{app.pacienteEmail}</div>
                  </div>
                  <span className={`status-badge ${app.estado}`}>
                    {app.estado ? app.estado.charAt(0).toUpperCase() + app.estado.slice(1) : "Pendiente"}
                  </span>
                </div>

                <div className="doctor-card-body">
                  <p>
                    <strong>Motivo de consulta:</strong> {app.motivo}
                  </p>
                  <p>
                    <strong>Especialidad:</strong> {app.especialidad}
                  </p>
                  <p>
                    <strong>Fecha y Hora:</strong> {app.fecha}
                  </p>
                </div>
              </div>

              {app.estado === "Pendiente" && (
                <div className="doctor-actions">
                  <button
                    onClick={() => handleStatusChange(app.id, "Aceptada")}
                    className="btn-accept"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleStatusChange(app.id, "Rechazada")}
                    className="btn-reject"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toastMessage && <div className="doctor-toast">{toastMessage}</div>}
    </div>
  );
}