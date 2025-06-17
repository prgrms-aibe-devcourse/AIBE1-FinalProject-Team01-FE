import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import { NavigationBar } from "./components/NavigationBar";
import { MainContent } from "./components/MainContent";
import { FooterBar } from "./components/FooterBar";

/**
 * App 컴포넌트 (메인 페이지)
 */
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <main className="flex-fill">
        <MainContent />
      </main>
      <FooterBar />
    </div>
  );
}

export default App;
