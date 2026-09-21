import { Link } from "../routes/Router";

export default function Navbar({ lang, setLang, user, onLogout, currentPath, onNavigate }) {
  const go = (path) => onNavigate(path);
  const is = (path) => currentPath === path;

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
      <Link to={user?.role === "admin" ? "/admin" : "/dashboard"} style={{ fontSize: "20px", fontWeight: "bold", color: "#2563eb", textDecoration: "none" }}>
        MediCita Online
      </Link>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {user && user.role !== "admin" && <>
          <button type="button" onClick={() => go("/dashboard")} style={{ background: "none", border: "none", color: "#1e293b", fontWeight: is("/dashboard") ? "bold" : "normal", cursor: "pointer" }}>{lang === "en" ? "Home" : "Inicio"}</button>
          {user.role === "doctor" && <button type="button" onClick={() => go("/doctor")} style={{ background: "#e0f2fe", color: "#0369a1", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>{lang === "en" ? "Doctor Panel" : "Panel Doctor"}</button>}
          {user.role === "paciente" && <button type="button" onClick={() => go("/citas")} style={{ background: "none", border: "none", color: "#1e293b", fontWeight: is("/citas") ? "bold" : "normal", cursor: "pointer" }}>{lang === "en" ? "Appointments" : "Mis Citas"}</button>}
          <button type="button" onClick={() => go("/perfil")} style={{ background: "none", border: "none", color: "#1e293b", fontWeight: is("/perfil") ? "bold" : "normal", cursor: "pointer" }}>{lang === "en" ? "Profile" : "Perfil"}</button>
        </>}
        <button type="button" onClick={() => setLang(lang === "es" ? "en" : "es")} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#334155", fontWeight: "bold", cursor: "pointer" }}>{lang === "es" ? "EN" : "ES"}</button>
        {user ? <button type="button" onClick={onLogout} style={{ padding: "6px 14px", backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>{lang === "en" ? "Log out" : "Cerrar sesión"}</button> : <button type="button" onClick={() => go("/login")} style={{ padding: "6px 14px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>{lang === "en" ? "Log in" : "Iniciar sesión"}</button>}
      </div>
    </nav>
  );
}
