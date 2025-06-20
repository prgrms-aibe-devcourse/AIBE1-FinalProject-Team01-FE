import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainPage } from "../pages/main/MainPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import ProfileSetupPage from "../pages/auth/ProfileSetupPage";
import FindPasswordPage from "../pages/auth/FindPasswordPage";
import CommunityPage from "../pages/community/CommunityPage";
import CommunityWritePage from "../pages/community/CommunityWritePage";
import CommunityBoardDetailPage from "../pages/community/CommunityBoardDetailPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/profile" element={<ProfileSetupPage />} />
      <Route path="/find-account" element={<FindPasswordPage />} />
      <Route
        path="/community"
        element={<Navigate to="/community/free" replace />}
      />
      <Route path="/community/:category" element={<CommunityPage />} />
      <Route
        path="/community/:category/:postId"
        element={<CommunityBoardDetailPage />}
      />
      <Route
        path="/community/:category/write"
        element={<CommunityWritePage />}
      />
    </Routes>
  );
}
