import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainPage = lazy(() => import("../pages/main/MainPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const SignupPage = lazy(() => import("../pages/auth/SignupPage"));
const ProfileSetupPage = lazy(() => import("../pages/auth/ProfileSetupPage"));
const FindPasswordPage = lazy(() => import("../pages/auth/FindPasswordPage"));
const CommunityPage = lazy(() => import("../pages/community/CommunityPage"));
const CommunityWritePage = lazy(() => import("../pages/community/CommunityWritePage"));
const CommunityBoardDetailPage = lazy(() => import("../pages/community/CommunityBoardDetailPage"));
const TogetherPage = lazy(() => import("../pages/together/TogetherPage"));
const TogetherBoardDetailPage = lazy(() => import("../pages/together/TogetherBoardDetailPage"));
const TogetherWritePage = lazy(() => import("../pages/together/TogetherWritePage"));
const InfoPage = lazy(() => import("../pages/info/InfoPage"));
const InfoBoardDetailPage = lazy(() => import("../pages/info/InfoBoardDetailPage"));
const InfoWritePage = lazy(() => import("../pages/info/InfoWritePage"));
const HubPage = lazy(() => import("../pages/hub/HubPage"));
const HubDetailPage = lazy(() => import("../pages/hub/HubDetailPage"));
const HubWritePage = lazy(() => import("../pages/hub/HubWritePage"));
const MyPage = lazy(() => import("../pages/mypage/MyPage"));
const DMPage = lazy(() => import("../pages/dm/DMPage"));
const OAuthCallbackPage = lazy(() => import("../pages/auth/OAuthCallbackPage"));

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
        <Suspense fallback={<div>로딩 중...</div>}>
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
                <Route path="/together" element={<ProtectedRoute><Navigate to="/together/gathering" replace /></ProtectedRoute>} />
                <Route path="/together/:boardType" element={<ProtectedRoute><TogetherPage /></ProtectedRoute>} />
                <Route path="/together/:boardType/:postId" element={<ProtectedRoute><TogetherBoardDetailPage /></ProtectedRoute>} />
                <Route path="/together/:boardType/write" element={<ProtectedRoute><TogetherWritePage /></ProtectedRoute>} />
                <Route path="/together/:boardType/:postId/edit" element={<ProtectedRoute><TogetherWritePage /></ProtectedRoute>} />
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
                <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
                <Route path="/oauth/profile-complete" element={<ProfileSetupPage />} />
            </Routes>
        </Suspense>
    );
}
