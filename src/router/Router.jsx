import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";

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

const useAlert = () => {
    const [isAlertShown, setIsAlertShown] = useState(false);
    const timeoutRef = useRef(null);

    const showAlert = (message) => {
        if (!isAlertShown) {
            setIsAlertShown(true);
            alert(message);
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(() => {
                setIsAlertShown(false);
            }, 3000);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return showAlert;
};


const RoleProtectedRoute = ({ children, allowedRoles = [], accessDeniedMessage }) => {
    const { isLoggedIn, user, loading } = useAuth();
    const location = useLocation();
    const showAlert = useAlert();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        if (!loading) {
            setHasCheckedAuth(true);
        }
    }, [loading]);

    if (loading || !hasCheckedAuth) {
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
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        showAlert("로그인이 필요한 서비스입니다.");
        return <Navigate to={`/login?redirectUrl=${redirectUrl}`} replace />;
    }

    // 역할 권한이 없는 경우
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        showAlert(accessDeniedMessage);
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
    const showAlert = useAlert();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        if (!loading) {
            setHasCheckedAuth(true);
        }
    }, [loading]);

    if (loading || !hasCheckedAuth) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
              <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          );
    }

    if (!isLoggedIn) {
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        showAlert("로그인이 필요한 서비스입니다.");
        return <Navigate to={`/login?redirectUrl=${redirectUrl}`} replace />;
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
                <Route path="/" element={<MainPage />} />
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
                <Route path="/info/:boardType/write" element={<StudentRoute><InfoWritePage /></StudentRoute>} />
                <Route path="/info/:boardType/:itId/edit" element={<StudentRoute><InfoWritePage /></StudentRoute>} />
                <Route path="/hub" element={<HubPage />} />
                <Route path="/hub/:projectId" element={<HubDetailPage />} />
                <Route path="/hub/:projectId/edit" element={<StudentRoute><HubWritePage /></StudentRoute>} />
                <Route path="/hub/write" element={<StudentRoute><HubWritePage /></StudentRoute>} />

                <Route path="/dm" element={<ProtectedRoute><DMPage /></ProtectedRoute>} />
                <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
                <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
                <Route path="/oauth/profile-complete" element={<ProfileSetupPage />} />
            </Routes>
        </Suspense>
    );
}