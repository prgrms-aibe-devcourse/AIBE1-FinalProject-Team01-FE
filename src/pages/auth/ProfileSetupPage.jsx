import React, { useState } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { ProfileForm } from "../../components/auth/ProfileForm";
import { useNavigate } from "react-router-dom";
import "../../styles/components/auth/auth.css";

const ProfileSetupPage = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 관심 주제를 string 형태로 변환
    const topicsString = selectedTopics.join(",");
    // TODO: 실제 저장 로직 (예: API 호출)
    console.log({ name, nickname, topics: topicsString });
    // 저장 후 홈으로 이동
    navigate("/");
  };

  return (
    <AuthLayout>
      <ProfileForm
        name={name}
        nickname={nickname}
        selectedTopics={selectedTopics}
        onChangeName={(e) => setName(e.target.value)}
        onChangeNickname={handleNicknameChange}
        onTopicClick={handleTopicClick}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};

export default ProfileSetupPage;
