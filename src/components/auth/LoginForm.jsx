import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kakaoLoginImg from "../../assets/kakao_login_medium_narrow.png";
import githubLoginImg from "../../assets/github_login.png";
import "../../styles/components/auth/auth.css";
import { useInput } from "../../hooks/useInput";

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const pwRef = useRef(null);

  const { value: email, onChange: onEmailChange } = useInput("");
  const { value: pw, onChange: onPwChange } = useInput("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      emailRef.current.setCustomValidity("이메일을 입력해 주세요.");
      emailRef.current.reportValidity();
      return;
    } else {
      emailRef.current.setCustomValidity("");
    }
    if (!pw) {
      pwRef.current.setCustomValidity("비밀번호를 입력해 주세요.");
      pwRef.current.reportValidity();
      return;
    } else {
      pwRef.current.setCustomValidity("");
    }
    // TODO : 추후 백엔드 인증 로직 추가
    // 더미 user 정보
    login({
      name: "홍길동",
      email: email,
      avatar: "/assets/user-icon.png",
    });
    navigate("/");
  };

  return (
    <div className="loginpage-figma-card">
      <div className="loginpage-figma-card-title">아마추어스 로그인</div>
      <form className="loginpage-figma-form" onSubmit={handleSubmit}>
        <div className="loginpage-figma-input-group">
          <input
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={onEmailChange}
            ref={emailRef}
            required
          />
        </div>
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={pw}
            onChange={onPwChange}
            ref={pwRef}
            required
          />
        </div>
        <button type="submit" className="loginpage-figma-login-btn">
          로그인하기
        </button>
      </form>
      <button
        className="loginpage-figma-signup-btn"
        onClick={() => navigate("/signup")}
      >
        이메일로 회원가입
      </button>
      <div className="loginpage-figma-findpw">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/find-account");
          }}
        >
          비밀번호 찾기
        </a>
      </div>
      <div className="loginpage-figma-divider" />
      <div className="loginpage-figma-sns-title">
        SNS 계정으로 간편하게 시작하세요
      </div>
      <div
        className="loginpage-figma-sns-btns"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        <button
          type="button"
          className="loginpage-figma-sns-btn kakao"
          style={{ padding: 0, border: "none", background: "none" }}
        >
          <img
            src={kakaoLoginImg}
            alt="카카오 로그인"
            style={{ width: 183, height: 45 }}
          />
        </button>
        <button
          type="button"
          className="loginpage-figma-sns-btn github"
          style={{ padding: 0, border: "none", background: "none" }}
        >
          <img
            src={githubLoginImg}
            alt="깃허브 로그인"
            style={{ width: 183, height: 45 }}
          />
        </button>
      </div>
    </div>
  );
};
