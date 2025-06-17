import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/components/main/CommunityMainPage.css";
import mainhero from "../../assets/hero-main.png";
import iconUser from "../../assets/icon-user.png";
import iconHeart from "../../assets/icon-heart.png";
import iconComment from "../../assets/icon-comment.png";
import { CommunityBoards } from "../../components/main/CommunityBoards";
import { PopularPosts } from "../../components/main/PopularPosts";

/**
 * @typedef {{}} CommunityMainPageProps
 */

/**
 * CommunityMainPage Component
 * @param {CommunityMainPageProps} props
 */
export const CommunityMainPage = () => {
  return (
    <div className="community-main-page">
      {/* Hero Section */}
      <section
        className="hero-section text-white d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${mainhero})`,
        }}
      >
        {/* Content of hero section */}
      </section>

      {/* Main Article Section - 인기게시글 추천 */}
      <PopularPosts />

      {/* Sub Article Section - 커뮤니티 소개 */}
      <CommunityBoards />

      {/* Slot Section - Community Status */}
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

      {/* Slot Section - Call to Action */}
      <section className="call-to-action-section d-flex flex-column justify-content-center align-items-center py-5">
        <Container className="d-flex flex-column align-items-center gap-4 py-5 px-5">
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
    </div>
  );
};
