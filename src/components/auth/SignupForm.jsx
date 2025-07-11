import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/auth/auth.css";
import { useInput } from "../../hooks/useInput";
import { isValidPassword, arePasswordsEqual } from "../../utils/auth";
import { checkEmailDuplicate } from "../../services/authApi";

export const SignupForm = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const pwCheckRef = useRef(null);
  const termsRef = useRef(null);
  const privacyRef = useRef(null);

  const { value: pw, onChange: onPwChange } = useInput("");
  const { value: pwCheck, onChange: onPwCheckChange } = useInput("");
  const { value: email, onChange: onEmailChange } = useInput("");
  const [emailCheck, setEmailCheck] = React.useState({
    checked: false,
    message: "",
  });
  const [checking, setChecking] = React.useState(false);
  const [agree, setAgree] = React.useState({
    all: false,
    terms: false,
    privacy: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");
  const [termsError, setTermsError] = useState("");

  const handleEmailCheck = async () => {
    if (!email) {
      setEmailCheck({
        checked: false,
        message: "이메일을 입력해 주세요",
      });
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailCheck({
        checked: false,
        message: "올바른 이메일 형식이 아닙니다",
      });
      return;
    }

    setChecking(true);
    setEmailCheck({ checked: false, message: "" });

    try {
      const result = await checkEmailDuplicate(email);
      setEmailCheck({
        checked: result.available,
        message: result.message,
      });
    } catch (error) {
      setEmailCheck({
        checked: false,
        message: "중복확인 중 오류가 발생했습니다",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleEmailChange = (e) => {
    onEmailChange(e);
    setEmailCheck({ checked: false, message: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordCheckError("");
    setTermsError("");

    let hasError = false;

    // 이메일 중복확인 검증
    if (!emailCheck.checked) {
      setEmailCheck({
        checked: false,
        message: "이메일 중복확인을 해주세요",
      });
      hasError = true;
    }

    // 비밀번호 검증
    if (!pw) {
      setPasswordError("비밀번호를 입력해 주세요");
      hasError = true;
    } else if (!isValidPassword(pw)) {
      setPasswordError(
        "비밀번호는 8자 이상, 알파벳과 숫자를 모두 포함해야 합니다"
      );
      hasError = true;
    }

    // 비밀번호 확인 검증
    if (!pwCheck) {
      setPasswordCheckError("비밀번호 확인을 입력해 주세요");
      hasError = true;
    } else if (!arePasswordsEqual(pw, pwCheck)) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다");
      hasError = true;
    }

    // 약관 동의 검증
    if (!agree.terms || !agree.privacy) {
      setTermsError("필수 약관에 모두 동의해 주세요");
      hasError = true;
    }

    if (hasError) return;

    // 성공 시 다음 페이지로 데이터 전달
    navigate("/signup/profile", {
      state: {
        email: email,
        password: pw,
      },
    });
  };

  // input 값이 바뀔 때마다 커스텀 메시지 초기화
  const handlePwChange = (e) => {
    onPwChange(e);
    setPasswordError("");
    setPasswordCheckError("");
  };
  const handlePwCheckChange = (e) => {
    onPwCheckChange(e);
    setPasswordCheckError("");
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
        noValidate
      >
        <div className="signup-label">이메일</div>
        <div
          className={`loginpage-figma-input-group profile-nickname-group ${
            emailCheck.message ? (emailCheck.checked ? "success" : "error") : ""
          }`}
        >
          <input
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={handleEmailChange}
            ref={emailRef}
            required
          />
          <button
            type="button"
            className="profile-nickname-check-btn"
            onClick={handleEmailCheck}
            disabled={checking}
          >
            {checking ? "확인 중..." : "중복확인"}
          </button>
        </div>
        {emailCheck.message && (
          <div
            className={`email-check-message ${
              emailCheck.checked ? "success" : "error"
            }`}
          >
            {emailCheck.message}
          </div>
        )}
        <div className="signup-label">비밀번호</div>
        <div
          className={`loginpage-figma-input-group ${
            passwordError ? "error" : pw && isValidPassword(pw) ? "success" : ""
          }`}
        >
          <input
            type="password"
            placeholder="최소 8자 이상(알파벳, 숫자 필수)"
            value={pw}
            onChange={handlePwChange}
            ref={pwRef}
            required
          />
        </div>
        {passwordError && (
          <div className="email-check-message error">{passwordError}</div>
        )}
        <div className="signup-label">비밀번호 확인</div>
        <div
          className={`loginpage-figma-input-group ${
            passwordCheckError
              ? "error"
              : pwCheck && arePasswordsEqual(pw, pwCheck)
              ? "success"
              : ""
          }`}
        >
          <input
            type="password"
            placeholder="입력한 비밀번호와 동일하게 입력해 주세요"
            value={pwCheck}
            onChange={handlePwCheckChange}
            ref={pwCheckRef}
            required
          />
        </div>
        {passwordCheckError && (
          <div className="email-check-message error">{passwordCheckError}</div>
        )}
        <div className="signup-agree-area">
          <label className="signup-checkbox">
            <input
              type="checkbox"
              checked={agree.all}
              onChange={(e) => {
                const checked = e.target.checked;
                setAgree({ all: checked, terms: checked, privacy: checked });
              }}
            />{" "}
            전체동의
          </label>
          <label className="signup-checkbox">
            <input
              type="checkbox"
              checked={agree.terms}
              onChange={(e) => {
                const newTerms = e.target.checked;
                setAgree((prev) => ({
                  ...prev,
                  terms: newTerms,
                  all: newTerms && prev.privacy, // 둘 다 체크되면 전체동의도 체크
                }));
              }}
            />{" "}
            이용약관에 동의합니다 (필수)
          </label>
          <label className="signup-checkbox">
            <input
              type="checkbox"
              checked={agree.privacy}
              onChange={(e) => {
                const newPrivacy = e.target.checked;
                setAgree((prev) => ({
                  ...prev,
                  privacy: newPrivacy,
                  all: prev.terms && newPrivacy, // 둘 다 체크되면 전체동의도 체크
                }));
              }}
            />{" "}
            개인정보처리방침에 동의합니다 (필수)
          </label>
        </div>
        {termsError && (
          <div className="email-check-message error">{termsError}</div>
        )}
        <button type="submit" className="loginpage-figma-login-btn signup-btn">
          회원가입하기
        </button>
      </form>
    </div>
  );
};
