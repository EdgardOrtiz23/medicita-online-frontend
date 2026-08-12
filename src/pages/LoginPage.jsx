import { useState } from "react";
import { loginUser } from "../services/authService";

export default function LoginPage({ lang, onLoginSuccess, onGoToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    es: {
      title: "Bienvenido de nuevo",
      subtitle: "Ingresa tus datos para gestionar tus citas médicas.",
      email: "Usuario o Correo",
      password: "Contraseña",
      submit: "Iniciar Sesión",
      noAccount: "¿No tienes una cuenta?",
      registerLink: "Regístrate aquí",
    },
    en: {
      title: "Welcome Back",
      subtitle: "Enter your credentials to manage your appointments.",
      email: "Username or Email",
      password: "Password",
      submit: "Log In",
      noAccount: "Don't have an account?",
      registerLink: "Sign up here",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(
        lang === "es"
          ? "Usuario o contraseña incorrectos"
          : "Invalid username or password",
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
            <label style={styles.label}>{t[lang].email}</label>
            <input
              type="text"
              required
              placeholder="Usuario"
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

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "..." : t[lang].submit}
          </button>
        </form>

        <p style={styles.footerText}>
          {t[lang].noAccount}{" "}
          <span onClick={onGoToRegister} style={styles.link}>
            {t[lang].registerLink}
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
    padding: "3rem 1rem",
    minHeight: "80vh",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "420px",
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
  form: { display: "flex", flexDirection: "column", gap: "1.2rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { color: "#334155", fontSize: "0.9rem", fontWeight: "600" },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    background: "#0284c7",
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
