import React from "react";
import { useState } from "react";
import { NavigationBar } from "./components/common/NavigationBar";
import { CommunityMainPage } from "./pages/main/CommunityMainPage";
import { FooterBar } from "./components/common/FooterBar";
import { Routes, Route } from "react-router-dom";

/**
 * App 컴포넌트 (메인 페이지)
 */
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<CommunityMainPage />} />
        </Routes>
      </main>
      <FooterBar />
    </div>
  );
}

export default App;
