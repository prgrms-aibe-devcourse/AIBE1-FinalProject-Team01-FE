import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  InputGroup,
  FormControl,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Send, Camera } from "react-bootstrap-icons";
import { useInput } from "../../hooks/useInput";
import { useWebSocket } from "../../hooks/useWebSocket";
import { DMMessageList } from "./DMMessageList";
import chatDefaultImage from "../../assets/chat-default-image.png";
import { useAuth } from "../../context/AuthContext";
import { getDMMessages } from "../../services/dmApi";

/**
 * @typedef {Object} DMChatAreaProps
 * @property {string|null} selectedChatId
 * @property {function} onMessageUpdate - 마지막 메시지 업데이트 콜백
 */

/**
 * DM 채팅 영역 컴포넌트
 * @param {DMChatAreaProps} props
 */
export const DMChatArea = ({ selectedChatId, onMessageUpdate }) => {
  const { user } = useAuth();
  const {
    value: messageText,
    onChange: onMessageChange,
    reset: resetMessage,
  } = useInput("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);

  const chatMessages = selectedChatId
    ? messages.filter((msg) => msg.chatId === selectedChatId)
    : [];

  // 현재 사용자 ID (AuthContext에서 가져오거나 기본값 사용)
  const currentUserId = user?.id || 1;

  // 방 입장 처리
  useEffect(() => {
    if (selectedChatId) {
      handleEnterRoom();
    } else {
      // 채팅방 선택 해제 시 상태 초기화
      setMessages([]);
      setChatPartner(null);
      setError(null);
    }
  }, [selectedChatId, currentUserId]);

  const handleEnterRoom = async () => {
    if (!selectedChatId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 메시지 목록 불러오기
      const messageResponse = await getDMMessages(
        selectedChatId,
        currentUserId,
        0,
        50,
        "ASC"
      );

      // 서버에서 받은 메시지를 클라이언트 형식으로 변환
      const formattedMessages = messageResponse.messages.map((msg, index) => ({
        id: `server-${msg.id || index}`,
        chatId: selectedChatId,
        senderId: msg.senderId,
        text: msg.content,
        timestamp: new Date(msg.sentAt).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: msg.senderId === currentUserId,
        senderNickname: msg.senderNickname,
      }));

      // 채팅 상대방 정보 설정 (첫 번째 메시지의 상대방 정보 활용)
      if (formattedMessages.length > 0) {
        const otherMessage = formattedMessages.find((msg) => !msg.isMe);
        if (otherMessage) {
          setChatPartner({
            id: otherMessage.senderId,
            nickname: otherMessage.senderNickname,
          });
        }
      }

      // 해당 채팅방의 메시지만 업데이트
      setMessages((prev) => [
        ...prev.filter((msg) => msg.chatId !== selectedChatId), // 다른 방 메시지는 유지
        ...formattedMessages, // 서버 메시지
      ]);

      setShouldScrollToBottom(true);
    } catch (error) {
      console.error(`❌ 채팅방 ${selectedChatId} 입장 실패:`, error);
      setError(error.message || "채팅방을 불러오는 중 오류가 발생했습니다.");
      // 서버 연결 실패 시 빈 메시지 목록
      setMessages((prev) =>
        prev.filter((msg) => msg.chatId !== selectedChatId)
      );
    } finally {
      setLoading(false);
    }
  };

  // 웹소켓 메시지 수신 처리 (useCallback으로 memoize)
  const handleMessageReceived = useCallback(
    (messageData) => {
      const newMessage = {
        id: messageData.id || `ws-${Date.now()}-${Math.random()}`, // 서버에서 제공하는 ID 사용
        chatId: messageData.roomId || selectedChatId, // 서버에서 제공하는 roomId 사용
        senderId: messageData.senderId,
        text: messageData.content,
        timestamp: messageData.sentAt
          ? new Date(messageData.sentAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
        isMe: messageData.senderId === currentUserId,
        senderNickname: messageData.senderNickname, // 서버 DTO의 senderNickname 필드
      };

      setMessages((prev) => [...prev, newMessage]);
      setShouldScrollToBottom(true);

      // 메시지 수신 시 채팅방 목록 업데이트 (다른 사용자의 메시지인 경우만)
      if (messageData.senderId !== currentUserId && onMessageUpdate) {
        const messageTime = messageData.sentAt
          ? new Date(messageData.sentAt)
          : new Date();
        onMessageUpdate(selectedChatId, messageData.content, messageTime);
      }
    },
    [selectedChatId, currentUserId, onMessageUpdate]
  ); // 필요한 dependencies만 포함

  // 웹소켓 훅 사용
  const {
    isConnected,
    connectionState,
    sendMessage: sendWebSocketMessage,
    connect,
    disconnect,
  } = useWebSocket(selectedChatId, handleMessageReceived, currentUserId);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom]);

  const scrollToBottom = () => {
    // 메시지 컨테이너를 직접 스크롤
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) return;

    const messageContent = messageText.trim();
    const timestamp = new Date();

    // 웹소켓이 연결되어 있으면 웹소켓으로 전송
    if (isConnected) {
      const success = sendWebSocketMessage(
        messageContent,
        user?.nickname || user?.name || "익명"
      );
      if (success) {
        // 메시지 전송 성공 시 채팅방 목록 업데이트
        if (onMessageUpdate) {
          onMessageUpdate(selectedChatId, messageContent, timestamp);
        }
        resetMessage();
      } else {
        console.error("❌ 웹소켓 메시지 전송 실패");
        // 전송 실패 시 로컬에라도 추가하여 사용자 피드백 제공
        const fallbackMessage = {
          id: `local-${Date.now()}-${Math.random()}`,
          chatId: selectedChatId,
          senderId: currentUserId,
          text: messageContent,
          timestamp: timestamp.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: true,
          error: true, // 에러 플래그 추가
        };
        setMessages((prev) => [...prev, fallbackMessage]);
        setShouldScrollToBottom(true);
        resetMessage();
      }
    } else {
      // 웹소켓이 연결되지 않은 경우 사용자에게 알림
      setError("채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChatId) {
    return (
      <div className="dm-welcome-area">
        <div className="dm-welcome-content">
          <div className="dm-welcome-header">
            <div className="dm-welcome-icon-container">
              <div className="dm-welcome-icon">📬</div>
              <div className="dm-welcome-icon-bg"></div>
            </div>
            <h2 className="dm-welcome-title">실시간 채팅을 시작해보세요</h2>
            <p className="dm-welcome-subtitle">
              아마추어스에서 동료들과 1:1 대화를 나누며
              <br />
              소중한 인연을 만들어가세요
            </p>
          </div>

          <div className="dm-welcome-features">
            <div className="dm-feature-card">
              <div className="dm-feature-icon">⚡</div>
              <h4>실시간 메시징</h4>
              <p>빠르고 안정적인 실시간 대화</p>
            </div>
            <div className="dm-feature-card">
              <div className="dm-feature-icon">🔧</div>
              <h4>기술 토론</h4>
              <p>최신 기술 트렌드에 대해 깊이 있는 대화</p>
            </div>
            <div className="dm-feature-card">
              <div className="dm-feature-icon">🌟</div>
              <h4>간편한 사용</h4>
              <p>직관적이고 사용하기 쉬운 인터페이스</p>
            </div>
          </div>

          <div className="dm-welcome-actions">
            <div className="dm-action-tip">
              <div className="dm-tip-icon">💡</div>
              <div className="dm-tip-content">
                <strong>시작하는 방법</strong>
                <p>
                  왼쪽에서 대화상대를 선택하거나 <strong>+</strong> 버튼으로 새
                  채팅을 시작하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dm-chat-area">
      <div className="dm-chat-header">
        <div className="dm-chat-user-info">
          <div className="dm-chat-avatar">
            <img
              src={chatPartner?.profileImage || chatDefaultImage}
              alt={chatPartner?.nickname || "채팅 상대"}
              className="dm-avatar-img"
            />
          </div>
          <div>
            <div className="dm-chat-user-name">
              {chatPartner?.nickname || "채팅 상대"}
            </div>
            <div className="dm-chat-user-status">
              {chatPartner?.devcourse || "생성형 AI 백엔드 1기"}
            </div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <Alert
          variant="danger"
          className="m-3"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" className="me-2" />
          채팅 기록을 불러오는 중...
        </div>
      )}

      <div className="dm-messages-container" ref={messagesContainerRef}>
        <DMMessageList messages={chatMessages} currentUserId={currentUserId} />
        <div ref={messagesEndRef} />
      </div>

      <div className="dm-input-container">
        <InputGroup className="dm-message-input-group">
          <FormControl
            as="textarea"
            rows="1"
            placeholder="메시지를 입력해보세요"
            value={messageText}
            onChange={onMessageChange}
            onKeyPress={handleKeyPress}
            className="dm-message-input"
            disabled={!isConnected}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected}
            className="dm-send-btn"
          >
            <Send size={16} />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};
