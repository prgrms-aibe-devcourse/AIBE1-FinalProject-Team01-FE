import React from "react";
import { Button } from "react-bootstrap";
import { Download, FileEarmark, Image } from "react-bootstrap-icons";
import chatDefaultImage from "../../assets/chat-default-image.png";
import { formatFileSize } from "../../services/fileUploadApi";

/**
 * @typedef {Object} DMMessageListProps
 * @property {Array} messages
 * @property {number} currentUserId
 */

/**
 * DM 메시지 목록 컴포넌트
 * @param {DMMessageListProps} props
 */
export const DMMessageList = ({ messages, currentUserId }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="dm-no-messages">
        <div className="dm-no-messages-text">대화를 시작해보세요!</div>
      </div>
    );
  }

  /**
   * 파일 다운로드 처리
   */
  const handleFileDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 메시지 콘텐츠 렌더링
   */
  const renderMessageContent = (message) => {
    switch (message.type) {
      case "IMAGE":
        return (
          <div className="dm-message-image">
            <img
              src={message.fileUrl}
              alt={message.fileName || "이미지"}
              className="dm-message-image-content"
              onClick={() => window.open(message.fileUrl, "_blank")}
              style={{ cursor: "pointer" }}
            />
            {message.fileName && (
              <div className="dm-message-image-name">{message.fileName}</div>
            )}
          </div>
        );

      case "FILE":
        return (
          <div className="dm-message-file">
            <div className="dm-message-file-info">
              <FileEarmark size={24} className="dm-message-file-icon" />
              <div className="dm-message-file-details">
                <div className="dm-message-file-name">
                  {message.fileName || "파일"}
                </div>
                {message.fileSize && (
                  <div className="dm-message-file-size">
                    {formatFileSize(message.fileSize)}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              className="dm-message-file-download"
              onClick={() =>
                handleFileDownload(message.fileUrl, message.fileName)
              }
            >
              <Download size={16} />
            </Button>
          </div>
        );

      default:
        return message.text;
    }
  };

  return (
    <div className="dm-messages-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`dm-message ${
            message.isMe ? "dm-message-mine" : "dm-message-other"
          } ${message.pending ? "dm-message-pending" : ""} ${
            message.error ? "dm-message-error" : ""
          }`}
        >
          {!message.isMe && (
            <div className="dm-message-avatar">
              <img
                src={message.senderProfileImage || chatDefaultImage}
                alt={message.senderNickname || "사용자"}
                className="dm-message-avatar-img"
              />
            </div>
          )}
          <div className="dm-message-content">
            <div
              className={`dm-message-bubble ${
                message.type === "IMAGE"
                  ? "dm-message-bubble-image"
                  : message.type === "FILE"
                  ? "dm-message-bubble-file"
                  : ""
              }`}
            >
              {renderMessageContent(message)}
            </div>
            <div className="dm-message-time">
              {message.timestamp}
              {message.pending && (
                <span style={{ marginLeft: "8px", color: "#6c757d" }}>
                  전송 중...
                </span>
              )}
              {message.error && (
                <span style={{ marginLeft: "8px", color: "#dc3545" }}>
                  전송 실패
                </span>
              )}
              {!message.isMe && message.senderNickname && (
                <span style={{ marginLeft: "8px", color: "#6c757d" }}>
                  {message.senderNickname}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
