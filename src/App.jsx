import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { SpaRouter } from "./routes/Router";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SpaRouter>
          <AppRoutes />
        </SpaRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
