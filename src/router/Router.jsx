import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainPage } from "../pages/main/MainPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import ProfileSetupPage from "../pages/auth/ProfileSetupPage";
import FindPasswordPage from "../pages/auth/FindPasswordPage";
import CommunityPage from "../pages/community/CommunityPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/profile" element={<ProfileSetupPage />} />
      <Route path="/find-account" element={<FindPasswordPage />} />
      <Route path="/community" element={<CommunityPage />} />
    </Routes>
  );
}
