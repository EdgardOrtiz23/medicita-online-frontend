import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/authService";
import "./AdminPage.css";

export default function AdminPage({ lang, onLogout }) {
  const [users, setUsers] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleRoleChange = (userId, newRole) => {
    const updated = updateUserRole(userId, newRole);
    setUsers(updated);
    setNotice(
      lang === "en"
        ? "User role updated successfully."
        : "Rol de usuario actualizado correctamente.",
    );
  };

  const copy =
    lang === "en"
      ? {
          title: "Admin Panel - User Management",
          subtitle: "Manage system users and assign roles (Doctor / Patient).",
          colName: "Name",
          colEmail: "Email",
          colPhone: "Phone",
          colRole: "Assigned Role",
          rolePatient: "Patient",
          roleDoctor: "Doctor",
          logout: "Log out",
        }
      : {
          title: "Panel de Administración - Gestión de Usuarios",
          subtitle:
            "Administra los usuarios registrados y asigna sus roles (Doctor / Paciente).",
          colName: "Nombre",
          colEmail: "Correo",
          colPhone: "Teléfono",
          colRole: "Rol Asignado",
          rolePatient: "Paciente",
          roleDoctor: "Doctor",
          logout: "Cerrar sesión",
        };

  return (
    <main className="admin-page">
      {notice && (
        <div className="admin-toast" role="status">
          <span>✓</span>
          {notice}
        </div>
      )}

      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <span className="section-kicker">MEDICITA ONLINE - ADMIN</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <button type="button" className="admin-logout-btn" onClick={onLogout}>
            {copy.logout}
          </button>
        </header>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{copy.colName}</th>
                <th>{copy.colEmail}</th>
                <th>{copy.colPhone}</th>
                <th>{copy.colRole}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <select
                      className={`role-select ${u.role}`}
                      value={u.role || "paciente"}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="paciente">{copy.rolePatient}</option>
                      <option value="doctor">{copy.roleDoctor}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
