import React from "react";
import { Container, Row, Col } from "react-bootstrap";

/**
 * @typedef {Object} CommunityStatusSectionProps
 */

/**
 * CommunityStatusSection 컴포넌트 (커뮤니티 현황)
 * @param {CommunityStatusSectionProps} props
 */
export const CommunityStatusSection = () => {
  return (
    <section className="community-status-section d-flex flex-column justify-content-center align-items-center py-5">
      <Container className="d-flex flex-column align-items-center gap-5 px-5 py-0">
        <div className="d-flex justify-content-center align-items-center w-100 mb-4 px-0">
          <h2 className="fw-bold text-white">아마추어스 커뮤니티 현황</h2>
        </div>
        <Row className="justify-content-center gap-5 w-100">
          <Col
            md={3}
            className="community-status-item d-flex flex-column align-items-center gap-2 p-0"
          >
            <span className="fw-bold text-white count">500</span>
            <span className="fw-bold text-white label">회원 수</span>
          </Col>
          <Col
            md={3}
            className="community-status-item d-flex flex-column align-items-center gap-2 p-0"
          >
            <span className="fw-bold text-white count">332</span>
            <span className="fw-bold text-white label">수강생 회원 수</span>
          </Col>
          <Col
            md={3}
            className="community-status-item d-flex flex-column align-items-center gap-2 p-0"
          >
            <span className="fw-bold text-white count">1,392</span>
            <span className="fw-bold text-white label">게시글 수</span>
          </Col>
          <Col
            md={3}
            className="community-status-item d-flex flex-column align-items-center gap-2 p-0"
          >
            <span className="fw-bold text-white count">36</span>
            <span className="fw-bold text-white label">진행된 멘토링</span>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
