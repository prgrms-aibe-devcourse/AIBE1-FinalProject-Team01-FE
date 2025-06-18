import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/auth/auth.css";

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO : 추후 백엔드 인증 로직 추가가
    // 더미 user 정보
    login({
      name: "홍길동",
      email: "test@example.com",
      avatar: "/assets/user-icon.png",
    });
    navigate("/");
  };

  return (
    <div className="loginpage-figma-card">
      <div className="loginpage-figma-card-title">아마추어스 로그인</div>
      <form className="loginpage-figma-form" onSubmit={handleSubmit}>
        <div className="loginpage-figma-input-group">
          <input type="email" placeholder="이메일을 입력해 주세요" />
        </div>
        <div className="loginpage-figma-input-group">
          <input type="password" placeholder="비밀번호를 입력해 주세요" />
        </div>
        <button type="submit" className="loginpage-figma-login-btn">
          로그인하기
        </button>
      </form>
      <button className="loginpage-figma-signup-btn">이메일로 회원가입</button>
      <div className="loginpage-figma-findpw">
        <a href="/find-account">비밀번호 찾기</a>
      </div>
      <div className="loginpage-figma-divider" />
      <div className="loginpage-figma-sns-title">
        SNS 계정으로 간편하게 시작하세요
      </div>
      <div className="loginpage-figma-sns-btns">
        <div className="loginpage-figma-sns-btn kakao">kakao</div>
        <div className="loginpage-figma-sns-btn github">github</div>
      </div>
    </div>
  );
};
