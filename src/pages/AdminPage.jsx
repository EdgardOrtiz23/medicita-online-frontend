import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./AdminPage.css";

export default function AdminPage({ lang, onLogout }) {
  const { can } = useAuth();
  const [users, setUsers] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError("");
      try {
        const list = await getAllUsers();
        if (!cancelled) {
          setUsers(list);
        }
      } catch {
        if (!cancelled) {
          setError(
            lang === "en"
              ? "Could not load users from the server."
              : "No se pudieron cargar los usuarios desde el servidor.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleRoleChange = async (userId, newRole) => {
    const previousUsers = users;
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
    );
    setError("");

    try {
      await updateUserRole(userId, newRole);
      setNotice(
        lang === "en"
          ? "User role updated successfully."
          : "Rol de usuario actualizado correctamente.",
      );
    } catch {
      setUsers(previousUsers);
      setError(
        lang === "en"
          ? "Could not update the user role."
          : "No se pudo actualizar el rol del usuario.",
      );
    }
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
      {error && !loading && users.length > 0 && (
        <div className="admin-toast" role="alert">
          {error}
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
              {loading && (
                <tr>
                  <td colSpan={4}>
                    {lang === "en" ? "Loading users..." : "Cargando usuarios..."}
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    {error ||
                      (lang === "en"
                        ? "There are no registered users."
                        : "No hay usuarios registrados.")}
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    {can("usuarios.cambiar_rol") ? (
                      <select
                        className={`role-select ${u.role}`}
                        value={u.role || "paciente"}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="paciente">{copy.rolePatient}</option>
                        <option value="doctor">{copy.roleDoctor}</option>
                      </select>
                    ) : (
                      u.role || "paciente"
                    )}
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
