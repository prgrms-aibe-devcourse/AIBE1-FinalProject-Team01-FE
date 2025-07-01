import React, { useState } from "react";
import { InputGroup, FormControl, ListGroup } from "react-bootstrap";
import { Search, Trash } from "react-bootstrap-icons";
import { useInput } from "../../hooks/useInput";
import { DMChatList } from "./DMChatList";
import { dummyChatData } from "./dmData";

/**
 * @typedef {Object} DMSidebarProps
 * @property {string|null} selectedChatId
 * @property {function} onChatSelect
 */

/**
 * DM 사이드바 컴포넌트
 * @param {DMSidebarProps} props
 */
export const DMSidebar = ({ selectedChatId, onChatSelect }) => {
  const {
    value: searchKeyword,
    onChange: onSearchChange,
    reset: resetSearch,
  } = useInput("");
  const [chatList, setChatList] = useState(dummyChatData);

  const handleDeleteChat = (chatId) => {
    setChatList((prev) => prev.filter((chat) => chat.id !== chatId));
    if (selectedChatId === chatId) {
      onChatSelect(null);
    }
  };

  const filteredChats = chatList.filter(
    (chat) =>
      chat.nickname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="dm-sidebar">
      <div className="dm-sidebar-header">
        <h5 className="dm-sidebar-title">김무이지</h5>
        <button className="dm-edit-btn">
          <i className="bi bi-pencil-square" />
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
        <DMChatList
          chats={filteredChats}
          selectedChatId={selectedChatId}
          onChatSelect={onChatSelect}
          onDeleteChat={handleDeleteChat}
        />
      </div>
    </div>
  );
};
