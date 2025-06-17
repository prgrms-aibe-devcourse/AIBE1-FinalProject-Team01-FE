import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/components/main/CommunityMainPage.css";
import mainhero from "../../assets/hero-main.png";
import iconUser from "../../assets/icon-user.png";
import iconHeart from "../../assets/icon-heart.png";
import iconComment from "../../assets/icon-comment.png";
import { CommunityBoards } from "../../components/main/CommunityBoards";

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

      {/* Main Article Section - Popular Posts */}
      <section className="main-article-section d-flex flex-column justify-content-center align-items-center py-5">
        <Container className="main-article-container d-flex flex-column align-items-center gap-4 py-5 px-5">
          <div className="d-flex justify-content-center align-items-center w-100 mb-4">
            <h2 className="fw-bold">인기 게시글</h2>
          </div>
          <Row className="justify-content-center gap-4 w-100">
            {/* Popular Post Card Column 1 */}
            <Col md={4} className="p-0">
              <Card className="popular-post-card d-flex flex-column justify-content-center border-0">
                <Card.Body className="d-flex flex-column justify-content-center p-0">
                  <div className="board-title d-flex justify-content-center align-items-center gap-2 mb-2 p-2">
                    <span className="fw-bold">자유게시판</span>
                  </div>
                  <div className="d-flex flex-column justify-content-start align-items-start p-0">
                    <Card.Title className="fw-bold mb-2 p-0">
                      생성형 백엔드 데브코스 ㄹㅇ후기 알려줌
                    </Card.Title>
                    <div className="user-info d-flex justify-content-between align-items-center w-100 p-0">
                      <div className="d-flex align-items-center gap-1 p-0">
                        <img
                          src={iconUser}
                          alt="User Icon"
                          style={{ width: "21px", height: "20px" }}
                        />
                        <Card.Text className="mb-0">김유저</Card.Text>
                        <div className="dot"></div>
                        <Card.Text className="mb-0">3시간 전</Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          className="action-button d-flex align-items-center gap-1 p-0"
                        >
                          <img
                            src={iconHeart}
                            alt="Heart Icon"
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span>2</span>
                        </Button>
                        <Button
                          variant="light"
                          className="action-button message d-flex align-items-center gap-1 p-0"
                        >
                          <img
                            src={iconComment}
                            alt="Message Icon"
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span>18</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Popular Post Card Column 2 */}
            <Col md={4} className="p-0">
              <Card className="popular-post-card d-flex flex-column justify-content-center border-0">
                <Card.Body className="d-flex flex-column justify-content-center p-0">
                  <div className="board-title d-flex justify-content-center align-items-center gap-2 mb-2 p-2">
                    <span className="fw-bold">자유게시판</span>
                  </div>
                  <div className="d-flex flex-column justify-content-start align-items-start p-0">
                    <Card.Title className="fw-bold mb-2 p-0">
                      생성형 백엔드 데브코스 ㄹㅇ후기 알려줌
                    </Card.Title>
                    <div className="user-info d-flex justify-content-between align-items-center w-100 p-0">
                      <div className="d-flex align-items-center gap-1 p-0">
                        <img
                          src={iconUser}
                          alt="User Icon"
                          style={{ width: "21px", height: "20px" }}
                        />
                        <Card.Text className="mb-0">김유저</Card.Text>
                        <div className="dot"></div>
                        <Card.Text className="mb-0">3시간 전</Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          className="action-button d-flex align-items-center gap-1 p-0"
                        >
                          <img
                            src={iconHeart}
                            alt="Heart Icon"
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span>2</span>
                        </Button>
                        <Button
                          variant="light"
                          className="action-button message d-flex align-items-center gap-1 p-0"
                        >
                          <img
                            src={iconComment}
                            alt="Message Icon"
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span>18</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Popular Post Card Column 3 */}
            <Col md={4} className="p-0">
              <Card className="popular-post-card d-flex flex-column justify-content-center border-0">
                <Card.Body className="d-flex flex-column justify-content-center p-0">
                  <div className="board-title d-flex justify-content-center align-items-center gap-2 mb-2 p-2">
                    <span className="fw-bold">자유게시판</span>
                  </div>
                  <div className="d-flex flex-column justify-content-start align-items-start p-0">
                    <Card.Title className="fw-bold mb-2 p-0">
                      생성형 백엔드 데브코스 ㄹㅇ후기 알려줌
                    </Card.Title>
                    <div className="user-info d-flex justify-content-between align-items-center w-100 p-0">
                      <div className="d-flex align-items-center gap-1 p-0">
                        <img
                          src={iconUser}
                          alt="User Icon"
                          style={{ width: "21px", height: "20px" }}
                        />
                        <Card.Text className="mb-0">김유저</Card.Text>
                        <div className="dot"></div>
                        <Card.Text className="mb-0">3시간 전</Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          className="action-button d-flex align-items-center gap-1 p-0"
                        >
                          <img
                            src={iconHeart}
                            alt="Heart Icon"
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span>2</span>
                        </Button>
                        <Button
                          variant="light"
                          className="action-button message d-flex align-items-center gap-1 p-0"
                        >
                          <img
                            src={iconComment}
                            alt="Message Icon"
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span>18</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Button
            variant="light"
            className="view-more-button d-flex align-items-center gap-2 px-4 py-3 mt-4"
          >
            <span className="fw-bold">더 많은 게시글 보기</span>
            <img
              src={iconComment}
              alt="Arrow Right"
              style={{ width: "20px", height: "20px" }}
            />
          </Button>
        </Container>
      </section>

      {/* Sub Article Section - Community Boards */}
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
