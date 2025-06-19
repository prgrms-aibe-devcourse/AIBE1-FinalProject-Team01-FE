import React from "react";
import { Container, Button } from "react-bootstrap";

/**
 * @typedef {Object} CallToActionSectionProps
 */

/**
 * CallToActionSection 컴포넌트 (가입/커뮤니티 CTA)
 * @param {CallToActionSectionProps} props
 */
export const CallToActionSection = () => {
  return (
    <section className="call-to-action-section d-flex flex-column justify-content-center align-items-center py-5">
      <Container className="d-flex flex-column align-items-center gap-4 px-5">
        <h2 className="fw-bold">아마추어스와 함께 성장하세요</h2>
        <p className="text-center">
          데브코스 수강생들을 위한 최고의 커뮤니티에 가입해보세요
          <br />타 기수 수강생, 수료생들과 교류하고 다양한 정보를 얻을 수
          있습니다
        </p>
        <div className="d-flex gap-3 mt-3">
          <Button variant="dark" className="px-5 py-3">
            가입하기
          </Button>
          <Button variant="outline-dark" className="px-5 py-3">
            커뮤니티
          </Button>
        </div>
      </Container>
    </section>
  );
};
