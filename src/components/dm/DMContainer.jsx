import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DMSidebar } from "./DMSidebar";
import { DMChatArea } from "./DMChatArea";
import { useAuth } from "../../context/AuthContext";
import { getDMRooms } from "../../services/dmApi";
import "../../styles/components/dm/dm.css";

/**
 * DM 메인 컨테이너 컴포넌트
 */
export const DMContainer = () => {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [dmRooms, setDmRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 현재 사용자 ID (AuthContext에서 실제 userId 우선 사용, 없으면 테스트용으로 1)
  const currentUserId = user?.id || 1;

  // DM 방 목록 불러오기 함수를 useCallback으로 메모이제이션
  const loadDMRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rooms = await getDMRooms();
      setDmRooms(rooms);
    } catch (error) {
      console.error("❌ DM 방 목록 로드 실패:", error);
      setError(error.message || "채팅방 목록을 불러오는데 실패했습니다.");
      setDmRooms([]); // 실패 시 빈 배열로 설정하여 무한 로딩 방지
    } finally {
      setLoading(false);
    }
  }, []);

  // DM 방 목록 불러오기 - 컴포넌트 마운트 시 한 번만
  useEffect(() => {
    loadDMRooms();
  }, [loadDMRooms]);

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleRoomCreated = () => {
    loadDMRooms();
  };

  // 에러 처리
  if (error) {
    return (
      <Container className="dm-main-container">
        <Row className="dm-content-row">
          <Col className="text-center py-5">
            <div className="alert alert-danger">
              <h5>오류가 발생했습니다</h5>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadDMRooms}>
                다시 시도
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="dm-main-container">
      <Row className="dm-content-row">
        <Col md={4} className="dm-sidebar-col">
          <DMSidebar
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            serverRooms={dmRooms}
            loading={loading}
            onRoomCreated={handleRoomCreated}
          />
        </Col>
        <Col md={8} className="dm-chat-col">
          <DMChatArea selectedChatId={selectedChatId} />
        </Col>
      </Row>
    </Container>
  );
};
