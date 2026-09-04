import { useEffect, useMemo, useState } from "react";
import "./HomePage.css";
import AppointmentForm from "../components/AppointmentForm";
import {
  createAppointment,
  getAppointments,
} from "../services/appointmentService";
import { useAuth } from "../context/AuthContext";

export default function HomePage({ lang, user, onGoToAppointments, onGoToProfile }) {
  const { can } = useAuth();
  const t = {
    es: {
      eyebrow: "Tu salud, más simple",
      welcome: "Hola, bienvenido a MediCita",
      intro: "Gestiona tus citas médicas de forma sencilla, desde cualquier lugar y con una experiencia pensada para ti.",
      primary: "Solicitar una cita",
      secondary: "Ver mis citas",
      overview: "Tu espacio de salud",
      overviewText: "Todo lo que necesitas para organizar tu atención médica, en un solo lugar.",
      appointmentTitle: "Agenda tu próxima consulta",
      appointmentText: "Elige especialidad, médico, fecha y horario para solicitar tu próxima cita.",
      appointmentAction: "Agendar cita",
      statusTitle: "Cuenta activa",
      statusText: "Tu sesión está iniciada y lista para continuar.",
      quickTitle: "Accesos rápidos",
      quick1Title: "Nueva cita",
      quick1Text: "Encuentra el momento adecuado para tu próxima consulta.",
      quick2Title: "Mis citas",
      quick2Text: "Consulta y organiza tus próximas atenciones.",
      quick3Title: "Mi perfil",
      quick3Text: "Mantén tus datos personales siempre a mano.",
      secure: "Acceso protegido",
      secureText: "Sesión iniciada con tu cuenta",
      success: "¡Cita solicitada correctamente!",
      active: "Activo",
      userLabel: "Usuario",
      footer: "MediCita Online · Atención médica más accesible",
    },
    en: {
      eyebrow: "Your health, made simple",
      welcome: "Hello, welcome to MediCita",
      intro: "Manage your medical appointments easily, from anywhere, with an experience designed around you.",
      primary: "Book an appointment",
      secondary: "View my appointments",
      overview: "Your health space",
      overviewText: "Everything you need to organize your medical care, all in one place.",
      appointmentTitle: "Schedule your next visit",
      appointmentText: "Choose a specialty, doctor, date and time to request your next appointment.",
      appointmentAction: "Schedule visit",
      statusTitle: "Account active",
      statusText: "Your session is active and ready to continue.",
      quickTitle: "Quick access",
      quick1Title: "New appointment",
      quick1Text: "Find the right time for your next medical visit.",
      quick2Title: "My appointments",
      quick2Text: "Review and organize your upcoming visits.",
      quick3Title: "My profile",
      quick3Text: "Keep your personal information close at hand.",
      secure: "Protected access",
      secureText: "Signed in with your account",
      success: "Appointment requested successfully!",
      active: "Active",
      userLabel: "User",
      footer: "MediCita Online · More accessible healthcare",
    },
  };

  const copy = t[lang] || t.es;
  const displayName = user?.name || user?.email || "Usuario";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";
  const [appointments, setAppointments] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setAppointments(getAppointments(user));
  }, [user]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const upcomingCount = useMemo(
    () => appointments.filter((appointment) => appointment.estado !== "Cancelada").length,
    [appointments],
  );

  const openPanel = (panel) => {
    setNotice("");
    setActivePanel(panel);
  };

  const openAppointments = () => {
    setNotice("");
    onGoToAppointments();
  };

  const handleSave = (data) => {
    const appointment = createAppointment(user, data);
    setAppointments((current) => [...current, appointment]);
    setActivePanel(null);
    setNotice(copy.success);
  };

  return (
    <main className="home-page">
      {notice && <div className="appointment-toast" role="status"><span>✓</span>{notice}</div>}

      <section className="home-shell">
        <div className="home-hero">
          <div className="hero-copy">
            <span className="home-eyebrow"><span className="eyebrow-dot" />{copy.eyebrow}</span>
            <h1>{copy.welcome}<span className="hero-accent">.</span></h1>
            <p className="hero-description">{copy.intro}</p>

            <div className="hero-actions">
              {can("citas.crear") && (
                <button type="button" className="primary-action" onClick={() => openPanel("form")}>
                  <span>{copy.primary}</span><span className="action-arrow">→</span>
                </button>
              )}
              {can("citas.listar") && (
                <button type="button" className="secondary-action" onClick={openAppointments}>
                  {copy.secondary}
                </button>
              )}
            </div>

            <div className="trust-row">
              <div className="trust-icon">✓</div>
              <div><strong>{copy.secure}</strong><span>{copy.secureText}</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-glow" /><div className="visual-ring ring-one" /><div className="visual-ring ring-two" />
            <div className="visual-card card-back" />
            <div className="visual-card card-main">
              <div className="mini-logo">✚</div>
              <div className="mini-lines"><span /><span /><span /></div>
              <div className="mini-heart">♥</div>
            </div>
            <div className="floating-pill pill-top"><span className="pill-check">✓</span>{copy.statusTitle}</div>
            <div className="floating-pill pill-bottom"><span className="pill-user">{initial}</span>{displayName}</div>
          </div>
        </div>

        <section className="overview-section">
          <div className="section-heading">
            <div><span className="section-kicker">MEDICITA ONLINE</span><h2>{copy.overview}</h2></div>
            <p>{copy.overviewText}</p>
          </div>

          <div className="dashboard-grid">
            <article className="appointment-card">
              <div className="card-icon blue-icon">＋</div>
              <div className="card-content">
                <span className="card-label">{copy.statusTitle}</span>
                <h3>{copy.appointmentTitle}</h3>
                <p>{copy.appointmentText}</p>
                {can("citas.crear") && (
                  <button type="button" className="text-action" onClick={() => openPanel("form")}>
                    {copy.appointmentAction} <span>→</span>
                  </button>
                )}
              </div>
              <div className="appointment-orb" />
            </article>

            <aside className="status-card">
              <div className="status-card-top">
                <div className="card-icon green-icon">✓</div>
                <span className="status-dot">{copy.active}</span>
              </div>
              <span className="card-label">{copy.userLabel}</span>
              <strong>{displayName}</strong>
              <span className="status-email">{user?.email || "—"}</span>
              <span className="appointment-mini-count">{upcomingCount} {lang === "en" ? "active appointments" : "citas activas"}</span>
            </aside>
          </div>
        </section>

        <section className="quick-section">
          <div className="quick-heading"><span className="section-kicker">ACCIONES</span><h2>{copy.quickTitle}</h2></div>
          <div className="quick-grid">
            {can("citas.crear") && (
              <button type="button" className="quick-card quick-card-button" onClick={() => openPanel("form")}>
                <div className="quick-icon blue-icon">＋</div><div><h3>{copy.quick1Title}</h3><p>{copy.quick1Text}</p></div><span className="quick-arrow">↗</span>
              </button>
            )}
            {can("citas.listar") && (
              <button type="button" className="quick-card quick-card-button" onClick={openAppointments}>
                <div className="quick-icon violet-icon">▣</div><div><h3>{copy.quick2Title}</h3><p>{copy.quick2Text}</p></div><span className="quick-arrow">↗</span>
              </button>
            )}
            {can("perfil.ver") && (
              <button type="button" className="quick-card quick-card-button" onClick={onGoToProfile}>
                <div className="quick-icon green-icon">●</div><div><h3>{copy.quick3Title}</h3><p>{copy.quick3Text}</p></div><span className="quick-arrow">↗</span>
              </button>
            )}
          </div>
        </section>

        <footer className="home-footer"><span className="footer-mark">✚</span><span>{copy.footer}</span></footer>
      </section>

      {activePanel === "form" && can("citas.crear") && (
        <AppointmentForm
          lang={lang}
          onSave={handleSave}
          onClose={() => setActivePanel(null)}
        />
      )}
    </main>
  );
}
