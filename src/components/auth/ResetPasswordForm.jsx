import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../../services/api";
import { useInput } from "../../hooks/useInput";
import "../../styles/components/auth/auth.css";

/**
 * 비밀번호 재설정 폼
 */
export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { value: newPassword, onChange: onNewPasswordChange } = useInput("");
  const { value: confirmPassword, onChange: onConfirmPasswordChange } = useInput("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("유효하지 않은 링크입니다.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError("유효하지 않은 토큰입니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await confirmPasswordReset(token, newPassword, confirmPassword);
      setSuccess(true);
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "비밀번호 재설정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="loginpage-figma-card signup-figma-card">
        <div className="signup-title-area">
          <div className="signup-title">비밀번호 재설정 완료</div>
          <div className="signup-desc">
            비밀번호가 성공적으로 변경되었습니다.
            <br />
            잠시 후 로그인 페이지로 이동합니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loginpage-figma-card signup-figma-card">
      <div className="signup-title-area">
        <div className="signup-title">새 비밀번호 설정</div>
        <div className="signup-desc">
          새로운 비밀번호를 입력해 주세요.
        </div>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "16px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <form
        className="loginpage-figma-form signup-form"
        onSubmit={handleSubmit}
      >
        <div className="signup-label">새 비밀번호</div>
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="새 비밀번호를 입력해 주세요"
            value={newPassword}
            onChange={onNewPasswordChange}
            required
            disabled={loading}
            minLength="8"
          />
        </div>

        <div className="signup-label">새 비밀번호 확인</div>
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="새 비밀번호를 다시 입력해 주세요"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            required
            disabled={loading}
            minLength="8"
          />
        </div>

        <button
          type="submit"
          className="loginpage-figma-login-btn signup-btn"
          disabled={loading || !token}
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
};