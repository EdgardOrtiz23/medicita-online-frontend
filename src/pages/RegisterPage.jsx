import { useState } from "react";
import { registerUser } from "../services/authService";

export default function RegisterPage({ lang, onRegisterSuccess, onGoToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    es: {
      title: "Crear una Cuenta",
      subtitle: "Únete a MediCita Online para agendar tus citas.",
      name: "Nombre Completo",
      email: "Correo Electrónico / Usuario",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      submit: "Crear Cuenta",
      hasAccount: "¿Ya tienes cuenta?",
      loginLink: "Inicia Sesión",
      passMismatch: "Las contraseñas no coinciden",
    },
    en: {
      title: "Create an Account",
      subtitle: "Join MediCita Online to schedule your appointments.",
      name: "Full Name",
      email: "Email / Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      submit: "Sign Up",
      hasAccount: "Already have an account?",
      loginLink: "Log In",
      passMismatch: "Passwords do not match",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(t[lang].passMismatch);
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(form);
      onRegisterSuccess(data.user);
    } catch (err) {
      setError(
        lang === "es" ? "Error al registrar usuario" : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{t[lang].title}</h2>
        <p style={styles.subtitle}>{t[lang].subtitle}</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>{t[lang].name}</label>
            <input
              type="text"
              required
              placeholder="Juan Pérez"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t[lang].email}</label>
            <input
              type="text"
              required
              placeholder="juan@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t[lang].password}</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t[lang].confirmPassword}</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "..." : t[lang].submit}
          </button>
        </form>

        <p style={styles.footerText}>
          {t[lang].hasAccount}{" "}
          <span onClick={onGoToLogin} style={styles.link}>
            {t[lang].loginLink}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem 1rem",
    minHeight: "80vh",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "440px",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  title: {
    color: "#0f172a",
    fontSize: "1.6rem",
    fontWeight: "700",
    textAlign: "center",
    margin: 0,
  },
  subtitle: {
    color: "#64748b",
    fontSize: "0.95rem",
    textAlign: "center",
    marginTop: "0.5rem",
    marginBottom: "1.5rem",
  },
  errorBox: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #fecaca",
    marginBottom: "1rem",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { color: "#334155", fontSize: "0.88rem", fontWeight: "600" },
  input: {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "0.85rem",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  footerText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
    marginTop: "1.5rem",
  },
  link: {
    color: "#0284c7",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
