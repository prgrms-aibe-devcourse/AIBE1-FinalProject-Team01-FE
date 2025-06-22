import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, ChatDots, PersonCircle } from "react-bootstrap-icons";
import "../../styles/components/common/NavigationBar.css";

export const NavigationBar = ({ onlyLogo }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <Navbar
      expand="lg"
      className={`main-navbar${onlyLogo ? " login-navbar" : ""}`}
    >
      <Container className="container">
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", color: onlyLogo ? "#fff" : undefined }}
        >
          <span className="navbar-brand-text">Amateurs</span>
        </Navbar.Brand>

        {!onlyLogo && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-between"
            >
              <Nav className="mx-auto navbar-nav">
                <Nav.Link onClick={() => navigate("/community")}>
                  커뮤니티
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/hub")}>
                  프로젝트 허브
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/together")}>
                  함께해요
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/info")}>
                  정보게시판
                </Nav.Link>
              </Nav>

              {isLoggedIn ? (
                <div className="d-flex gap-3 align-items-center">
                  <Bell style={{ fontSize: "20px", cursor: "pointer" }} />
                  <ChatDots style={{ fontSize: "20px", cursor: "pointer" }} />
                  <PersonCircle
                    style={{ fontSize: "20px", cursor: "pointer" }}
                  />
                  <span
                    style={{ fontWeight: 500, marginLeft: 4, marginRight: 8 }}
                  >
                    {user?.name || "사용자"}
                  </span>
                  <Button
                    variant="outline-dark"
                    className="px-4"
                    onClick={logout}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="d-flex gap-3">
                  <Button
                    variant="dark"
                    className="px-5 py-3"
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </Button>
                  <Button
                    variant="outline-dark"
                    className="px-5 py-3"
                    onClick={() => navigate("/signup")}
                  >
                    회원가입
                  </Button>
                </div>
              )}
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};
