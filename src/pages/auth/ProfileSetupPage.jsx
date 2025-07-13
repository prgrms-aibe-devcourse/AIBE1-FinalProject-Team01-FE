import React, { useEffect, useState } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { ProfileForm } from "../../components/auth/ProfileForm";
import { useLocation, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authApi";
import { TOPIC_MAPPING } from "../../constants/topics";
import "../../styles/components/auth/auth.css";
import apiClient from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { convertTrackFromApi } from "../../constants/devcourse.js";

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
    const backendTopics = selectedTopics.map((topic) => TOPIC_MAPPING[topic]);

    setIsSubmitting(true);

    try {
      // OAuth
      if (isOAuthFlow) {
        await apiClient.post("/api/v1/auth/complete-profile", {
          name: name,
          nickname: nickname,
          topics: backendTopics,
        });

        const userResponse = await apiClient.get("/api/v1/users/me");

        login({
          id: userResponse.data.userId,
          name: userResponse.data.name,
          email: userResponse.data.email,
          avatar: userResponse.data.imageUrl || "/assets/user-icon.png",
          nickname: userResponse.data.nickname,
          devcourseTrack: convertTrackFromApi(userResponse.data.devcourseName),
          devcourseBatch: userResponse.data.devcourseBatch,
          providerType: userResponse.data.providerType,
          topics: userResponse.data.topics,
        });

        console.log("OAuth 프로필 완성 성공, 메인 페이지로 이동");
        navigate("/");
      } else {
        const userData = {
          email: signupData.email,
          password: signupData.password,
          name: name,
          nickname: nickname,
          topics: backendTopics,
        };

        await signupUser(userData);
        navigate("/login", {
          state: { email: signupData.email },
        });
      }
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
