import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DMSidebar } from "./DMSidebar";
import { DMChatArea } from "./DMChatArea";
import { useAuth } from "../../context/AuthContext";
import { getDMRooms } from "../../services/dmApi";
import "../../styles/components/dm/dm.css";

/**
 * DM 메인 컨테이너 컴포넌트
 * @param {Object} props
 * @param {string|null} [props.initialRoomId]
 * @param {string|null} [props.initialMessageId]
 */
export const DMContainer = ({
  initialRoomId = null,
  initialMessageId = null,
}) => {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(initialRoomId);
  const [targetMessageId, setTargetMessageId] = useState(initialMessageId);
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

  // location.state로부터 받은 roomId/messageId로 최초 진입 시 세팅
  useEffect(() => {
    if (initialRoomId) setSelectedChatId(initialRoomId);
    if (initialMessageId) setTargetMessageId(initialMessageId);
  }, [initialRoomId, initialMessageId]);

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    setTargetMessageId(null); // 채팅방 수동 선택 시 타겟 메시지 초기화
  };

  const handleRoomCreated = () => {
    loadDMRooms();
  };

  // 마지막 메시지 업데이트 함수
  const handleMessageUpdate = useCallback((roomId, lastMessage, timestamp) => {
    setDmRooms((prevRooms) =>
      prevRooms
        .map((room) =>
          room.id === roomId
            ? {
                ...room,
                lastMessage,
                lastMessageTime: timestamp,
                sentAt: timestamp, // 서버 형식과 일치하도록 sentAt도 업데이트
              }
            : room
        )
        .sort((a, b) => {
          // 최신 메시지가 있는 방을 위로 정렬
          const timeA =
            a.id === roomId
              ? new Date(timestamp)
              : new Date(a.lastMessageTime || a.sentAt || 0);
          const timeB =
            b.id === roomId
              ? new Date(timestamp)
              : new Date(b.lastMessageTime || b.sentAt || 0);
          return timeB - timeA;
        })
    );
  }, []);

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

  // 선택된 채팅방 정보 찾기
  const selectedRoom = dmRooms.find((room) => room.id === selectedChatId);

  return (
    <Container className="dm-main-container">
      <Row className="dm-content-row">
        <Col xs={4} sm={4} md={4} lg={4} xl={4} className="dm-sidebar-col">
          <DMSidebar
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            serverRooms={dmRooms}
            loading={loading}
            onRoomCreated={handleRoomCreated}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={8} className="dm-chat-col">
          <DMChatArea
            selectedChatId={selectedChatId}
            onMessageUpdate={handleMessageUpdate}
            chatPartnerInfo={
              selectedRoom && {
                nickname: selectedRoom.partnerNickname,
                profileImage: selectedRoom.partnerProfileImage,
                partnerId: selectedRoom.partnerId,
                devcourseName: selectedRoom.devcourseName,
                devcourseBatch: selectedRoom.devcourseBatch,
              }
            }
            // targetMessageId={targetMessageId} // 추후 메시지 위치 이동 구현 시 사용
          />
        </Col>
      </Row>
    </Container>
  );
};
