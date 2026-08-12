export default function Navbar({
  lang,
  setLang,
  user,
  onLogout,
  currentPage,
  setCurrentPage,
  onGoToProfile,
}) {
  const t = {
    es: {
      title: "MediCita Online",
      home: "Inicio",
      login: "Iniciar Sesión",
      register: "Registrarse",
      profile: "Mi perfil",
      logout: "Cerrar Sesión",
    },
    en: {
      title: "MediCita Online",
      home: "Home",
      login: "Log In",
      register: "Sign Up",
      profile: "My profile",
      logout: "Log Out",
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.brand} onClick={() => setCurrentPage("home")}>
        <span style={styles.logoIcon}>🩺</span>
        <h2 style={styles.logoText}>{t[lang].title}</h2>
      </div>

      <nav style={styles.nav}>
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          style={styles.langBtn}
        >
          🌐 {lang === "es" ? "English" : "Español"}
        </button>

        {user ? (
          <div style={styles.userSection}>
            <button
            type="button"
            onClick={onGoToProfile}
            style={{
              ...styles.profileBtn,
              ...(currentPage === "profile" ? styles.profileBtnActive : {}),
            }}
          >
            👤 {t[lang].profile}
          </button>
          <span style={styles.userBadge}>{user.name || user.email}</span>
            <button onClick={onLogout} style={styles.logoutBtn}>
              {t[lang].logout}
            </button>
          </div>
        ) : (
          <div style={styles.authGroup}>
            <button
              onClick={() => setCurrentPage("login")}
              style={{
                ...styles.navBtn,
                ...(currentPage === "login" ? styles.activeNavBtn : {}),
              }}
            >
              {t[lang].login}
            </button>
            <button
              onClick={() => setCurrentPage("register")}
              style={styles.registerNavBtn}
            >
              {t[lang].register}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  logoIcon: { fontSize: "1.8rem" },
  logoText: {
    margin: 0,
    color: "#0284c7",
    fontSize: "1.4rem",
    fontWeight: "700",
  },
  nav: { display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-end" },
  langBtn: {
    padding: "0.4rem 0.8rem",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#334155",
  },
  userSection: { display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap", justifyContent: "flex-end" },
  profileBtn: {
    background: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    padding: "0.45rem 0.8rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
  profileBtnActive: {
    background: "#e0f2fe",
  },
  userBadge: {
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  authGroup: { display: "flex", gap: "0.5rem" },
  navBtn: {
    background: "transparent",
    border: "none",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    color: "#475569",
    fontWeight: "600",
    borderRadius: "6px",
  },
  activeNavBtn: { color: "#0284c7", background: "#f0f9ff" },
  registerNavBtn: {
    background: "#0284c7",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
