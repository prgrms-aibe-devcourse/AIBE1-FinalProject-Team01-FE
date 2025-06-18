import React from "react";
import { NavigationBar } from "./components/common/NavigationBar";
import { FooterBar } from "./components/common/FooterBar";
import { AppRouter } from "./router/Router";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith("/login");

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar onlyLogo={isLoginPage} />
        <main className="flex-fill">
          <AppRouter />
        </main>
        {!isLoginPage && <FooterBar />}
      </div>
    </AuthProvider>
  );
}
export default App;
