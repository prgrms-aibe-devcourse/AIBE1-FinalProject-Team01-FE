import React, { useEffect, useState } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { ProfileForm } from "../../components/auth/ProfileForm";
import { useLocation, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authApi";
import { TOPIC_MAPPING } from "../../constants/topics";
import "../../styles/components/auth/auth.css";

const ProfileSetupPage = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const signupData = location.state;

  useEffect(() => {
    if (!signupData?.email || !signupData?.password) {
      navigate("/signup", { replace: true });
    }
  }, []);

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

    const backendTopics = selectedTopics.map((topic) => TOPIC_MAPPING[topic]);

    const userData = {
      email: signupData.email,
      password: signupData.password,
      name: name,
      nickname: nickname,
      topics: backendTopics,
    };

    setIsSubmitting(true);

    try {
      await signupUser(userData);
      navigate("/");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
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
