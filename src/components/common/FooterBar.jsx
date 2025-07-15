import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/components/common/FooterBar.css";

/**
 * @typedef {{}} FooterBarProps
 */

/**
 * FooterBar Component
 * @param {FooterBarProps} props
 */
export const FooterBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="footer-main-wrapper">
      <div className="footer-content-area">
        <div className="footer-content-inner">
          <div className="footer-columns-wrapper">
            <div className="footer-column">
              <div className="footer-logo-text" onClick={() => handleNavigation('/') } style={{ cursor: 'pointer' }}>Amateurs</div>
              <div className="footer-description">
                아마추어스는 데브코스 수강생과 개발자들을 위한 커뮤니티입니다.
                함께 성장하고 지식을 나누는 공간에 여러분을 초대합니다.
              </div>
            </div>
            <div className="footer-column">
              <div className="footer-heading">카테고리</div>
              <div
                  className="footer-link-text"
                  onClick={() => handleNavigation('/community')}
                  style={{ cursor: 'pointer' }}
              >커뮤니티</div>
              <div
                  className="footer-link-text"
                  onClick={() => handleNavigation('/hub')}
                  style={{ cursor: 'pointer' }}
              >프로젝트 허브</div>
              <div
                  className="footer-link-text"
                  onClick={() => handleNavigation('/together')}
                  style={{ cursor: 'pointer' }}
              >함께해요</div>
              <div
                  className="footer-link-text"
                  onClick={() => handleNavigation('/info')}
                  style={{ cursor: 'pointer' }}
              >정보게시판</div>
            </div>
            <div className="footer-column">
              <div className="footer-heading">서비스</div>
              <div className="footer-link-text">서비스 안내</div>
              <div className="footer-link-text">이용약관</div>
              <div className="footer-link-text">개인정보 처리 방침</div>
            </div>
            <div className="footer-column">
              <div className="footer-heading">정보</div>
              <div className="footer-description">이메일: daycodingdan@gmail.com</div>
              <div className="footer-description">전화번호: 02-1234-5678</div>
              <div className="footer-description">사업자등록번호: 123-45-67890</div>
              <div className="footer-description">위치: 서울특별시 아마구 추어스로 123</div>
            </div>
          </div>
          <div className="footer-copyright">Copyright 2025. Amateurs</div>
        </div>
      </div>
    </div>
  );
};
