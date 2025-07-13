import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kakaoLoginImg from "../../assets/kakao_login_medium_narrow.png";
import githubLoginImg from "../../assets/github_login.png";
import "../../styles/components/auth/auth.css";
import { useInput } from "../../hooks/useInput";
import apiClient, { loginUser } from "../../services/api";
import { convertTrackFromApi } from "../../constants/devcourse.js";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateLoginPassword = (password) => {
  return password && password.length >= 1;
};

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const redirectUrl = new URLSearchParams(location.search).get("redirectUrl");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { value: email, onChange: onEmailChange } = useInput("");
  const { value: pw, onChange: onPwChange } = useInput("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    emailRef.current.setCustomValidity("");
    pwRef.current.setCustomValidity("");

    if (!email) {
      emailRef.current.setCustomValidity("이메일을 입력해 주세요.");
      emailRef.current.reportValidity();
      return;
    } else if (!validateEmail(email)) {
      emailRef.current.setCustomValidity("유효한 이메일 형식이 아닙니다.");
      emailRef.current.reportValidity();
      return;
    }

    if (!pw) {
      pwRef.current.setCustomValidity("비밀번호를 입력해 주세요.");
      pwRef.current.reportValidity();
      return;
    } else if (!validateLoginPassword(pw)) {
      pwRef.current.setCustomValidity("비밀번호를 입력해 주세요.");
      pwRef.current.reportValidity();
      return;
    }

    setIsLoading(true);
    try {
      const loginResponse = await loginUser({ email, password: pw });

      const userResponse = await apiClient.get("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${loginResponse.accessToken}`,
        },
      });

      login(
        {
          id: userResponse.data.userId,
          name: userResponse.data.name,
          email: userResponse.data.email,
          avatar: userResponse.data.imageUrl || "/assets/user-icon.png",
          nickname: userResponse.data.nickname,
          devcourseTrack: convertTrackFromApi(userResponse.data.devcourseName),
          devcourseBatch: userResponse.data.devcourseBatch,
        },
        loginResponse.accessToken
      );

      navigate(redirectUrl || "/");
    } catch (error) {
      const safeErrorMessage =
        "이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해주세요.";
      setLoginError(safeErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginpage-figma-card">
      <div className="loginpage-figma-card-title">아마추어스 로그인</div>

      {loginError && <div className="login-error-message">{loginError}</div>}

      <form className="loginpage-figma-form" onSubmit={handleSubmit} noValidate>
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
        <button
          type="submit"
          className="loginpage-figma-login-btn"
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인하기"}
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
