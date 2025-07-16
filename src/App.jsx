import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { NavigationBar } from "./components/common/NavigationBar";
import { FooterBar } from "./components/common/FooterBar";
import { AppRouter } from "./router/Router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PageTransition } from "./components/common/PageTransition";
import ScrollToTop from "./components/common/ScrollToTop";

function AppContent() {
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();

  const hideNavOnPaths = [
    "/login",
    "/signup",
    "/signup/profile",
    "/find-account",
    "/reset-password", 
    "/oauth/profile-complete",
  ];

  if (isLoggedIn && user && !user.isProfileCompleted) {
    if (location.pathname === "/signup/profile" || location.pathname === "/oauth/profile-complete") {
      return (
        <div className="d-flex flex-column min-vh-100">
          <ScrollToTop />
          <NavigationBar onlyLogo={true} />
          <main className="flex-fill">
            <PageTransition>
              <AppRouter />
            </PageTransition>
          </main>
        </div>
      );
    }
    
    return <Navigate to="/oauth/profile-complete" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <NavigationBar onlyLogo={hideNavOnPaths.includes(location.pathname)} />
      <main className="flex-fill">
        <PageTransition>
          <AppRouter />
        </PageTransition>
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
