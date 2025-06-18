import React from "react";
import "../../styles/components/auth/auth.css";

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
}) => (
  <div className="loginpage-figma-card signup-figma-card profile-setup-card">
    <div className="signup-title-area">
      <div className="signup-title">{title}</div>
      <div className="signup-desc">{desc}</div>
    </div>
    <form
      className="loginpage-figma-form signup-form profile-setup-form"
      onSubmit={onSubmit}
    >
      <div className="signup-label">이름</div>
      <div className="loginpage-figma-input-group">
        <input
          type="text"
          placeholder="이름을 입력해 주세요"
          value={name}
          onChange={onChangeName}
        />
      </div>
      <div className="signup-label">닉네임</div>
      <div className="loginpage-figma-input-group profile-nickname-group">
        <input
          type="text"
          placeholder="닉네임을 입력해 주세요"
          value={nickname}
          onChange={onChangeNickname}
        />
        <button type="button" className="profile-nickname-check-btn">
          중복확인
        </button>
      </div>
      <div className="signup-label">관심 주제 (최소 1개)</div>
      <div className="profile-topic-group">
        {INTEREST_TOPICS.map((topic) => (
          <button
            type="button"
            key={topic}
            className={`profile-topic-btn${
              selectedTopics.includes(topic) ? " selected" : ""
            }`}
            onClick={() => onTopicClick(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
      <div className="profile-topic-selected">
        선택된 주제: {selectedTopics.join(", ") || "없음"}
      </div>
      <button
        type="submit"
        className="loginpage-figma-login-btn signup-btn profile-setup-btn"
      >
        아마추어스 시작하기
      </button>
    </form>
  </div>
);
