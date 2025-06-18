import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/auth/auth.css";

export const SignupForm = () => {
  const navigate = useNavigate();
  const pwRef = useRef(null);
  const pwCheckRef = useRef(null);
  const termsRef = useRef(null);
  const privacyRef = useRef(null);

  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [agree, setAgree] = useState({
    all: false,
    terms: false,
    privacy: false,
  });

  // 비밀번호 규칙 체크 함수
  const isValidPassword = (pw) =>
    pw.length >= 6 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 비밀번호 입력 검증
    if (!pw) {
      pwRef.current.setCustomValidity("비밀번호를 입력해 주세요.");
      pwRef.current.reportValidity();
      return;
    } else if (!isValidPassword(pw)) {
      pwRef.current.setCustomValidity(
        "비밀번호는 6자 이상, 알파벳과 숫자를 모두 포함해야 합니다."
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
    if (pw !== pwCheck) {
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

    // 모든 검증 통과 시
    navigate("/signup/profile");
  };

  // input 값이 바뀔 때마다 커스텀 메시지 초기화
  const handlePwChange = (e) => {
    setPw(e.target.value);
    pwRef.current.setCustomValidity("");
    // 비밀번호 확인도 같이 초기화
    pwCheckRef.current.setCustomValidity("");
  };
  const handlePwCheckChange = (e) => {
    setPwCheck(e.target.value);
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
      >
        <div className="signup-label">이메일</div>
        <div className="loginpage-figma-input-group">
          <input type="email" placeholder="이메일을 입력해 주세요" required />
        </div>
        <div className="signup-label">비밀번호</div>
        <div className="loginpage-figma-input-group">
          <input
            type="password"
            placeholder="최소 6자 이상(알파벳, 숫자 필수)"
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
