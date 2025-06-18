import React from "react";
import { Routes, Route } from "react-router-dom";
import { CommunityMainPage } from "../pages/main/CommunityMainPage";
import { LoginPage } from "../pages/auth/LoginPage";

export function AppRouter({ onLogin }) {
  return (
    <Routes>
      <Route path="/" element={<CommunityMainPage />} />
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
    </Routes>
  );
}
