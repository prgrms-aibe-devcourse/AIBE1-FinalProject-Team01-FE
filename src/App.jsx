import React from "react";
import { useLocation } from "react-router-dom";
import { NavigationBar } from "./components/common/NavigationBar";
import { FooterBar } from "./components/common/FooterBar";
import { AppRouter } from "./router/Router";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const hideNavOnPaths = ["/login", "/signup"];

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar onlyLogo={hideNavOnPaths.includes(location.pathname)} />
      <main className="flex-fill">
        <AppRouter />
      </main>
      {!hideNavOnPaths.includes(location.pathname) && <FooterBar />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
