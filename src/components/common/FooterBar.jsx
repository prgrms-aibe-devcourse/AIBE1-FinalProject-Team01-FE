import React from "react";
import { Container } from "react-bootstrap";
import "../../styles/components/common/FooterBar.css";

/**
 * @typedef {{}} FooterBarProps
 */

/**
 * FooterBar Component
 * @param {FooterBarProps} props
 */
export const FooterBar = () => {
  return (
    <div className="footer-main-wrapper">
      <div className="footer-content-area">
        <div className="footer-content-inner">
          <div className="footer-columns-wrapper">
            <div className="footer-column">
              <div className="footer-logo-text">LOGO</div>
              <div className="footer-description">
                아마추어스는 데브코스 수강생과 개발자들을 위한 커뮤니티입니다.
                함께 성장하고 지식을 나누는 공간에 여러분을 초대합니다.
              </div>
            </div>
            <div className="footer-column">
              <div className="footer-heading">카테고리</div>
              <div className="footer-link-text">커뮤니티</div>
              <div className="footer-link-text">프로젝트 허브</div>
              <div className="footer-link-text">함께해요</div>
              <div className="footer-link-text">정보게시판</div>
            </div>
            <div className="footer-column">
              <div className="footer-heading">서비스</div>
              <div className="footer-link-text">서비스 안내</div>
              <div className="footer-link-text">이용약관</div>
              <div className="footer-link-text">개인정보 처리 방침</div>
            </div>
            <div className="footer-column">
              <div className="footer-heading">정보</div>
              <div className="footer-description">
                아마추어스 개발에 참여해주세요
              </div>
              <div className="footer-social-icons">
                <div className="social-icon">
                  <div className="social-icon-shape" />
                </div>
                <div className="social-icon">
                  <div className="social-icon-shape" />
                </div>
                <div className="social-icon">
                  <div className="social-icon-shape" />
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright">Copyright 2025. Amateurs</div>
        </div>
      </div>
    </div>
  );
};
