import React, { useState } from "react";
import { NavigationBar } from "./components/common/NavigationBar";
import { FooterBar } from "./components/common/FooterBar";
import { AppRouter } from "./router/Router";

/**
 * App 컴포넌트 (메인 페이지)
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="flex-fill">
        <AppRouter onLogin={handleLogin} />
      </main>
      <FooterBar />
    </div>
  );
}

export default App;
