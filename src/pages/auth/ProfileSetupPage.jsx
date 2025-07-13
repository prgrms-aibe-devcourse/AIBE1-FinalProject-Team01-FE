import React, { useState } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { ProfileForm } from "../../components/auth/ProfileForm";
import { useNavigate } from "react-router-dom";
import "../../styles/components/auth/auth.css";

const INTEREST_TOPICS = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI/CC",
  "Algorithm",
  "Android",
  "iOS",
  "게임개발",
  "LLM",
  "WEB",
  "Data Science",
  "DB",
  "Build&Sec",
  "Design",
];

const ProfileSetupPage = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [nicknameCheck, setNicknameCheck] = useState({
    checked: false,
    message: "",
  });
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // 닉네임 중복확인
  const handleNicknameCheck = async () => {
    if (!nickname) {
      setNicknameCheck({ checked: false, message: "닉네임을 입력해 주세요." });
      return;
    }
    setChecking(true);
    setNicknameCheck({ checked: false, message: "" });
    // TODO: 실제 API 연동
    if (nickname === "admin") {
      setNicknameCheck({
        checked: false,
        message: "이미 사용 중인 닉네임입니다.",
      });
    } else {
      setNicknameCheck({ checked: true, message: "사용 가능한 닉네임입니다." });
    }
    setChecking(false);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setNicknameCheck({ checked: false, message: "" });
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
        nicknameCheck={nicknameCheck}
        checking={checking}
        onNicknameCheck={handleNicknameCheck}
      />
    </AuthLayout>
  );
};

export default ProfileSetupPage;
