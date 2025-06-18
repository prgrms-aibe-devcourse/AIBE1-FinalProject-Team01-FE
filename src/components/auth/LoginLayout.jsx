import React from "react";
import "../../styles/components/auth/LoginPage.css";

export const LoginLayout = ({ children }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">Amateurs</div>
        {children}
        <div className="login-links">
          <a href="/signup">회원가입</a>
          <a href="/find-account">아이디/비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
};
