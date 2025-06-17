import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import heroBackground from "../assets/hero-background.png";
// import iconUser from "../assets/icon-user.svg";
// import iconHeart from "../assets/icon-heart.svg";
// import iconMessageCircle from "../assets/icon-message-circle.svg";
// import iconImage from "../assets/icon-image.svg";
// import iconInfo from "../assets/icon-info.svg";
// import iconInstagram from "../assets/icon-instagram.svg";
// import iconLink from "../assets/icon-link.svg";
// import iconPlus from "../assets/icon-plus.svg";
// import iconArrowRight from "../assets/icon-arrow-right.svg";

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
          backgroundColor: "#202B3D", // Placeholder background color
          // backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          width: "100%",
        }}
      >
        {/* Content of hero section */}
        <h1 style={{ color: "white" }}>데브코스 수강생들을 위한 커뮤니티</h1>
        <p className="mt-2" style={{ color: "white", fontSize: "18px" }}>
          수강생 인증하고 아마추어스와 함께 성장하세요
        </p>
        <p style={{ color: "white", fontSize: "18px" }}>
          으쓱이와 함께하는 IT 커뮤니티
        </p>
      </section>

      {/* Main Article Section - Popular Posts */}
      <section
        className="main-article-section d-flex flex-column justify-content-center align-items-center py-5"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          minHeight: "818px",
        }}
      >
        <Container
          className="d-flex flex-column align-items-center gap-4 py-5 px-5"
          style={{ maxWidth: "1200px", height: "auto" }}
        >
          <div className="d-flex justify-content-center align-items-center w-100 mb-4">
            <h2
              className="fw-bold"
              style={{
                fontSize: "36px",
                lineHeight: "0.88",
                letterSpacing: "-1%",
                color: "#0C151C",
              }}
            >
              인기 게시글
            </h2>
          </div>
          <Row className="justify-content-center gap-4 w-100">
            {/* Popular Post Card 1 (only one for dynamic loading) */}
            <Col md={12} className="p-0">
              <Card
                className="d-flex flex-column justify-content-center border-0"
                style={{
                  width: "100%",
                  height: "77px",
                  borderBottom: "1px solid #7F7F7F20",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-center p-0">
                  <div
                    className="d-flex justify-content-center align-items-center gap-2 mb-2 p-2"
                    style={{ width: "192px", height: "32px" }}
                  >
                    <span
                      className="fw-bold"
                      style={{
                        fontSize: "20px",
                        lineHeight: "1.6em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      자유게시판
                    </span>
                  </div>
                  <div className="d-flex flex-column justify-content-start align-items-start p-0">
                    <Card.Title
                      className="fw-bold mb-2 p-0"
                      style={{
                        fontSize: "20px",
                        lineHeight: "1.4em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      생성형 백엔드 데브코스 ㄹㅇ후기 알려줌
                    </Card.Title>
                    <div
                      className="d-flex justify-content-between align-items-center w-100 p-0"
                      style={{ minWidth: "374px" }}
                    >
                      <div
                        className="d-flex align-items-center gap-1 p-0"
                        style={{ width: "133px" }}
                      >
                        {/* <img src={iconUser} alt="User Icon" style={{ width: "21px", height: "20px" }} /> */}
                        <span
                          style={{
                            width: "21px",
                            height: "20px",
                            backgroundColor: "#ccc",
                            display: "inline-block",
                          }}
                        ></span>
                        {/* Placeholder */}
                        <Card.Text
                          className="mb-0"
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.42",
                            letterSpacing: "-1%",
                            color: "#0C151C",
                          }}
                        >
                          김유저
                        </Card.Text>
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: "#0C151C",
                          }}
                        ></div>
                        <Card.Text
                          className="mb-0"
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.42",
                            letterSpacing: "-1%",
                            color: "#0C151C",
                          }}
                        >
                          3시간 전
                        </Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          className="d-flex align-items-center gap-1 p-0"
                          style={{
                            minWidth: "46px",
                            minHeight: "46px",
                            borderRadius: "5px",
                          }}
                        >
                          {/* <img src={iconHeart} alt="Heart Icon" style={{ width: "20px", height: "20px" }} /> */}
                          <span
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#ccc",
                              display: "inline-block",
                            }}
                          ></span>
                          {/* Placeholder */}
                          <span
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.71",
                              color: "#0C151C",
                            }}
                          >
                            2
                          </span>
                        </Button>
                        <Button
                          variant="light"
                          className="d-flex align-items-center gap-1 p-0"
                          style={{ minWidth: "46px", minHeight: "46px" }}
                        >
                          {/* <img src={iconMessageCircle} alt="Message Icon" style={{ width: "20px", height: "20px" }} /> */}
                          <span
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#ccc",
                              display: "inline-block",
                            }}
                          ></span>
                          {/* Placeholder */}
                          <span
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.42",
                              letterSpacing: "-1%",
                              color: "#000000",
                            }}
                          >
                            18
                          </span>
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
            className="d-flex align-items-center gap-2 px-4 py-3 mt-4"
            style={{
              backgroundColor: "#FBFBFD",
              borderColor: "#2D4053",
              borderWidth: "1px",
              borderRadius: "6px",
              color: "#2D4053",
              height: "48px",
              width: "200px",
            }}
          >
            <span
              className="fw-bold"
              style={{
                fontSize: "16px",
                lineHeight: "1.5em",
                letterSpacing: "-1%",
              }}
            >
              더 많은 게시글 보기
            </span>
            {/* <img src={iconArrowRight} alt="Arrow Right" style={{ width: "20px", height: "20px" }} /> */}
            <span
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#ccc",
                display: "inline-block",
              }}
            ></span>
            {/* Placeholder */}
          </Button>
        </Container>
      </section>

      {/* Sub Article Section - Community Boards */}
      <section
        className="sub-article-section d-flex flex-column justify-content-center align-items-center py-5"
        style={{
          backgroundColor: "#F9FAFB",
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          minHeight: "947px",
        }}
      >
        <Container
          className="d-flex flex-column align-items-center gap-4 py-5 px-5"
          style={{ maxWidth: "1200px", height: "auto" }}
        >
          <div
            className="d-flex justify-content-center align-items-center w-100 mb-4 px-0"
            style={{ width: "1198px", height: "71px" }}
          >
            <h2
              className="fw-bold"
              style={{
                fontSize: "36px",
                lineHeight: "0.88",
                letterSpacing: "-1%",
                color: "#0C151C",
              }}
            >
              아마추어스 커뮤니티
            </h2>
          </div>
          <Row
            className="justify-content-center gap-4 w-100 px-5"
            style={{ width: "1200px", minHeight: "692px" }}
          >
            {/* Board Card 1 */}
            <Col md={4} className="p-0">
              <Card
                className="d-flex flex-column justify-content-stretch align-items-stretch border-2"
                style={{
                  width: "373px",
                  height: "293px",
                  borderRadius: "8px",
                  borderColor: "#2D3648",
                  backgroundColor: "#FFFFFF",
                  position: "relative",
                }}
              >
                <Card.Body
                  className="d-flex flex-column align-items-center gap-3 p-0"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                  }}
                >
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <div
                      className="bg-light d-flex justify-content-center align-items-center"
                      style={{
                        width: "384px",
                        height: "174px",
                        backgroundColor: "#EDF0F7",
                        borderBottom: "2px solid #2D3648",
                      }}
                    >
                      {/* <img src={iconImage} alt="Image Placeholder" style={{ width: "40px", height: "40px" }} /> */}
                      <span
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#ccc",
                          display: "inline-block",
                        }}
                      ></span>
                      {/* Placeholder */}
                    </div>
                  </div>
                  <div
                    className="d-flex flex-column gap-2 px-3"
                    style={{ width: "auto", height: "auto" }}
                  >
                    <Card.Title
                      className="fw-bold"
                      style={{
                        fontSize: "20px",
                        lineHeight: "1.6em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      자유 게시판
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.5em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      개발과 관련된 다양한 주제로 자유롭게 소통해요
                      <br />
                      잡담, 정보 공유, 회고까지 모두 환영합니다
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Board Card 2 */}
            <Col md={4} className="p-0">
              <Card
                className="d-flex flex-column justify-content-stretch align-items-stretch border-2"
                style={{
                  width: "373px",
                  height: "293px",
                  borderRadius: "8px",
                  borderColor: "#2D3648",
                  backgroundColor: "#FFFFFF",
                  position: "relative",
                }}
              >
                <Card.Body
                  className="d-flex flex-column align-items-center gap-3 p-0"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                  }}
                >
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <div
                      className="bg-light d-flex justify-content-center align-items-center"
                      style={{
                        width: "384px",
                        height: "174px",
                        backgroundColor: "#EDF0F7",
                        borderBottom: "2px solid #2D3648",
                      }}
                    >
                      {/* <img src={iconImage} alt="Image Placeholder" style={{ width: "40px", height: "40px" }} /> */}
                      <span
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#ccc",
                          display: "inline-block",
                        }}
                      ></span>
                      {/* Placeholder */}
                    </div>
                  </div>
                  <div
                    className="d-flex flex-column gap-2 px-3"
                    style={{ width: "auto", height: "auto" }}
                  >
                    <Card.Title
                      className="fw-bold"
                      style={{
                        fontSize: "20px",
                        lineHeight: "1.6em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      질문 및 토론
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.5em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      공부 중 궁금한 내용을 물어보고 토론해요
                      <br />
                      으쓱이의 답변도 받을 수 있어요
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Board Card 3 */}
            <Col md={4} className="p-0">
              <Card
                className="d-flex flex-column justify-content-stretch align-items-stretch border-2"
                style={{
                  width: "373px",
                  height: "293px",
                  borderRadius: "8px",
                  borderColor: "#2D3648",
                  backgroundColor: "#FFFFFF",
                  position: "relative",
                }}
              >
                <Card.Body
                  className="d-flex flex-column align-items-center gap-3 p-0"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                  }}
                >
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <div
                      className="bg-light d-flex justify-content-center align-items-center"
                      style={{
                        width: "384px",
                        height: "174px",
                        backgroundColor: "#EDF0F7",
                        borderBottom: "2px solid #2D3648",
                      }}
                    >
                      {/* <img src={iconImage} alt="Image Placeholder" style={{ width: "40px", height: "40px" }} /> */}
                      <span
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#ccc",
                          display: "inline-block",
                        }}
                      ></span>
                      {/* Placeholder */}
                    </div>
                  </div>
                  <div
                    className="d-flex flex-column gap-2 px-3"
                    style={{ width: "auto", height: "auto" }}
                  >
                    <Card.Title
                      className="fw-bold"
                      style={{
                        fontSize: "20px",
                        lineHeight: "1.6em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      프로젝트 허브
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.5em",
                        letterSpacing: "-1%",
                        color: "#0C151C",
                      }}
                    >
                      데브코스 중 진행한 프로젝트가 모여있어요
                      <br />
                      수강생들의 완성도 높은 아이디어를 확인해 보세요
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Slot Section - Community Status */}
      <section
        className="slot-section d-flex flex-column justify-content-center align-items-center py-5"
        style={{
          backgroundColor: "#202B3D",
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          minHeight: "322px",
        }}
      >
        <Container
          className="d-flex flex-column align-items-center gap-5 px-5 py-0"
          style={{ maxWidth: "1200px", height: "auto" }}
        >
          <div
            className="d-flex justify-content-center align-items-center w-100 mb-4 px-0"
            style={{ width: "1198px", height: "71px" }}
          >
            <h2
              className="fw-bold text-white"
              style={{
                fontSize: "36px",
                lineHeight: "0.88",
                letterSpacing: "-1%",
              }}
            >
              아마추어스 커뮤니티 현황
            </h2>
          </div>
          <Row className="justify-content-center gap-5 w-100">
            <Col
              md={3}
              className="d-flex flex-column align-items-center gap-2 p-0"
            >
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "40px",
                  lineHeight: "0.8em",
                  letterSpacing: "-1%",
                }}
              >
                500
              </span>
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "20px",
                  lineHeight: "1.6em",
                  letterSpacing: "-1%",
                }}
              >
                회원 수
              </span>
            </Col>
            <Col
              md={3}
              className="d-flex flex-column align-items-center gap-2 p-0"
            >
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "40px",
                  lineHeight: "0.8em",
                  letterSpacing: "-1%",
                }}
              >
                332
              </span>
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "20px",
                  lineHeight: "1.6em",
                  letterSpacing: "-1%",
                }}
              >
                수강생 회원 수
              </span>
            </Col>
            <Col
              md={3}
              className="d-flex flex-column align-items-center gap-2 p-0"
            >
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "40px",
                  lineHeight: "0.8em",
                  letterSpacing: "-1%",
                }}
              >
                1,392
              </span>
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "20px",
                  lineHeight: "1.6em",
                  letterSpacing: "-1%",
                }}
              >
                게시글 수
              </span>
            </Col>
            <Col
              md={3}
              className="d-flex flex-column align-items-center gap-2 p-0"
            >
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "40px",
                  lineHeight: "0.8em",
                  letterSpacing: "-1%",
                }}
              >
                36
              </span>
              <span
                className="fw-bold text-white"
                style={{
                  fontSize: "20px",
                  lineHeight: "1.6em",
                  letterSpacing: "-1%",
                }}
              >
                진행된 멘토링
              </span>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Slot Section - Call to Action */}
      <section
        className="slot-section d-flex flex-column justify-content-center align-items-center py-5"
        style={{
          backgroundColor: "#FFFFFF",
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          minHeight: "334px",
        }}
      >
        <Container
          className="d-flex flex-column align-items-center gap-4 py-5 px-5"
          style={{ maxWidth: "1200px", height: "auto" }}
        >
          <h2
            className="fw-bold"
            style={{
              fontSize: "36px",
              lineHeight: "0.88",
              letterSpacing: "-1%",
              color: "#0C151C",
            }}
          >
            아마추어스와 함께 성장하세요
          </h2>
          <p
            className="text-center"
            style={{
              fontSize: "16px",
              lineHeight: "1.62",
              letterSpacing: "-1%",
              color: "#0C151C",
            }}
          >
            데브코스 수강생들을 위한 최고의 커뮤니티에 가입해보세요
            <br />타 기수 수강생, 수료생들과 교류하고 다양한 정보를 얻을 수
            있습니다
          </p>
          <div className="d-flex gap-3 mt-3">
            <Button
              variant="dark"
              className="px-5 py-3"
              style={{
                backgroundColor: "#2D4053",
                color: "#FFFFFF",
                borderRadius: "6px",
              }}
            >
              가입하기
            </Button>
            <Button
              variant="outline-dark"
              className="px-5 py-3"
              style={{
                borderColor: "#2D4053",
                color: "#2D4053",
                borderRadius: "6px",
                backgroundColor: "#FBFBFD",
              }}
            >
              커뮤니티
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};
