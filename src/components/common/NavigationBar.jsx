import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, ChatDots, PersonCircle } from "react-bootstrap-icons";
import AlarmDropdown from "./AlarmDropdown";
import { useAlarms } from "../../hooks/useAlarms";
import "../../styles/components/common/NavigationBar.css";

export const NavigationBar = ({ onlyLogo }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const [showAlarms, setShowAlarms] = useState(false);
  const alarmRef = useRef(null);

  // 알림 훅 사용
  const {
    alarms,
    unreadCount,
    fetchAlarms,
    handleMarkAllRead,
    handleMarkAsRead,
  } = useAlarms();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alarmRef.current && !alarmRef.current.contains(event.target)) {
        setShowAlarms(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAlarms = () => {
    setShowAlarms(!showAlarms);
    if (!showAlarms) {
      fetchAlarms(); // 열 때마다 새로고침
    }
  };

  const BOARD_TYPE_MAP = {
    // 예시: 실제 서비스에서는 postId로 boardType을 조회해야 함
    // 1: 'free',
    // 2: 'qna',
    // 3: 'retrospect',
  };

  const handleAlarmClick = (alarm) => {
    if (alarm.type === "DIRECT_MESSAGE" && alarm.metaData) {
      // DM 채팅방으로 이동 (roomId, messageId)
      navigate("/dm", {
        state: {
          roomId: alarm.metaData.roomId,
          messageId: alarm.metaData.messageId,
        },
      });
    } else if (
      (alarm.type === "COMMENT" || alarm.type === "REPLY") &&
      alarm.metaData
    ) {
      // 게시글/댓글로 이동
      // postId만 있을 때 boardType을 알 수 없으므로, 임시로 FREE가 아닌 boardType 매핑 시도
      const postId = alarm.metaData.postId;
      let boardType = BOARD_TYPE_MAP[postId] || "free"; // 실제로는 API로 조회 필요
      navigate(`/community/${boardType}/${postId}`, {
        state: { commentId: alarm.metaData.commentId },
      });
    }
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
                  <div className="alarm-container" ref={alarmRef}>
                    <div className="alarm-bell" onClick={toggleAlarms}>
                      <Bell style={{ fontSize: "20px", cursor: "pointer" }} />
                      {unreadCount > 0 && (
                        <span className="alarm-badge">{unreadCount}</span>
                      )}
                    </div>
                    <AlarmDropdown
                      isOpen={showAlarms}
                      onClose={() => setShowAlarms(false)}
                      alarms={alarms}
                      onMarkAllRead={handleMarkAllRead}
                      onMarkAsRead={handleMarkAsRead}
                      onAlarmClick={handleAlarmClick}
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
                    {user?.nickname || "사용자"}
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
