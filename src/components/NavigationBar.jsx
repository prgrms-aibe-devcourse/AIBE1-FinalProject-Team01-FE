import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

/**
 * @typedef {{}} NavigationBarProps
 */

/**
 * NavigationBar Component
 * @param {NavigationBarProps} props
 */
export const NavigationBar = () => {
  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#FFFFFF",
        height: "70px",
        borderBottom: "1px solid #E9ECF3",
      }}
    >
      <Container style={{ maxWidth: "1200px" }}>
        <Navbar.Brand href="#home" className="d-flex align-items-center gap-1">
          <span
            style={{
              color: "#2D4053",
              fontSize: "20px",
              fontWeight: "700",
              lineHeight: "1.4em",
            }}
          >
            Amateurs
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="mx-auto" style={{ gap: "20px" }}>
            <Nav.Link
              href="#community"
              style={{
                color: "#0C151C",
                fontSize: "20px",
                fontWeight: "600",
                lineHeight: "1.6em",
              }}
            >
              커뮤니티
            </Nav.Link>
            <Nav.Link
              href="#projecthub"
              style={{
                color: "#0C151C",
                fontSize: "20px",
                fontWeight: "600",
                lineHeight: "1.6em",
              }}
            >
              프로젝트 허브
            </Nav.Link>
            <Nav.Link
              href="#together"
              style={{
                color: "#0C151C",
                fontSize: "20px",
                fontWeight: "600",
                lineHeight: "1.6em",
              }}
            >
              함께해요
            </Nav.Link>
            <Nav.Link
              href="#information"
              style={{
                color: "#0C151C",
                fontSize: "20px",
                fontWeight: "600",
                lineHeight: "1.6em",
              }}
            >
              정보게시판
            </Nav.Link>
          </Nav>
          <div className="d-flex gap-3">
            <Button
              variant="dark"
              style={{
                backgroundColor: "#2D4053",
                color: "#FFFFFF",
                borderRadius: "6px",
                height: "38px",
                padding: "0 24px",
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "2em",
                letterSpacing: "-1%",
              }}
            >
              로그인
            </Button>
            <Button
              variant="outline-dark"
              style={{
                borderColor: "#2D4053",
                color: "#2D4053",
                borderRadius: "6px",
                height: "38px",
                padding: "0 24px",
                backgroundColor: "#E9ECF3",
                borderWidth: "1px",
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "2em",
                letterSpacing: "-1%",
              }}
            >
              회원가입
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
