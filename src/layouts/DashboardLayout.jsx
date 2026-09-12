import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "../routes/Router";
import Navbar from "../components/Navbar";
import { Outlet } from "../routes/Router";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a" }}>
      <Navbar lang={lang} setLang={setLang} user={user} onLogout={() => { logout(); navigate("/login", { replace: true }); }} currentPath={location} onNavigate={navigate} />
      <Outlet>{children}</Outlet>
    </div>
  );
}
