import React from "react";
import "../../styles/components/auth/auth.css";
import { useInput } from "../../hooks/useInput";

/**
 * 비밀번호 찾기 폼
 */
export const FindPasswordForm = () => {
  const { value: email, onChange: onEmailChange } = useInput("");
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 이메일 전송 로직
    setSent(true);
  };

  return (
    <div className="loginpage-figma-card signup-figma-card">
      <div className="signup-title-area">
        <div className="signup-title">비밀번호 찾기</div>
        <div className="signup-desc">
          가입하신 이메일을 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드립니다.
        </div>
      </div>
      {!sent ? (
        <form
          className="loginpage-figma-form signup-form"
          onSubmit={handleSubmit}
        >
          <div className="signup-label">이메일</div>
          <div className="loginpage-figma-input-group">
            <input
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={onEmailChange}
              required
            />
          </div>
          <button
            type="submit"
            className="loginpage-figma-login-btn signup-btn"
          >
            비밀번호 재설정 메일 받기
          </button>
        </form>
      ) : (
        <div
          style={{ textAlign: "center", color: "#2d4053", margin: "32px 0" }}
        >
          입력하신 이메일로
          <br />
          비밀번호 재설정 링크를 전송했습니다.
        </div>
      )}
    </div>
  );
};
