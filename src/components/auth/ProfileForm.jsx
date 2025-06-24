import React, { useRef, useState } from "react";
import "../../styles/components/auth/auth.css";
import { INTEREST_TOPICS } from "../../constants/topics";

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
      nicknameRef.current.focus();
      return;
    }
    setChecking(true);
    setNicknameCheck({ checked: false, message: "" });
    try {
      // TODO: 닉네임 중복 확인 API
      // const res = await fetch(`/api/check-nickname?nickname=${encodeURIComponent(nickname)}`);
      // const data = await res.json();
      // if (data.exists) {
      //   setNicknameCheck({ checked: false, message: "이미 사용 중인 닉네임입니다." });
      // } else {
      //   setNicknameCheck({ checked: true, message: "사용 가능한 닉네임입니다." });
      // }
      // 임시 더미 로직 (닉네임이 'admin'이면 중복)
      if (nickname === "admin") {
        setNicknameCheck({
          checked: false,
          message: "이미 사용 중인 닉네임입니다.",
        });
      } else {
        setNicknameCheck({
          checked: true,
          message: "사용 가능한 닉네임입니다.",
        });
      }
    } catch (err) {
      setNicknameCheck({
        checked: false,
        message: "중복 확인 중 오류가 발생했습니다.",
      });
    }
    setChecking(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      nameRef.current.setCustomValidity("이름을 입력해 주세요.");
      nameRef.current.reportValidity();
      return;
    } else {
      nameRef.current.setCustomValidity("");
    }
    if (!nickname) {
      nicknameRef.current.setCustomValidity("닉네임을 입력해 주세요.");
      nicknameRef.current.reportValidity();
      return;
    } else {
      nicknameRef.current.setCustomValidity("");
    }
    if (!nicknameCheck.checked) {
      setNicknameCheck((prev) => ({
        ...prev,
        message: "닉네임 중복 확인을 해주세요.",
      }));
      nicknameRef.current.focus();
      return;
    }
    if (selectedTopics.length < 1) {
      setTopicError("관심 주제를 최소 1개 선택해 주세요.");
      return;
    } else if (selectedTopics.length > 3) {
      setTopicError("관심 주제는 최대 3개까지 선택할 수 있습니다.");
      return;
    } else {
      setTopicError("");
    }
    onSubmit(e);
  };

  const handleNameChange = (e) => {
    onChangeName(e);
    nameRef.current.setCustomValidity("");
  };
  const handleNicknameChange = (e) => {
    onChangeNickname(e);
    nicknameRef.current.setCustomValidity("");
    setNicknameCheck({ checked: false, message: "" }); // 닉네임 변경 시 중복확인 초기화
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
        <div className="loginpage-figma-input-group">
          <input
            type="text"
            placeholder="이름을 입력해 주세요"
            value={name}
            onChange={handleNameChange}
            ref={nameRef}
            required
          />
        </div>
        <div className="signup-label">닉네임</div>
        <div className="loginpage-figma-input-group profile-nickname-group">
          <input
            type="text"
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChange={handleNicknameChange}
            ref={nicknameRef}
            required
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
          <div style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
            {topicError}
          </div>
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
