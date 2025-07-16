import React, { useState, useEffect, useRef } from "react";
import {
  InputGroup,
  FormControl,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Search, Trash, Plus } from "react-bootstrap-icons";
import { useInput } from "../../hooks/useInput";
import { DMChatList } from "./DMChatList";
import {
  createDMRoom,
  leaveDMRoom,
  getDMMessageSearch,
} from "../../services/dmApi";
import { useAuth } from "../../context/AuthContext";
import chatDefaultImage from "../../assets/chat-default-image.png";
import { getFollowingList } from "../../services/followApi";

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [creatingChatUserId, setCreatingChatUserId] = useState(null);

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
              // 파일 메시지인 경우 파일명과 텍스트 표시 (이모지 제거)
              const fileExtension = parsedContent.fileName
                .split(".")
                .pop()
                ?.toLowerCase();
              const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
                fileExtension
              );
              const filePrefix = isImage ? "이미지" : "파일";
              displayLastMessage = `${filePrefix}: ${parsedContent.fileName}`;
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

  // 메시지 내용 검색 핸들러
  const handleMessageSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      setSearchError(null);
      setIsSearchMode(false);
      setChatList(
        serverRooms.map((room) => ({
          id: room.id,
          nickname: room.partnerNickname || `사용자 ${room.partnerId}`,
          lastMessage: room.lastMessage,
          lastMessageTime: room.sentAt || room.lastMessageTime || new Date(),
          profileImage: room.partnerProfileImage || null,
          unreadCount: 0,
          otherUserId: room.partnerId,
        }))
      );
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await getDMMessageSearch({
        keyword: searchKeyword,
        size: 50,
        sortDirection: "DESC",
      });
      const messages = res.content || [];
      setIsSearchMode(true);
      setChatList(
        messages.map((msg) => ({
          id: msg.id, // 메시지 id
          roomId: msg.roomId,
          nickname: msg.senderNickname,
          lastMessage: msg.content,
          lastMessageTime: msg.sentAt,
          profileImage: msg.senderProfileImage || null,
          unreadCount: 0,
          otherUserId: msg.senderId,
        }))
      );
    } catch (err) {
      setSearchError(err.message || "메시지 검색 중 오류가 발생했습니다.");
      setChatList([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (searchKeyword === "") {
      setIsSearchMode(false);
      setSearchError(null);
      setChatList(
        serverRooms.map((room) => ({
          id: room.id,
          nickname: room.partnerNickname || `사용자 ${room.partnerId}`,
          lastMessage: room.lastMessage,
          lastMessageTime: room.sentAt || room.lastMessageTime || new Date(),
          profileImage: room.partnerProfileImage || null,
          unreadCount: 0,
          otherUserId: room.partnerId,
        }))
      );
    }
  }, [searchKeyword, serverRooms]);

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

  // 팔로잉 목록 모달 열기
  const handleOpenFollowingModal = async () => {
    setShowFollowingModal(true);
    setFollowingLoading(true);
    try {
      const list = await getFollowingList({ page: 0, size: 100 });
      setFollowingList(Array.isArray(list) ? list : list.content || []);
    } catch (e) {
      setFollowingList([]);
    } finally {
      setFollowingLoading(false);
    }
  };

  // 팔로잉 유저 클릭 시 채팅방 생성
  const handleStartChatWithUser = async (userId) => {
    setCreatingChatUserId(userId);
    try {
      const room = await createDMRoom(userId);
      setShowFollowingModal(false);
      if (onChatSelect) onChatSelect(room.id);
    } catch (e) {
      alert("채팅방 생성 실패");
    } finally {
      setCreatingChatUserId(null);
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
              <form
                onSubmit={handleMessageSearch}
                style={{ flex: 1, display: "flex", gap: 4 }}
              >
                <input
                  type="text"
                  className="dm-search-input"
                  placeholder="메시지를 검색해보세요"
                  value={searchKeyword}
                  onChange={onSearchChange}
                  disabled={searchLoading}
                  style={{ flex: 1 }}
                />
              </form>
              <button
                className="dm-create-btn"
                onClick={handleOpenFollowingModal}
                title="새 채팅방 만들기"
              >
                <Plus size={18} />
              </button>
            </div>
            {searchError && (
              <div style={{ color: "#dc3545", marginTop: 4 }}>
                {searchError}
              </div>
            )}
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
          ) : isSearchMode ? (
            <ul
              className="dm-search-message-list"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              {chatList.map((msg) => (
                <li
                  key={msg.id}
                  className="dm-search-message-item"
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                  onClick={() => onChatSelect && onChatSelect(msg.roomId)}
                >
                  <img
                    src={msg.profileImage || chatDefaultImage}
                    alt={msg.nickname}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {msg.nickname}
                    </div>
                    <div style={{ color: "#555", fontSize: 14, marginTop: 2 }}>
                      {msg.lastMessage}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#888",
                      minWidth: 70,
                      textAlign: "right",
                    }}
                  >
                    {msg.lastMessageTime
                      ? new Date(msg.lastMessageTime).toLocaleString("ko-KR", {
                          hour12: false,
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </li>
              ))}
            </ul>
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

      {/* 팔로잉 목록 모달 */}
      <Modal
        show={showFollowingModal}
        onHide={() => setShowFollowingModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>팔로잉 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dm-chat-list-container" style={{ padding: 0 }}>
          {followingLoading ? (
            <div className="dm-loading">
              <div className="text-center p-3">
                <Spinner animation="border" />
              </div>
            </div>
          ) : followingList.length === 0 ? (
            <div className="dm-empty">
              <div className="text-center p-4">
                <div className="mb-2">💬</div>
                <div className="text-muted">팔로잉한 사용자가 없습니다.</div>
              </div>
            </div>
          ) : (
            <ul className="dm-chat-list" style={{ margin: 0, padding: 0 }}>
              {followingList.map((user) => (
                <li
                  key={user.userId}
                  className="dm-chat-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    gap: 12,
                  }}
                  onClick={() => handleStartChatWithUser(user.userId)}
                >
                  <img
                    src={user.profileImg || chatDefaultImage}
                    alt={user.nickname}
                    className="dm-avatar-img"
                    style={{ width: 36, height: 36, borderRadius: "50%" }}
                  />
                  <div className="dm-chat-info" style={{ flex: 1 }}>
                    <span className="dm-chat-nickname">{user.nickname}</span>
                  </div>
                  <Button
                    size="sm"
                    style={{
                      background: "#2d4053",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      minWidth: 80,
                      fontWeight: 500,
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#1a252f")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#2d4053")
                    }
                    disabled={creatingChatUserId === user.userId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartChatWithUser(user.userId);
                    }}
                  >
                    {creatingChatUserId === user.userId ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      "채팅 시작"
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
