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
import HubWritePage from "../pages/hub/HubWritePage";
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
        alert("로그인이 필요한 서비스입니다.")
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirectUrl=${redirectUrl}`} replace />;
    }

    return children;
};


export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/profile" element={<ProfileSetupPage />} />
            <Route path="/find-account" element={<FindPasswordPage />} />

            <Route path="/community" element={<ProtectedRoute><Navigate to="/community/free" replace /></ProtectedRoute>} />
            <Route path="/community/:boardType" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
            <Route path="/community/:boardType/write" element={<ProtectedRoute><CommunityWritePage /></ProtectedRoute>} />
            <Route path="/community/:boardType/:communityId" element={<ProtectedRoute><CommunityBoardDetailPage /></ProtectedRoute>} />
            <Route path="/community/:boardType/:communityId/edit" element={<ProtectedRoute><CommunityWritePage /></ProtectedRoute>} />
            <Route path="/together" element={<ProtectedRoute><Navigate to="/together/GATHERING" replace /></ProtectedRoute>} />
            <Route path="/together/:boardType" element={<ProtectedRoute><TogetherPage /></ProtectedRoute>} />
            <Route path="/together/:boardType/:postId" element={<ProtectedRoute><TogetherBoardDetailPage /></ProtectedRoute>} />
            <Route path="/together/:boardType/write" element={<ProtectedRoute><TogetherWritePage /></ProtectedRoute>} />
            <Route path="/info" element={<Navigate to="/info/review" replace />} />
            <Route path="/info/:boardType" element={<InfoPage />} />
            <Route path="/info/:boardType/:itId" element={<InfoBoardDetailPage />} />
            <Route path="/info/:boardType/write" element={<ProtectedRoute><InfoWritePage /></ProtectedRoute>} />
            <Route path="/info/:boardType/:itId/edit" element={<ProtectedRoute><InfoWritePage /></ProtectedRoute>} />

            <Route path="/hub" element={<HubPage />} />
            <Route path="/hub/:projectId" element={<HubDetailPage />} />
            <Route path="/hub/:projectId/edit" element={<ProtectedRoute><HubWritePage /></ProtectedRoute>} />
            <Route path="/hub/write" element={<ProtectedRoute><HubWritePage /></ProtectedRoute>} />

            <Route path="/dm" element={<ProtectedRoute><DMPage /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        </Routes>
    );
}
