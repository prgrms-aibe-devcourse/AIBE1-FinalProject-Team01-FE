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
      // 더미 데이터 사용 (API 연결 준비는 완료)
      const dummyRooms = [
        {
          roomId: "room-1",
          otherUserId: 2,
          otherUserNickname: "김개발",
          otherUserProfileImage: null,
          lastMessage: "안녕하세요! 도움이 필요해서 연락드렸어요",
          sentAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5분 전
        },
        {
          roomId: "room-2",
          otherUserId: 3,
          otherUserNickname: "박코딩",
          otherUserProfileImage: null,
          lastMessage: "프로젝트 관련해서 궁금한 게 있는데요",
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        },
        {
          roomId: "room-3",
          otherUserId: 4,
          otherUserNickname: "이백엔드",
          otherUserProfileImage: null,
          lastMessage: "네, 좋은 아이디어인 것 같아요!",
          sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        },
        {
          roomId: "room-4",
          otherUserId: 5,
          otherUserNickname: "최프론트",
          otherUserProfileImage: null,
          lastMessage: "감사합니다! 덕분에 해결되었어요 😊",
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
        },
        {
          roomId: "room-5",
          otherUserId: 6,
          otherUserNickname: "정데이터",
          otherUserProfileImage: null,
          lastMessage: "내일 스터디 몇 시에 할까요?",
          sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
        },
      ];

      // 실제 API 호출은 주석 처리 (연결 준비는 완료)
      // if (serverRooms && serverRooms.length > 0) {
      //   console.log("🔍 DMSidebar에서 받은 서버 데이터:", serverRooms);
      //   const formattedServerRooms = serverRooms.map((room, index) => { ... });
      //   setChatList(formattedServerRooms);
      // }

      console.log("🔍 더미 데이터 사용 중");

      // 더미 데이터를 클라이언트 형식으로 변환
      const formattedDummyRooms = dummyRooms.map((room, index) => {
        // lastMessage 처리
        let displayLastMessage = "새로운 대화를 시작해보세요";
        if (room.lastMessage && room.lastMessage.trim() !== "") {
          displayLastMessage = room.lastMessage;
        }

        // timestamp 처리
        let displayTimestamp = "방금";
        if (room.sentAt) {
          try {
            displayTimestamp = new Date(room.sentAt).toLocaleTimeString(
              "ko-KR",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );
          } catch (error) {
            console.error("시간 변환 오류:", error);
            displayTimestamp = "방금";
          }
        }

        const formatted = {
          id: room.roomId,
          nickname: room.otherUserNickname || `사용자 ${room.otherUserId}`,
          lastMessage: displayLastMessage,
          timestamp: displayTimestamp,
          profileImage: room.otherUserProfileImage || null,
          unreadCount: 0,
          otherUserId: room.otherUserId,
        };

        return formatted;
      });

      setChatList(formattedDummyRooms);
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
    if (!newChatUserId.trim()) {
      alert("상대방 사용자 ID를 입력해주세요.");
      return;
    }

    try {
      setCreating(true);

      // 새로운 API 스펙: partnerId만 전달
      const newRoom = await createDMRoom(parseInt(newChatUserId));

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
            <button
              className="dm-create-btn"
              onClick={() => setShowCreateModal(true)}
              title="새 채팅방 만들기"
            >
              <Plus size={16} />
            </button>
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
              <Form.Text className="text-muted">
                상대방의 사용자 ID를 입력하면 자동으로 채팅방이 생성됩니다.
              </Form.Text>
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
            disabled={creating || !newChatUserId.trim()}
          >
            {creating ? "생성 중..." : "채팅방 생성"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
