import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";

export default function App() {
  const [lang, setLang] = useState("es");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Redirección especial si ingresa como Admin
    if (userData.role === "admin" || userData.email === "Admin") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("home");
    }
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("login");
  };

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
          user={user}
          onLogout={handleLogout}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onGoToProfile={() => setCurrentPage("profile")}
        />
      )}

      {currentPage === "admin" && (
        <AdminPage lang={lang} onLogout={handleLogout} />
      )}

      {currentPage === "doctor-dashboard" && user && (
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

      {currentPage === "appointments" && user && (
        <AppointmentsPage
          lang={lang}
          user={user}
          onBack={() => setCurrentPage("home")}
          onRequestAppointment={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "profile" && user && (
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
