import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import { useAuth } from "./context/AuthContext";

function getInitialPage(userData, can) {
  if (!userData) return "login";
  if (can("admin.acceder")) return "admin";
  return "home";
}

export default function App() {
  const { user, loading, can, logout } = useAuth();
  const [lang, setLang] = useState("es");
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(() => {
    if (loading) return;
    setCurrentPage((page) => {
      if (!user && !["login", "register"].includes(page)) {
        return "login";
      }
      if (user && ["login", "register"].includes(page)) {
        return getInitialPage(user, can);
      }
      if (page === "admin" && !can("admin.acceder")) {
        return getInitialPage(user, can);
      }
      if (page === "doctor-dashboard" && !can("doctor.panel")) {
        return "home";
      }
      if (page === "appointments" && !can("citas.listar")) {
        return "home";
      }
      if (page === "profile" && !can("perfil.ver")) {
        return "home";
      }
      return page;
    });
  }, [user, loading, can]);

  const handleLoginSuccess = (userData) => {
    setCurrentPage(getInitialPage(userData, (key) => userData?.permissions?.includes(key)));
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("home");
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage("login");
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
        {lang === "en" ? "Loading session..." : "Cargando sesión..."}
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      {currentPage !== "admin" && (
        <Navbar
          lang={lang}
          setLang={setLang}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onGoToProfile={() => setCurrentPage("profile")}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "admin" && can("admin.acceder") && (
        <AdminPage lang={lang} onLogout={handleLogout} />
      )}

      {currentPage === "doctor-dashboard" && user && can("doctor.panel") && (
        <DoctorDashboardPage
          lang={lang}
          user={user}
          onBack={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "home" && (
        <HomePage
          lang={lang}
          user={user}
          onGoToLogin={() => setCurrentPage("login")}
          onGoToAppointments={() => setCurrentPage("appointments")}
          onGoToProfile={() => setCurrentPage("profile")}
        />
      )}

      {currentPage === "appointments" && user && can("citas.listar") && (
        <AppointmentsPage
          lang={lang}
          user={user}
          onBack={() => setCurrentPage("home")}
          onRequestAppointment={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "profile" && user && can("perfil.ver") && (
        <ProfilePage
          lang={lang}
          user={user}
          onBack={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "login" && (
        <LoginPage
          lang={lang}
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage
          lang={lang}
          onRegisterSuccess={handleRegisterSuccess}
          onGoToLogin={() => setCurrentPage("login")}
        />
      )}
    </div>
  );
}
