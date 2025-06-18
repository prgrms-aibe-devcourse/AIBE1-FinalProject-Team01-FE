import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/auth/auth.css";

export const SignupForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 회원가입 처리 후
    navigate("/signup/profile");
  };

  return (
    <div className="loginpage-figma-card signup-figma-card">
      <div className="signup-title-area">
        <div className="signup-title">회원가입</div>
        <div className="signup-desc">
          회원가입에 필요한 기본정보를 입력해주세요
        </div>
      </div>
      <form
        className="loginpage-figma-form signup-form"
        onSubmit={handleSubmit}
      >
        <div className="signup-label">이메일</div>
        <div className="loginpage-figma-input-group">
          <input type="email" placeholder="이메일을 입력해 주세요" />
        </div>
        <div className="signup-label">비밀번호</div>
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="최소 6자 이상(알파벳, 숫자 필수)"
          />
        </div>
        <div className="signup-label">비밀번호 확인</div>
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="입력한 비밀번호와 동일하게 입력해 주세요"
          />
        </div>
        <div className="signup-agree-area">
          <label className="signup-checkbox">
            <input type="checkbox" /> 전체동의
          </label>
          <label className="signup-checkbox">
            <input type="checkbox" /> 이용약관에 동의합니다 (필수)
          </label>
          <label className="signup-checkbox">
            <input type="checkbox" /> 개인정보처리방침에 동의합니다 (필수)
          </label>
        </div>
        <button type="submit" className="loginpage-figma-login-btn signup-btn">
          회원가입하기
        </button>
      </form>
    </div>
  );
};
