import React, { useState, useEffect, useRef } from "react";
import {
  InputGroup,
  FormControl,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
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
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const currentUserId = user?.id || 1;

  // 서버 데이터 처리
  useEffect(() => {
    if (!loading && serverRooms) {
      if (serverRooms.length === 0) {
        setChatList([]);
        return;
      }

      // 서버 데이터를 클라이언트 형식으로 변환
      const formattedServerRooms = serverRooms.map((room) => {
        // lastMessage 처리
        let displayLastMessage = "새로운 대화를 시작해보세요";
        if (room.lastMessage && room.lastMessage.trim() !== "") {
          // JSON 형태의 파일 메시지인지 확인
          try {
            const parsedContent = JSON.parse(room.lastMessage);
            if (parsedContent.fileUrl && parsedContent.fileName) {
              // 파일 메시지인 경우 파일명과 이모지 표시
              const fileExtension = parsedContent.fileName
                .split(".")
                .pop()
                ?.toLowerCase();
              const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
                fileExtension
              );
              const fileEmoji = isImage ? "📷" : "📁";
              displayLastMessage = `${fileEmoji} ${parsedContent.fileName}`;
            } else {
              displayLastMessage = room.lastMessage;
            }
          } catch (e) {
            // JSON이 아닌 경우 일반 텍스트 메시지
            displayLastMessage = room.lastMessage;
          }
        }

        return {
          id: room.id,
          nickname: room.partnerNickname || `사용자 ${room.partnerId}`,
          lastMessage: displayLastMessage,
          lastMessageTime: room.sentAt || room.lastMessageTime || new Date(), // 최신 메시지 시간
          profileImage: room.partnerProfileImage || null,
          unreadCount: 0,
          otherUserId: room.partnerId,
        };
      });

      setChatList(formattedServerRooms);
    }
  }, [serverRooms, loading]);

  const handleDeleteChat = async (chatId) => {
    try {
      await leaveDMRoom(chatId);

      // 로컬 목록에서 제거
      setChatList((prev) => prev.filter((chat) => chat.id !== chatId));
      if (selectedChatId === chatId) {
        onChatSelect(null);
      }
    } catch (error) {
      console.error(`❌ 채팅방 나가기 실패:`, error);
      setError(error.message || "채팅방 나가기에 실패했습니다.");
    }
  };

  const handleCreateRoom = async () => {
    if (!newChatUserId.trim()) {
      setError("상대방 사용자 ID를 입력해주세요.");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const newRoom = await createDMRoom(parseInt(newChatUserId));

      // 모달 닫기 및 입력값 초기화
      setShowCreateModal(false);
      setNewChatUserId("");

      // 부모 컴포넌트에 방 생성 완료 알림 (방 목록 새로고침 위해)
      if (onRoomCreated) {
        onRoomCreated();
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 실패:", error);
      setError(error.message || "채팅방 생성에 실패했습니다.");
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
        <div className="dm-search-section">
          <div className="dm-search-container">
            <div className="dm-search-wrapper">
              <Search className="dm-search-icon" size={18} />
              <input
                type="text"
                className="dm-search-input"
                placeholder="메시지를 검색해보세요"
                value={searchKeyword}
                onChange={onSearchChange}
              />
              <button
                className="dm-create-btn"
                onClick={() => setShowCreateModal(true)}
                title="새 채팅방 만들기"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert
            variant="danger"
            className="m-2"
            dismissible
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

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
        onHide={() => {
          setShowCreateModal(false);
          setError(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>새 채팅방 만들기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>상대방 사용자 ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="채팅할 상대방의 사용자 ID를 입력하세요"
                value={newChatUserId}
                onChange={(e) => setNewChatUserId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateRoom();
                  }
                }}
              />
              <Form.Text className="text-muted">
                상대방의 사용자 ID를 입력하면 자동으로 채팅방이 생성됩니다.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateModal(false);
              setError(null);
            }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateRoom}
            disabled={creating || !newChatUserId.trim()}
          >
            {creating ? "생성 중..." : "채팅방 생성"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
