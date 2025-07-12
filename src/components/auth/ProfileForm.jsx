import React, { useRef, useState } from "react";
import "../../styles/components/auth/auth.css";
import { INTEREST_TOPICS } from "../../constants/topics";
import { checkNicknameDuplicate } from "../../services/authApi";

/**
 * @typedef {Object} ProfileFormProps
 * @property {string} name
 * @property {string} nickname
 * @property {string[]} selectedTopics
 * @property {function} onChangeName
 * @property {function} onChangeNickname
 * @property {function} onTopicClick
 * @property {function} onSubmit
 * @property {string} [title]
 * @property {string} [desc]
 */

/**
 * @param {ProfileFormProps} props
 */
export const ProfileForm = ({
  name,
  nickname,
  selectedTopics,
  onChangeName,
  onChangeNickname,
  onTopicClick,
  onSubmit,
  title = "프로필 정보",
  desc = "서비스 시작을 위해 프로필을 작성해 주세요",
}) => {
  const nameRef = useRef(null);
  const nicknameRef = useRef(null);
  const [nameError, setNameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [topicError, setTopicError] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState({
    checked: false,
    message: "",
  });
  const [checking, setChecking] = useState(false);

  // 닉네임 중복확인
  const handleNicknameCheck = async () => {
    if (!nickname) {
      setNicknameCheck({ checked: false, message: "닉네임을 입력해 주세요." });
      return;
    }

    setChecking(true);
    setNicknameCheck({ checked: false, message: "" });

    try {
      const result = await checkNicknameDuplicate(nickname);
      setNicknameCheck({
        checked: result.available,
        message: result.message,
      });
    } catch (error) {
      setNicknameCheck({
        checked: false,
        message: "중복확인 중 오류가 발생했습니다",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setNameError("");
    setNicknameError("");
    setTopicError("");

    let hasError = false;

    // 이름 검증
    if (!name) {
      setNameError("이름을 입력해 주세요");
      hasError = true;
    } else if (name.length > 10) {
      setNameError("이름은 10글자 이하로 입력해 주세요");
      hasError = true;
    }

    // 닉네임 검증
    if (!nickname) {
      setNicknameError("닉네임을 입력해 주세요");
      hasError = true;
    } else if (nickname.length > 15) {
      setNicknameError("닉네임은 15글자 이하로 입력해 주세요");
      hasError = true;
    } else if (!nicknameCheck.checked) {
      setNicknameError("닉네임 중복 확인을 해주세요");
      hasError = true;
    }

    // 관심 주제 검증
    if (selectedTopics.length < 1) {
      setTopicError("관심 주제를 최소 1개 선택해 주세요");
      hasError = true;
    } else if (selectedTopics.length > 3) {
      setTopicError("관심 주제는 최대 3개까지 선택할 수 있습니다");
      hasError = true;
    }

    if (hasError) return;

    onSubmit(e);
  };

  const handleNameChange = (e) => {
    onChangeName(e);
    setNameError("");
  };

  const handleNicknameChange = (e) => {
    onChangeNickname(e);
    setNicknameError("");
    setNicknameCheck({ checked: false, message: "" });
  };

  const handleTopicClick = (topic) => {
    if (selectedTopics.includes(topic)) {
      onTopicClick(topic);
      setTopicError("");
    } else if (selectedTopics.length < 3) {
      onTopicClick(topic);
      setTopicError("");
    } else {
      setTopicError("관심 주제는 최대 3개까지 선택할 수 있습니다.");
    }
  };

  return (
    <div className="loginpage-figma-card signup-figma-card profile-setup-card">
      <div className="signup-title-area">
        <div className="signup-title">{title}</div>
        <div className="signup-desc">{desc}</div>
      </div>
      <form
        className="loginpage-figma-form signup-form profile-setup-form"
        onSubmit={handleSubmit}
      >
        <div className="signup-label">이름</div>
        <div
          className={`loginpage-figma-input-group ${
            nameError ? "error" : name && name.length <= 10 ? "success" : ""
          }`}
        >
          <input
            type="text"
            placeholder="이름을 입력해 주세요 (10글자 이하)"
            value={name}
            onChange={handleNameChange}
            ref={nameRef}
          />
        </div>
        {nameError && (
          <div className="email-check-message error">{nameError}</div>
        )}
        <div className="signup-label">닉네임</div>
        <div
          className={`loginpage-figma-input-group profile-nickname-group ${
            nicknameError
              ? "error"
              : nickname && nickname.length <= 15 && nicknameCheck.checked
              ? "success"
              : ""
          }`}
        >
          <input
            type="text"
            placeholder="닉네임을 입력해 주세요(15글자 이하)"
            value={nickname}
            onChange={handleNicknameChange}
            ref={nicknameRef}
          />
          <button
            type="button"
            className="profile-nickname-check-btn"
            onClick={handleNicknameCheck}
            disabled={checking}
          >
            {checking ? "확인 중..." : "중복확인"}
          </button>
        </div>
        {nicknameError && (
          <div className="email-check-message error">{nicknameError}</div>
        )}
        {nicknameCheck.message && (
          <div
            style={{
              color: nicknameCheck.checked ? "green" : "red",
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            {nicknameCheck.message}
          </div>
        )}
        <div className="signup-label">관심 주제 (최소 1개, 최대 3개)</div>
        <div className="profile-topic-group">
          {INTEREST_TOPICS.map((topic) => (
            <button
              type="button"
              key={topic}
              className={`profile-topic-btn${
                selectedTopics.includes(topic) ? " selected" : ""
              }`}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        <div className="profile-topic-selected">
          선택된 주제: {selectedTopics.join(", ") || "없음"}
        </div>
        {topicError && (
          <div className="email-check-message error">{topicError}</div>
        )}
        <button
          type="submit"
          className="loginpage-figma-login-btn signup-btn profile-setup-btn"
        >
          아마추어스 시작하기
        </button>
      </form>
    </div>
  );
};
