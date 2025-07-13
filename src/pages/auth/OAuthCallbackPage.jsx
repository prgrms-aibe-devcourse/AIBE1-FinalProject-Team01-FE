import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/api";
import { convertTrackFromApi } from "../../constants/devcourse.js";

export const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const completed = searchParams.get("completed");
  const error = searchParams.get("error");
  const socialType = searchParams.get("socialType");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (error) {
        console.error("소셜 로그인 에러:", error, "Provider:", socialType);
        alert(`소셜 로그인 실패: ${decodeURIComponent(error)}`);
        navigate("/login");
        return;
      }

      if (completed === "true") {
        try {
          const userResponse = await apiClient.get("/api/v1/users/me");

          login({
            id: userResponse.data.userId,
            name: userResponse.data.name,
            email: userResponse.data.email,
            avatar: userResponse.data.imageUrl || "/assets/user-icon.png",
            nickname: userResponse.data.nickname,
            devcourseTrack: convertTrackFromApi(
              userResponse.data.devcourseName
            ),
            devcourseBatch: userResponse.data.devcourseBatch,
            providerType: userResponse.data.providerType,
          });

          console.log("소셜 로그인 성공, 메인 페이지로 이동");
          navigate("/");
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          alert("로그인 처리 중 오류가 발생했습니다.");
          navigate("/login");
        }
      } else if (completed === "false") {
        // 프로필 미완성 사용자 - 프로필 완성 페이지로
        console.log("소셜 로그인 성공, 프로필 완성 필요");
        navigate("/oauth/profile-complete");
      } else {
        // 잘못된 콜백
        console.error("잘못된 OAuth 콜백 파라미터");
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [completed, error, socialType, navigate, login]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p>소셜 로그인 처리 중...</p>
      </div>
    </div>
  );
};
