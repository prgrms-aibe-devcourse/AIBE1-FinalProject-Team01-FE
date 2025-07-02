import React, { useState, useEffect, useRef } from "react";
import { InputGroup, FormControl, Button, Modal, Form } from "react-bootstrap";
import { Search, Trash, Plus } from "react-bootstrap-icons";
import { useInput } from "../../hooks/useInput";
import { DMChatList } from "./DMChatList";
import { createDMRoom, leaveDMRoom } from "../../services/dmApi";
import { useAuth } from "../../context/AuthContext";

/**
 * @typedef {Object} DMSidebarProps
 * @property {string|null} selectedChatId
 * @property {function} onChatSelect
 * @property {Array} serverRooms - 서버에서 받은 DM 방 목록
 * @property {boolean} loading - 로딩 상태
 * @property {function} onRoomCreated - 방 생성 후 호출될 콜백
 */

/**
 * DM 사이드바 컴포넌트
 * @param {DMSidebarProps} props
 */
export const DMSidebar = ({
  selectedChatId,
  onChatSelect,
  serverRooms = [],
  loading = false,
  onRoomCreated,
}) => {
  const { user } = useAuth();
  const {
    value: searchKeyword,
    onChange: onSearchChange,
    reset: resetSearch,
  } = useInput("");
  const [chatList, setChatList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChatUserId, setNewChatUserId] = useState("");
  const [newChatUserNickname, setNewChatUserNickname] = useState("");
  const [creating, setCreating] = useState(false);
  const [hasProcessedRooms, setHasProcessedRooms] = useState(false);

  const currentUserId = user?.id || 1;

  // 서버 데이터가 로드되면 처리 (한 번만)
  useEffect(() => {
    if (!loading && !hasProcessedRooms) {
      if (serverRooms && serverRooms.length > 0) {
        // 서버 데이터를 클라이언트 형식으로 변환 (새로운 API 스펙)
        const formattedServerRooms = serverRooms.map((room, index) => ({
          id: room.roomId || `server-${index}`,
          nickname: `사용자 ${room.otherUserId}`, // 상대방 사용자 ID 기반 닉네임
          lastMessage: room.lastMessage || "새로운 대화를 시작해보세요",
          time: "00:00", // API에서 시간 정보가 없으므로 기본값
          profileImage: null, // API에서 프로필 이미지 정보가 없음
          unreadCount: 0, // API에서 읽지 않은 메시지 수 정보가 없음
          otherUserId: room.otherUserId, // 상대방 사용자 ID 저장
        }));

        setChatList(formattedServerRooms);
      } else {
        setChatList([]);
      }
      setHasProcessedRooms(true);
    }
  }, [serverRooms, loading, hasProcessedRooms]);

  // 방 생성 시 플래그 리셋
  useEffect(() => {
    if (serverRooms.length === 0) {
      setHasProcessedRooms(false);
    }
  }, [serverRooms.length]);

  const handleDeleteChat = async (chatId) => {
    try {
      await leaveDMRoom(chatId, currentUserId);

      // 로컬 목록에서 제거
      setChatList((prev) => prev.filter((chat) => chat.id !== chatId));
      if (selectedChatId === chatId) {
        onChatSelect(null);
      }
    } catch (error) {
      console.error(`❌ 채팅방 나가기 실패:`, error);
      // 실패해도 로컬에서는 제거 (UI 일관성)
      setChatList((prev) => prev.filter((chat) => chat.id !== chatId));
      if (selectedChatId === chatId) {
        onChatSelect(null);
      }
    }
  };

  const handleCreateRoom = async () => {
    if (!newChatUserId.trim() || !newChatUserNickname.trim()) {
      alert("사용자 ID와 닉네임을 모두 입력해주세요.");
      return;
    }

    try {
      setCreating(true);

      const participantMap = {
        [currentUserId]: user?.nickname || `사용자${currentUserId}`,
        [newChatUserId]: newChatUserNickname,
      };

      const newRoom = await createDMRoom(participantMap);

      // 모달 닫기 및 입력값 초기화
      setShowCreateModal(false);
      setNewChatUserId("");
      setNewChatUserNickname("");

      // 부모 컴포넌트에 방 생성 완료 알림 (방 목록 새로고침 위해)
      if (onRoomCreated) {
        onRoomCreated();
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setCreating(false);
    }
  };

  const filteredChats = chatList.filter(
    (chat) =>
      chat.nickname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <>
      <div className="dm-sidebar">
        <div className="dm-sidebar-header">
          <h5 className="dm-sidebar-title">DM</h5>
          <button
            className="dm-edit-btn"
            onClick={() => setShowCreateModal(true)}
            title="새 채팅방 만들기"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="dm-search-section">
          <InputGroup className="dm-search-input-group">
            <InputGroup.Text className="dm-search-icon">
              <Search size={16} />
            </InputGroup.Text>
            <FormControl
              placeholder="메시지를 검색해보세요"
              value={searchKeyword}
              onChange={onSearchChange}
              className="dm-search-input"
            />
          </InputGroup>
        </div>

        <div className="dm-chat-list-container">
          {loading ? (
            <div className="dm-loading">
              <div className="text-center p-3">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">DM 목록 불러오는 중...</div>
              </div>
            </div>
          ) : chatList.length === 0 ? (
            <div className="dm-empty">
              <div className="text-center p-4">
                <div className="mb-2">💬</div>
                <div className="text-muted">아직 대화가 없습니다</div>
                <div className="text-muted small">
                  새로운 대화를 시작해보세요!
                </div>
              </div>
            </div>
          ) : (
            <DMChatList
              chats={filteredChats}
              selectedChatId={selectedChatId}
              onChatSelect={onChatSelect}
              onDeleteChat={handleDeleteChat}
            />
          )}
        </div>
      </div>

      {/* 채팅방 생성 모달 */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>새 채팅방 만들기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>상대방 사용자 ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="채팅할 상대방의 사용자 ID를 입력하세요"
                value={newChatUserId}
                onChange={(e) => setNewChatUserId(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>상대방 닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="상대방의 닉네임을 입력하세요"
                value={newChatUserNickname}
                onChange={(e) => setNewChatUserNickname(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateRoom}
            disabled={
              creating || !newChatUserId.trim() || !newChatUserNickname.trim()
            }
          >
            {creating ? "생성 중..." : "채팅방 생성"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
