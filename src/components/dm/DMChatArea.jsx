import React, { useState, useRef, useEffect } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Send, Camera } from "react-bootstrap-icons";
import { useInput } from "../../hooks/useInput";
import { DMMessageList } from "./DMMessageList";
import { dummyChatData, dummyMessages } from "./dmData";
import chatDefaultImage from "../../assets/chat-default-image.png";

/**
 * @typedef {Object} DMChatAreaProps
 * @property {string|null} selectedChatId
 */

/**
 * DM 채팅 영역 컴포넌트
 * @param {DMChatAreaProps} props
 */
export const DMChatArea = ({ selectedChatId }) => {
  const {
    value: messageText,
    onChange: onMessageChange,
    reset: resetMessage,
  } = useInput("");
  const [messages, setMessages] = useState(dummyMessages);
  const messagesEndRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const selectedChat = selectedChatId
    ? dummyChatData.find((chat) => chat.id === selectedChatId)
    : null;

  const chatMessages = selectedChatId
    ? messages.filter((msg) => msg.chatId === selectedChatId)
    : [];

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) return;

    const newMessage = {
      id: Date.now().toString(),
      chatId: selectedChatId,
      senderId: "current-user",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setShouldScrollToBottom(true);
    resetMessage();
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
              src={selectedChat?.profileImage || chatDefaultImage}
              alt={selectedChat?.nickname}
              className="dm-avatar-img"
            />
          </div>
          <div>
            <div className="dm-chat-user-name">{selectedChat?.nickname}</div>
            <div className="dm-chat-user-status">생성형 AI 백엔드 1기</div>
          </div>
        </div>
      </div>

      <div className="dm-messages-container">
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

        <div className="dm-suggested-messages">
          <button className="dm-suggestion-btn">
            안녕하세요 DM창을 이용해 어려지니까? 지금 모르고 있는 것 같아서
          </button>
          <button className="dm-suggestion-btn">
            내일이 감자어쳐 어려지니까?
          </button>
        </div>
      </div>
    </div>
  );
};
