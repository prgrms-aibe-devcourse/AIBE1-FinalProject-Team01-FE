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
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
import { Spinner } from "react-bootstrap";

const RoleProtectedRoute = ({ children, allowedRoles = [], accessDeniedMessage }) => {
    const { isLoggedIn, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
                <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // 로그인되지 않은 경우
    if (!isLoggedIn) {
        alert("로그인이 필요한 서비스입니다.");
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirectUrl=${redirectUrl}`} replace />;
    }

    // 역할 권한이 없는 경우
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        alert(accessDeniedMessage);
        return <Navigate to="/" replace />;
    }

    return children;
};

const StudentRoute = ({ children, accessDeniedMessage = "수강생만 접근할 수 있는 페이지입니다."}) => {
    return (
        <RoleProtectedRoute allowedRoles={['ADMIN', 'STUDENT']} accessDeniedMessage={accessDeniedMessage}>
            {children}
        </RoleProtectedRoute>
    );
};

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
              <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          );
    }

    if (!isLoggedIn) {
        // 현재 경로를 redirectUrl로 설정
        alert("로그인이 필요한 서비스입니다.")
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirectUrl=${redirectUrl}`} replace />;
    }

    return children;
};

const ProfileCompleteGuard = ({ children }) => {
    const { isLoggedIn, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
                <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.isProfileCompleted) {
        alert('프로필 완성후 이용 가능 합니다');
        return <Navigate to="/oauth/profile-complete" replace />;
    }

    return children;
};

export function AppRouter() {
    return (
        <Suspense fallback={
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        </div>}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signup/profile" element={<ProfileSetupPage />} />
                <Route path="/find-account" element={<FindPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} /> 

                <Route path="/community" element={<ProtectedRoute><Navigate to="/community/free" replace /></ProtectedRoute>} />
                <Route path="/community/:boardType" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                <Route path="/community/:boardType/write" element={<ProtectedRoute><CommunityWritePage /></ProtectedRoute>} />
                <Route path="/community/:boardType/:communityId" element={<ProtectedRoute><CommunityBoardDetailPage /></ProtectedRoute>} />
                <Route path="/community/:boardType/:communityId/edit" element={<ProtectedRoute><CommunityWritePage /></ProtectedRoute>} />
                <Route path="/together" element={<StudentRoute><Navigate to="/together/gathering" replace /></StudentRoute>} />
                <Route path="/together/:boardType" element={<StudentRoute><TogetherPage /></StudentRoute>} />
                <Route path="/together/:boardType/:postId" element={<StudentRoute><TogetherBoardDetailPage /></StudentRoute>} />
                <Route path="/together/:boardType/write" element={<StudentRoute><TogetherWritePage /></StudentRoute>} />
                <Route path="/together/:boardType/:postId/edit" element={<StudentRoute><TogetherWritePage /></StudentRoute>} />
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

                <Route path="/" element={
                    <ProfileCompleteGuard>
                        <MainPage />
                    </ProfileCompleteGuard>
                } />
                <Route path="/community" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <Navigate to="/community/free" replace />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/community/:boardType" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <CommunityPage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/community/:boardType/write" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <CommunityWritePage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/community/:boardType/:communityId" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <CommunityBoardDetailPage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/community/:boardType/:communityId/edit" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <CommunityWritePage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/together" element={
                    <ProfileCompleteGuard>
                        <StudentRoute>
                            <Navigate to="/together/gathering" replace />
                        </StudentRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/together/:boardType" element={
                    <ProfileCompleteGuard>
                        <StudentRoute>
                            <TogetherPage />
                        </StudentRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/together/:boardType/:postId" element={
                    <ProfileCompleteGuard>
                        <StudentRoute>
                            <TogetherBoardDetailPage />
                        </StudentRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/together/:boardType/write" element={
                    <ProfileCompleteGuard>
                        <StudentRoute>
                            <TogetherWritePage />
                        </StudentRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/together/:boardType/:postId/edit" element={
                    <ProfileCompleteGuard>
                        <StudentRoute>
                            <TogetherWritePage />
                        </StudentRoute>
                    </ProfileCompleteGuard>
                } />

                <Route path="/info" element={
                    <ProfileCompleteGuard>
                        <Navigate to="/info/review" replace />
                    </ProfileCompleteGuard>
                } />
                <Route path="/info/:boardType" element={
                    <ProfileCompleteGuard>
                        <InfoPage />
                    </ProfileCompleteGuard>
                } />
                <Route path="/info/:boardType/:itId" element={
                    <ProfileCompleteGuard>
                        <InfoBoardDetailPage />
                    </ProfileCompleteGuard>
                } />
                <Route path="/info/:boardType/write" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <InfoWritePage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/info/:boardType/:itId/edit" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <InfoWritePage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />

                <Route path="/hub" element={
                    <ProfileCompleteGuard>
                        <HubPage />
                    </ProfileCompleteGuard>
                } />
                <Route path="/hub/:projectId" element={
                    <ProfileCompleteGuard>
                        <HubDetailPage />
                    </ProfileCompleteGuard>
                } />
                <Route path="/hub/:projectId/edit" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <HubWritePage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/hub/write" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <HubWritePage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />

                <Route path="/dm" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <DMPage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
                <Route path="/mypage" element={
                    <ProfileCompleteGuard>
                        <ProtectedRoute>
                            <MyPage />
                        </ProtectedRoute>
                    </ProfileCompleteGuard>
                } />
            </Routes>
        </Suspense>
    );
}
