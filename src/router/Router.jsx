import React from "react";
import { Routes, Route } from "react-router-dom";
import { CommunityMainPage } from "../pages/main/CommunityMainPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import ProfileSetupPage from "../pages/auth/ProfileSetupPage";
import FindPasswordPage from "../pages/auth/FindPasswordPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CommunityMainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/profile" element={<ProfileSetupPage />} />
      <Route path="/find-account" element={<FindPasswordPage />} />
    </Routes>
  );
}
