import React from "react";
import masseuki from "../../assets/masseuki.png";
import "../../styles/components/auth/auth.css";

/**
 * @typedef {object} AuthLayoutProps
 * @property {React.ReactNode} children
 */

/**
 * @param {AuthLayoutProps} props
 */
export const AuthLayout = ({ children }) => (
  <div className="loginpage-figma-bg">
    <div className="loginpage-figma-container">
      {/* 왼쪽: 소개 및 캐릭터 */}
      <div className="loginpage-figma-left">
        <div className="loginpage-figma-title">
          데브코스 수강생들을 위한 커뮤니티
          <br />
          아마추어스입니다.
        </div>
        <img src={masseuki} alt="머쓱이" className="loginpage-figma-masseuki" />
      </div>
      {/* 오른쪽: children(카드) */}
      <div className="loginpage-figma-right">
        {children}
        <div className="loginpage-figma-policy signup-policy">
          <a href="#">이용약관</a>
          <a href="#">개인정보 처리방침</a>
        </div>
      </div>
    </div>
  </div>
);
