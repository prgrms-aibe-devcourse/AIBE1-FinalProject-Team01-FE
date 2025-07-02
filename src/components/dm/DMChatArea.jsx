import React, { useState, useRef, useEffect } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
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
 */

/**
 * DM 채팅 영역 컴포넌트
 * @param {DMChatAreaProps} props
 */
export const DMChatArea = ({ selectedChatId }) => {
  const { user } = useAuth();
  const {
    value: messageText,
    onChange: onMessageChange,
    reset: resetMessage,
  } = useInput("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [roomData, setRoomData] = useState(null);
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
      setRoomData(null);
      setChatPartner(null);
    }
  }, [selectedChatId, currentUserId]);

  const handleEnterRoom = async () => {
    if (!selectedChatId) {
      return;
    }

    try {
      // 메시지 목록 불러오기 (새로운 API 스펙)
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
      // 서버 연결 실패 시 빈 메시지 목록
      setMessages((prev) =>
        prev.filter((msg) => msg.chatId !== selectedChatId)
      );
    }
  };

  // 웹소켓 메시지 수신 처리
  const handleMessageReceived = (messageData) => {
    console.log("📥 DMChatArea에서 받은 메시지:", messageData);

    const newMessage = {
      id: `ws-${Date.now()}-${Math.random()}`, // 웹소켓 메시지 구분을 위한 prefix
      chatId: selectedChatId,
      senderId: messageData.senderId,
      text: messageData.content,
      timestamp: messageData.timestamp
        ? new Date(messageData.timestamp).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      isMe: messageData.senderId === currentUserId,
    };

    setMessages((prev) => [...prev, newMessage]);
    setShouldScrollToBottom(true);
  };

  // 웹소켓 훅 사용
  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket(
    selectedChatId,
    handleMessageReceived,
    currentUserId
  );

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

    // 메시지 객체 생성
    const newMessage = {
      id: `local-${Date.now()}-${Math.random()}`, // 로컬 메시지 구분을 위한 prefix
      chatId: selectedChatId,
      senderId: currentUserId,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    // 웹소켓이 연결되어 있으면 웹소켓으로만 전송 (수신 시 UI 업데이트)
    if (isConnected) {
      const success = sendWebSocketMessage(messageText.trim());
      if (success) {
        resetMessage();
        // 웹소켓 전송 성공 시에는 로컬 메시지를 추가하지 않음 (서버에서 받은 메시지로 처리)
      } else {
        console.error("❌ 웹소켓 메시지 전송 실패");
        // 전송 실패 시 로컬에라도 추가
        setMessages((prev) => [...prev, newMessage]);
        setShouldScrollToBottom(true);
        resetMessage();
      }
    } else {
      // 웹소켓이 연결되지 않은 경우 로컬에만 추가 (더미 모드)
      setMessages((prev) => [...prev, newMessage]);
      setShouldScrollToBottom(true);
      resetMessage();
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
          <div className="dm-welcome-icon">📱</div>
          <h4 className="dm-welcome-title">DM</h4>
          <p className="dm-welcome-subtitle">
            아마추어스 DM을 통해 수강생들과 소통해보세요!
            <br />
            궁금한 것이나 알고 싶은 것이 있다면 언제든 메시지를 보내세요
          </p>
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
              {chatPartner?.nickname ||
                roomData?.participantName ||
                "채팅 상대"}
            </div>
            <div className="dm-chat-user-status">
              {chatPartner?.devcourse || "생성형 AI 백엔드 1기"}
              {isConnected && <span style={{ color: "green" }}> • 연결됨</span>}
              {!isConnected && (
                <span style={{ color: "orange" }}> • 연결 중...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dm-messages-container" ref={messagesContainerRef}>
        <DMMessageList messages={chatMessages} />
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
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="dm-send-btn"
          >
            <Send size={16} />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};
