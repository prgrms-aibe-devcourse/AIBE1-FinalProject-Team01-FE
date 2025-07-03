import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, ChatDots, PersonCircle } from "react-bootstrap-icons";
import "../../styles/components/common/NavigationBar.css";

// 알람 드롭다운 컴포넌트
const NotificationDropdown = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h6>알림</h6>
        <button className="mark-all-read">모두 읽음</button>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">새로운 알림이 없습니다</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                !notification.read ? "unread" : ""
              }`}
            >
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">{notification.time}</div>
              </div>
              {!notification.read && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 개발자용 임시 로그인 버튼들
const DevLoginButtons = () => {
  const { login, isLoggedIn } = useAuth();
  if (isLoggedIn) return null;
  return (
    <div className="d-flex gap-2">
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() =>
          login({
            id: 1, // userId 1
            name: "홍길동",
            email: "test@example.com",
            nickname: "amateur01",
            topics: ["Frontend", "AI/CC"],
          })
        }
      >
        Dev Login1
      </Button>
      <Button
        variant="outline-info"
        size="sm"
        onClick={() =>
          login({
            id: 2, // userId 2
            name: "김철수",
            email: "test2@example.com",
            nickname: "amateur02",
            topics: ["Backend", "DevOps"],
          })
        }
      >
        Dev Login2
      </Button>
    </div>
  );
};

export const NavigationBar = ({ onlyLogo }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // 더미 알림 데이터
  const [notifications] = useState([
    {
      id: 1,
      title: "새로운 댓글",
      message: "김개발님이 당신의 게시글에 댓글을 남겼습니다.",
      time: "5분 전",
      read: false,
    },
    {
      id: 2,
      title: "프로젝트 초대",
      message: "React 스터디 그룹에 초대되었습니다.",
      time: "1시간 전",
      read: false,
    },
    {
      id: 3,
      title: "좋아요 알림",
      message: "박코딩님이 당신의 게시글을 좋아합니다.",
      time: "3시간 전",
      read: true,
    },
  ]);

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

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
                <Nav.Link onClick={() => navigate("/HUB")}>
                  프로젝트 허브
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/together")}>
                  함께해요
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/info/REVIEW")}>
                  정보게시판
                </Nav.Link>
              </Nav>

              {isLoggedIn ? (
                <div className="d-flex gap-3 align-items-center">
                  <div className="notification-container" ref={notificationRef}>
                    <div
                      className="notification-bell"
                      onClick={toggleNotifications}
                    >
                      <Bell style={{ fontSize: "20px", cursor: "pointer" }} />
                      {unreadCount > 0 && (
                        <span className="notification-badge">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <NotificationDropdown
                      isOpen={showNotifications}
                      onClose={() => setShowNotifications(false)}
                      notifications={notifications}
                    />
                  </div>
                  <ChatDots
                    style={{ fontSize: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/dm")}
                  />
                  <PersonCircle
                    style={{ fontSize: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/mypage")}
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
                  <DevLoginButtons />
                </div>
              )}
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};
