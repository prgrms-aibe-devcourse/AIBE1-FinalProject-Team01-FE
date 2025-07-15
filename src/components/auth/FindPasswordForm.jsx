import React, { useState } from "react";
import { requestPasswordReset } from "../../services/api";
import "../../styles/components/auth/auth.css";
import { useInput } from "../../hooks/useInput";

/**
 * 비밀번호 찾기 폼
 */
export const FindPasswordForm = () => {
  const { value: email, onChange: onEmailChange } = useInput("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "이메일 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
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
      
      {error && (
        <div style={{ color: "red", marginBottom: "16px", textAlign: "center" }}>
          {error}
        </div>
      )}

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
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="loginpage-figma-login-btn signup-btn d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading && (
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {loading ? "이메일 전송 중..." : "비밀번호 재설정 메일 받기"}
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