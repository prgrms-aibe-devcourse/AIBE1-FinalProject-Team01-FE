import React from "react";
import chatDefaultImage from "../../assets/chat-default-image.png";

/**
 * @typedef {Object} DMMessageListProps
 * @property {Array} messages
 */

/**
 * DM 메시지 목록 컴포넌트
 * @param {DMMessageListProps} props
 */
export const DMMessageList = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="dm-no-messages">
        <div className="dm-no-messages-text">대화를 시작해보세요!</div>
      </div>
    );
  }

  return (
    <div className="dm-messages-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`dm-message ${
            message.isMe ? "dm-message-mine" : "dm-message-other"
          }`}
        >
          {!message.isMe && (
            <div className="dm-message-avatar">
              <img
                src={chatDefaultImage}
                alt={message.senderName}
                className="dm-message-avatar-img"
              />
            </div>
          )}
          <div className="dm-message-content">
            <div className="dm-message-bubble">{message.text}</div>
            <div className="dm-message-time">{message.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
