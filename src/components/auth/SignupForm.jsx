import React, { useRef } from "react";
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

    if (!emailCheck.checked) {
      setEmailCheck({
        checked: false,
        message: "이메일 중복확인을 해주세요",
      });
      return;
    }

    // 비밀번호 입력 검증
    if (!pw) {
      pwRef.current.setCustomValidity("비밀번호를 입력해 주세요.");
      pwRef.current.reportValidity();
      return;
    } else if (!isValidPassword(pw)) {
      pwRef.current.setCustomValidity(
        "비밀번호는 8자 이상, 알파벳과 숫자를 모두 포함해야 합니다."
      );
      pwRef.current.reportValidity();
      return;
    } else {
      pwRef.current.setCustomValidity("");
    }

    // 비밀번호 확인 입력 검증
    if (!pwCheck) {
      pwCheckRef.current.setCustomValidity("비밀번호 확인을 입력해 주세요.");
      pwCheckRef.current.reportValidity();
      return;
    } else {
      pwCheckRef.current.setCustomValidity("");
    }

    // 비밀번호 일치 검증
    if (!arePasswordsEqual(pw, pwCheck)) {
      pwCheckRef.current.setCustomValidity("비밀번호가 일치하지 않습니다.");
      pwCheckRef.current.reportValidity();
      return;
    } else {
      pwCheckRef.current.setCustomValidity("");
    }

    // 약관 동의 검증
    if (!agree.terms) {
      termsRef.current.setCustomValidity("이용약관에 동의해 주세요.");
      termsRef.current.reportValidity();
      return;
    } else {
      termsRef.current.setCustomValidity("");
    }
    if (!agree.privacy) {
      privacyRef.current.setCustomValidity("개인정보처리방침에 동의해 주세요.");
      privacyRef.current.reportValidity();
      return;
    } else {
      privacyRef.current.setCustomValidity("");
    }

    // TODO: 회원가입 API 연동

    navigate("/signup/profile");
  };

  // input 값이 바뀔 때마다 커스텀 메시지 초기화
  const handlePwChange = (e) => {
    onPwChange(e);
    pwRef.current.setCustomValidity("");
    pwCheckRef.current.setCustomValidity("");
  };
  const handlePwCheckChange = (e) => {
    onPwCheckChange(e);
    pwCheckRef.current.setCustomValidity("");
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
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="최소 8자 이상(알파벳, 숫자 필수)"
            value={pw}
            onChange={handlePwChange}
            ref={pwRef}
            required
          />
        </div>
        <div className="signup-label">비밀번호 확인</div>
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="입력한 비밀번호와 동일하게 입력해 주세요"
            value={pwCheck}
            onChange={handlePwCheckChange}
            ref={pwCheckRef}
            required
          />
        </div>
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
              ref={termsRef}
              onChange={(e) =>
                setAgree((a) => ({ ...a, terms: e.target.checked }))
              }
              required
            />{" "}
            이용약관에 동의합니다 (필수)
          </label>
          <label className="signup-checkbox">
            <input
              type="checkbox"
              checked={agree.privacy}
              ref={privacyRef}
              onChange={(e) =>
                setAgree((a) => ({ ...a, privacy: e.target.checked }))
              }
              required
            />{" "}
            개인정보처리방침에 동의합니다 (필수)
          </label>
        </div>
        <button type="submit" className="loginpage-figma-login-btn signup-btn">
          회원가입하기
        </button>
      </form>
    </div>
  );
};
