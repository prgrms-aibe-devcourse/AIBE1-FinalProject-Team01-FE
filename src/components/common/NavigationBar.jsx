import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/components/common/NavigationBar.css";

export const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="main-navbar">
      <Container className="container">
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="navbar-brand-text">Amateurs</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="mx-auto navbar-nav">
            <Nav.Link href="#community">커뮤니티</Nav.Link>
            <Nav.Link href="#projecthub">프로젝트 허브</Nav.Link>
            <Nav.Link href="#together">함께해요</Nav.Link>
            <Nav.Link href="#information">정보게시판</Nav.Link>
          </Nav>
          <div className="d-flex gap-3">
            <Button
              variant="dark"
              className="px-5 py-3"
              onClick={() => navigate("/login")}
            >
              로그인
            </Button>
            <Button variant="outline-dark" className="px-5 py-3">
              회원가입
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
