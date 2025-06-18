import React, { useState } from "react";
import { NavigationBar } from "./components/common/NavigationBar";
import { FooterBar } from "./components/common/FooterBar";
import { AppRouter } from "./router/Router";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-fill">
          <AppRouter />
        </main>
        <FooterBar />
      </div>
    </AuthProvider>
  );
}
export default App;
