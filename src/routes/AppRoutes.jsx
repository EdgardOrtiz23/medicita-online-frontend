import { useEffect } from "react";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AppointmentsPage from "../pages/AppointmentsPage";
import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";
import DoctorDashboardPage from "../pages/DoctorDashboardPage";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { Link, Navigate, useLocation, useNavigate } from "./Router";

function PrivateRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/403" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function ForbiddenPage() {
  return <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "2rem" }}><div style={{ textAlign: "center" }}><h1>403</h1><p>No tienes permiso para acceder a esta sección.</p><Link to="/dashboard">Volver al inicio</Link></div></main>;
}

function NotFoundPage() {
  return <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "2rem" }}><div style={{ textAlign: "center" }}><h1>404</h1><p>La página que buscas no existe.</p><Link to="/dashboard">Volver al inicio</Link></div></main>;
}

export default function AppRoutes() {
  const { user, login, logout } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const path = useLocation();

  useEffect(() => {
    if (path === "/" && !user) navigate("/login", { replace: true });
    if ((path === "/login" || path === "/registro") && user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [path, user, navigate]);

  if (path === "/" && user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  if (path === "/login") return <LoginPage lang={lang} onLoginSuccess={(u) => { login(u); navigate(u.role === "admin" ? "/admin" : "/dashboard"); }} onGoToRegister={() => navigate("/registro")} />;
  if (path === "/registro") return <RegisterPage lang={lang} onRegisterSuccess={(u) => { login(u); navigate("/dashboard"); }} onGoToLogin={() => navigate("/login")} />;
  if (path === "/403") return <ForbiddenPage />;
  if (path === "/404") return <NotFoundPage />;
  if (path === "/dashboard") return <PrivateRoute roles={["paciente", "doctor"]}><HomePage lang={lang} user={user} onGoToAppointments={() => navigate("/citas")} onGoToProfile={() => navigate("/perfil")} /></PrivateRoute>;
  if (path === "/citas") return <PrivateRoute roles={["paciente"]}><AppointmentsPage lang={lang} user={user} onBack={() => navigate("/dashboard")} onRequestAppointment={() => navigate("/dashboard")} /></PrivateRoute>;
  if (path === "/perfil") return <PrivateRoute roles={["paciente", "doctor"]}><ProfilePage lang={lang} user={user} onBack={() => navigate("/dashboard")} /></PrivateRoute>;
  if (path === "/doctor") return <PrivateRoute roles={["doctor"]}><DoctorDashboardPage currentUser={user} setCurrentPage={(page) => navigate(page === "home" ? "/dashboard" : "/doctor")} /></PrivateRoute>;
  if (path === "/admin") return <PrivateRoute roles={["admin"]}><AdminPage lang={lang} onLogout={() => { logout(); navigate("/login", { replace: true }); }} /></PrivateRoute>;

  // Ruta comodín equivalente a *: cualquier URL no definida muestra 404.
  return <NotFoundPage />;
}
