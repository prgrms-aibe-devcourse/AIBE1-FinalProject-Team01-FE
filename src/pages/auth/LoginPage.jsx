import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/auth/LoginPage.css";

/**
 * LoginPage 컴포넌트
 */
export const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 여기서 백엔드 로그인 API 호출 예정
    // 예: axios.post('/api/v1/auth/login', { userId, password })

    onLogin(); // App에서 전달한 로그인 상태 변경 함수 호출
    navigate("/"); // 로그인 후 메인 페이지로 이동
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">Amateurs</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="userId">아이디</label>
          <input
            id="userId"
            name="userId"
            type="text"
            placeholder="아이디를 입력하세요"
          />
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>
        <div className="login-links">
          <a href="/signup">회원가입</a>
          <a href="/find-account">아이디/비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
};
