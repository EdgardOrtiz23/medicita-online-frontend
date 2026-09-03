export default function Navbar({
  lang,
  setLang,
  user,
  onLogout,
  currentPage,
  setCurrentPage,
  onGoToProfile,
}) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#2563eb",
          cursor: "pointer",
        }}
        onClick={() => (user?.role === "admin" ? setCurrentPage("admin") : setCurrentPage("home"))}
      >
        MediCita Online
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {user && user.role !== "admin" && (
          <>
            <button
              type="button"
              onClick={() => setCurrentPage("home")}
              style={{
                background: "none",
                border: "none",
                color: "#1e293b",
                fontWeight: currentPage === "home" ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {lang === "en" ? "Home" : "Inicio"}
            </button>

            {user.role === "doctor" && (
              <button
                type="button"
                onClick={() => setCurrentPage("doctor-dashboard")}
                style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Doctor Panel" : "Panel Doctor"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentPage("appointments")}
              style={{
                background: "none",
                border: "none",
                color: "#1e293b",
                fontWeight: currentPage === "appointments" ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {lang === "en" ? "Appointments" : "Mis Citas"}
            </button>

            <button
              type="button"
              onClick={onGoToProfile}
              style={{
                background: "none",
                border: "none",
                color: "#1e293b",
                fontWeight: currentPage === "profile" ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {lang === "en" ? "Profile" : "Perfil"}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
            color: "#334155",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {lang === "es" ? "EN" : "ES"}
        </button>

        {user ? (
          <button
            type="button"
            onClick={onLogout}
            style={{
              padding: "6px 14px",
              backgroundColor: "#f1f5f9",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "Log out" : "Cerrar sesión"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentPage("login")}
            style={{
              padding: "6px 14px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "Log in" : "Iniciar sesión"}
          </button>
        )}
      </div>
    </nav>
  );
}