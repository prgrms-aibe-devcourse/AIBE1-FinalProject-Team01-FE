import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MainPage } from "../pages/main/MainPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import ProfileSetupPage from "../pages/auth/ProfileSetupPage";
import FindPasswordPage from "../pages/auth/FindPasswordPage";
import CommunityPage from "../pages/community/CommunityPage";
import CommunityWritePage from "../pages/community/CommunityWritePage";
import CommunityBoardDetailPage from "../pages/community/CommunityBoardDetailPage";
import TogetherPage from "../pages/together/TogetherPage";
import TogetherBoardDetailPage from "../pages/together/TogetherBoardDetailPage";
import TogetherWritePage from "../pages/together/TogetherWritePage";
import InfoPage from "../pages/info/InfoPage";
import InfoBoardDetailPage from "../pages/info/InfoBoardDetailPage";
import InfoWritePage from "../pages/info/InfoWritePage";
import HubPage from "../pages/hub/HubPage";
import HubDetailPage from "../pages/hub/HubDetailPage";
import MyPage from "../pages/mypage/MyPage";
import DMPage from "../pages/dm/DMPage";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!isLoggedIn) {
        // 현재 경로를 redirectUrl로 설정
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirectUrl=${redirectUrl}`} replace />;
    }

    return children;
};

export function AppRouter() {
    const protectedRoutes = [
        { path: "/community/:boardType/write", component: CommunityWritePage },
        { path: "/community/:boardType/:communityId/edit", component: CommunityWritePage },
        { path: "/community/:boardType/:communityId", component: CommunityBoardDetailPage },
        { path: "/community/:boardType", component: CommunityPage },
        { path: "/dm", component: DMPage },
        { path: "/mypage", component: MyPage },
    ];

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/profile" element={<ProfileSetupPage />} />
      <Route path="/find-account" element={<FindPasswordPage />} />
      <Route path="/dm" element={<DMPage />} />
        <Route path="/community/*" element={
            <ProtectedRoute>
                <Routes>
                    <Route path="/" element={<Navigate to="FREE" replace />} />
                    <Route path=":boardType/write" element={<CommunityWritePage />} />
                    <Route path=":boardType/:communityId/edit" element={<CommunityWritePage />} />
                    <Route path=":boardType/:communityId" element={<CommunityBoardDetailPage />} />
                    <Route path=":boardType" element={<CommunityPage />} />
                </Routes>
            </ProtectedRoute>
        } />
        <Route
        path="/together"
        element={<Navigate to="/together/GATHERING" replace />}
      />
      <Route path="/together/:category" element={<TogetherPage />} />
      <Route
        path="/together/:category/:postId"
        element={<TogetherBoardDetailPage />}
      />
      <Route path="/together/:category/write" element={<TogetherWritePage />} />
      <Route path="/info" element={<Navigate to="/info/REVIEW" replace />} />
      <Route path="/info/:boardType" element={<InfoPage />} />
      <Route
        path="/info/:boardType/:itId"
        element={<InfoBoardDetailPage />}
      />
      <Route path="/info/:boardType/write" element={<InfoWritePage />} />
      <Route path="/info/:boardType/:itId/edit" element={<InfoWritePage />} />
      <Route path="/HUB" element={<HubPage />} />
      <Route path="/HUB/:postId" element={<HubDetailPage />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}
