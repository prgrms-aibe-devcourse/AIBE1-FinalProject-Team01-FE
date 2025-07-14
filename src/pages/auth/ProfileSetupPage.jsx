import React, { useEffect, useState } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { ProfileForm } from "../../components/auth/ProfileForm";
import { useLocation, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authApi";
import { INTEREST_TOPICS } from "../../constants/topics";
import "../../styles/components/auth/auth.css";
import apiClient from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProfileSetupPage = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const signupData = location.state;
  const { login } = useAuth();

  useEffect(() => {
    const isOAuthFlow = location.pathname === "/oauth/profile-complete";

    if (!isOAuthFlow && (!signupData?.email || !signupData?.password)) {
      navigate("/signup", { replace: true });
    }
  }, [location.pathname, signupData, navigate]);

  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isOAuthFlow = location.pathname === "/oauth/profile-complete";
    const backendTopics = selectedTopics.map((topic) => INTEREST_TOPICS[topic]);

    setIsSubmitting(true);

    try {
      if (isOAuthFlow) {
        // OAuth
        await apiClient.post("/api/v1/auth/complete-profile", {
          name: name,
          nickname: nickname,
          topics: backendTopics,
        });
        console.log("OAuth 프로필 완성");
      } else {
        // 로컬 회원가입
        const userData = {
          email: signupData.email,
          password: signupData.password,
          name: name,
          nickname: nickname,
          topics: backendTopics,
        };

        await signupUser(userData);

        // 회원가입 후 자동 로그인
        await apiClient.post("/api/v1/auth/login", {
          email: signupData.email,
          password: signupData.password,
        });
        console.log("로컬 회원가입 및 자동 로그인 완료");
      }

      navigate("/");
    } catch (error) {
      console.error("프로필 설정 에러:", error);
      if (isOAuthFlow) {
        alert("프로필 완성 중 오류가 발생했습니다.");
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <ProfileForm
        name={name}
        nickname={nickname}
        selectedTopics={selectedTopics}
        isSubmitting={isSubmitting}
        onChangeName={(e) => setName(e.target.value)}
        onChangeNickname={handleNicknameChange}
        onTopicClick={handleTopicClick}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};
export default ProfileSetupPage;
