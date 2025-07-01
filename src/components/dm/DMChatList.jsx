import React from "react";
import { ListGroup } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import chatDefaultImage from "../../assets/chat-default-image.png";

/**
 * @typedef {Object} DMChatListProps
 * @property {Array} chats
 * @property {string|null} selectedChatId
 * @property {function} onChatSelect
 * @property {function} onDeleteChat
 */

/**
 * DM 채팅 목록 컴포넌트
 * @param {DMChatListProps} props
 */
export const DMChatList = ({
  chats,
  selectedChatId,
  onChatSelect,
  onDeleteChat,
}) => {
  if (!chats || chats.length === 0) {
    return (
      <div className="dm-empty-state">
        <div className="dm-empty-icon">💬</div>
        <div className="dm-empty-text">대화가 없습니다</div>
      </div>
    );
  }

  return (
    <ListGroup variant="flush" className="dm-chat-list">
      {chats.map((chat) => (
        <ListGroup.Item
          key={chat.id}
          className={`dm-chat-item ${
            selectedChatId === chat.id ? "active" : ""
          }`}
          onClick={() => onChatSelect(chat.id)}
        >
          <div className="dm-chat-item-content">
            <div className="dm-chat-avatar">
              <img
                src={chat.profileImage || chatDefaultImage}
                alt={chat.nickname}
                className="dm-avatar-img"
              />
            </div>
            <div className="dm-chat-info">
              <div className="dm-chat-header">
                <span className="dm-chat-nickname">{chat.nickname}</span>
              </div>
              <div className="dm-chat-preview">{chat.lastMessage}</div>
            </div>
            <div className="dm-chat-right">
              <span className="dm-chat-time">{chat.timestamp}</span>
              <button
                className="dm-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
