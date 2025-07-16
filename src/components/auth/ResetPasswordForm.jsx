import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../../services/api";
import { useInput } from "../../hooks/useInput";
import { isValidPassword, arePasswordsEqual } from "../../utils/auth";
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
  const [error, setError] = useState(""); // 전체 폼 에러
  const [success, setSuccess] = useState(false);
  
  // 개별 필드 에러
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("유효하지 않은 링크입니다.");
    }
  }, [token]);

  // 비밀번호 입력시 실시간 검증
  const handlePasswordChange = (e) => {
    onNewPasswordChange(e);
    setError(""); // 전체 에러 초기화
    setPasswordError(""); // 개별 에러 초기화
    setConfirmPasswordError("");
  };

  // 비밀번호 확인 입력시 실시간 검증
  const handleConfirmPasswordChange = (e) => {
    onConfirmPasswordChange(e);
    setError("");
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모든 에러 초기화
    setError("");
    setPasswordError("");
    setConfirmPasswordError("");
    
    let hasError = false;

    if (!token) {
      setError("유효하지 않은 토큰입니다.");
      return;
    }

    // 개별 필드 검증
    if (!newPassword) {
      setPasswordError("새 비밀번호를 입력해 주세요");
      hasError = true;
    } else if (!isValidPassword(newPassword)) {
      setPasswordError("비밀번호는 8자 이상, 알파벳과 숫자를 모두 포함해야 합니다");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("비밀번호 확인을 입력해 주세요");
      hasError = true;
    } else if (!arePasswordsEqual(newPassword, confirmPassword)) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

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

      {/* 전체 폼 에러 메시지 */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <form
        className="loginpage-figma-form signup-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="signup-label">새 비밀번호</div>
        <div
          className={`loginpage-figma-input-group ${
            passwordError ? "error" : newPassword && isValidPassword(newPassword) ? "success" : ""
          }`}
        >
          <input
            type="password"
            placeholder="최소 8자 이상(알파벳, 숫자 필수)"
            value={newPassword}
            onChange={handlePasswordChange}
            required
            disabled={loading}
            minLength="8"
          />
        </div>
        {/* 개별 필드 에러 메시지 */}
        {passwordError && (
          <div className="email-check-message error" role="alert" aria-live="polite">
            {passwordError}
          </div>
        )}

        <div className="signup-label">새 비밀번호 확인</div>
        <div
            className={`loginpage-figma-input-group ${
                confirmPasswordError 
                ? "error" 
                : confirmPassword && 
                    isValidPassword(newPassword) &&
                    arePasswordsEqual(newPassword, confirmPassword)
                    ? "success" 
                    : ""
            }`}
        >
          <input
            type="password"
            placeholder="새 비밀번호를 다시 입력해 주세요"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            disabled={loading}
            minLength="8"
          />
        </div>
        {/* 개별 필드 에러 메시지 */}
        {confirmPasswordError && (
          <div className="email-check-message error" role="alert" aria-live="polite">
            {confirmPasswordError}
          </div>
        )}

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