import React, { useState, useEffect } from "react";
import { getAppointments, updateAppointmentStatus } from "../services/appointmentService";
import "./DoctorDashboardPage.css";

export default function DoctorDashboardPage({ currentUser, setCurrentPage }) {
  const [myAppointments, setMyAppointments] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadDoctorAppointments();
  }, [currentUser]);

  const loadDoctorAppointments = () => {
    // getAppointments(currentUser) filtra automáticamente las citas del doctor en sesión
    const appointments = getAppointments(currentUser);
    setMyAppointments(appointments);
  };

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    setMyAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
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

      {myAppointments.length === 0 ? (
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
                    <h3>{app.patientName}</h3>
                    <div className="doctor-card-email">{app.patientEmail}</div>
                  </div>
                  <span className={`status-badge ${app.status}`}>
                    {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pendiente"}
                  </span>
                </div>

                <div className="doctor-card-body">
                  <p>
                    <strong>Motivo de consulta:</strong> {app.reason}
                  </p>
                  <p>
                    <strong>Especialidad:</strong> {app.specialty}
                  </p>
                  <p>
                    <strong>Fecha y Hora:</strong> {app.date}
                  </p>
                </div>
              </div>

              {app.status === "pendiente" && (
                <div className="doctor-actions">
                  <button
                    onClick={() => handleStatusChange(app.id, "aceptada")}
                    className="btn-accept"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleStatusChange(app.id, "rechazada")}
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