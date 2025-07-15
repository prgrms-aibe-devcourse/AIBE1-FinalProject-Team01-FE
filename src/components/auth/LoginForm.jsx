import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kakaoLoginImg from "../../assets/kakao_login_medium_narrow.png";
import githubLoginImg from "../../assets/github_login.png";
import "../../styles/components/auth/auth.css";
import { useInput } from "../../hooks/useInput";
import apiClient, { loginUser } from "../../services/api";
import { isValidEmail } from "../../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const LoginForm = () => {
  const { login, refreshUserInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const redirectUrl = new URLSearchParams(location.search).get("redirectUrl");
  const welcomeEmail = location.state?.email;

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { value: email, onChange: onEmailChange } = useInput(
    welcomeEmail || ""
  );
  const { value: pw, onChange: onPwChange } = useInput("");

  const getErrorMessage = (error) => {
    if (!error.response) {
      return "네트워크 연결을 확인해주세요.";
    }
    
    switch (error.response.status) {
      case 400:
        return "비밀번호가 일치하지 않습니다.";
      case 401:
        return "이메일 또는 비밀번호가 올바르지 않습니다.";
      case 404:
        return "존재하지 않는 사용자입니다.";
      case 500:
      case 502:
      case 503:
        return "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      default:
        return "로그인 중 오류가 발생했습니다.";
    }
  };

  // 실시간 이메일 검증
  const handleEmailChange = (e) => {
    onEmailChange(e);
    setLoginError("");
    setEmailError("");

    const emailValue = e.target.value;
    if (emailValue && !isValidEmail(emailValue)) {
      setEmailError("올바른 이메일 형식이 아닙니다");
    }
  };

  const handlePasswordChange = (e) => {
    onPwChange(e);
    setLoginError("");
    setPasswordError("");
  };

  // Enter 키 처리
  const handleKeyPress = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("이메일을 입력해 주세요");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다");
      hasError = true;
    }

    if (!pw) {
      setPasswordError("비밀번호를 입력해 주세요.");
      hasError = true;
    }

    if (hasError) {
      setTimeout(() => {
        if (!email || !isValidEmail(email)) {
          emailRef.current?.focus();
        } else if (!pw) {
          pwRef.current?.focus();
        }
      }, 100);
      return;
    }

    setIsLoading(true);
    try {
      await loginUser({
        email,
        password: pw,
      });

      await refreshUserInfo();

      navigate(redirectUrl || "/");
    } catch (error) {
      console.error("로그인 에러:", error);
      setLoginError(getErrorMessage(error));

      // 특정 에러에 따라 포커스 이동
      if (error.response?.status === 401) {
        pwRef.current?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    if (isLoading) return;
    console.log("카카오 OAuth 로그인 시작...");
    window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleGithubLogin = () => {
    if (isLoading) return;
    console.log("깃허브 OAuth 로그인 시작...");
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
  };

  return (
    <div className="loginpage-figma-card">
      <div className="loginpage-figma-card-title">
        {welcomeEmail ? "회원가입 완료! 로그인하세요" : "아마추어스 로그인"}
      </div>

      {welcomeEmail && (
        <div className="welcome-message">
          🎉 회원가입이 완료되었습니다! 로그인해주세요.
        </div>
      )}

      {loginError && (
        <div className="error-message">
          ⚠️ {loginError}
        </div>
      )}

      <form className="loginpage-figma-form" onSubmit={handleSubmit} noValidate>
        <div
          className={`loginpage-figma-input-group ${
            emailError ? "error" : email && isValidEmail(email) ? "success" : ""
          }`}
        >
          <input
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={handleEmailChange}
            onKeyPress={(e) => handleKeyPress(e, pwRef)}
            ref={emailRef}
            disabled={isLoading}
            autoComplete="email"
            required
          />
        </div>
        {emailError && (
          <div
            className="email-check-message error"
            role="alert"
            aria-live="polite"
          >
            {emailError}
          </div>
        )}

        <div
          className={`loginpage-figma-input-group ${
            passwordError ? "error" : pw ? "success" : ""
          }`}
        >
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={pw}
            onChange={handlePasswordChange}
            onKeyPress={(e) => handleKeyPress(e)}
            ref={pwRef}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
        </div>
        {passwordError && (
          <div className="input-error-message" role="alert" aria-live="polite">
            {passwordError}
          </div>
        )}
        <button
          type="submit"
          className="loginpage-figma-login-btn"
          disabled={isLoading || !email || !pw}
        >
          {isLoading ? "로그인 중..." : "로그인하기"}
        </button>
      </form>

      <button
        className="loginpage-figma-signup-btn"
        onClick={() => navigate("/signup")}
        disabled={isLoading}
      >
        이메일로 회원가입
      </button>

      <div className="loginpage-figma-findpw">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoading) {
              navigate("/find-account");
            }
          }}
        >
          비밀번호 찾기
        </a>
      </div>

      <div className="loginpage-figma-divider" />

      <div className="loginpage-figma-sns-title">
        SNS 계정으로 간편하게 시작하세요
      </div>

      <div className="loginpage-figma-sns-btns">
        <button
          type="button"
          className={`loginpage-figma-sns-btn kakao ${
            isLoading ? "disabled" : ""
          }`}
          disabled={isLoading}
          onClick={handleKakaoLogin}
        >
          <img src={kakaoLoginImg} alt="카카오 로그인" />
        </button>

        <button
          type="button"
          className={`loginpage-figma-sns-btn github ${
            isLoading ? "disabled" : ""
          }`}
          disabled={isLoading}
          onClick={handleGithubLogin}
        >
          <img src={githubLoginImg} alt="깃허브 로그인" />
        </button>
      </div>
    </div>
  );
};
