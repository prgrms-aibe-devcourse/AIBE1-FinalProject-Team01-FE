import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  InputGroup,
  FormControl,
  Button,
  Alert,
  Spinner,
  Dropdown,
} from "react-bootstrap";
import {
  Send,
  Camera,
  Paperclip,
  FileEarmark,
  Image,
} from "react-bootstrap-icons";
import { useInput } from "../../hooks/useInput";
import { useWebSocket } from "../../hooks/useWebSocket";
import { DMMessageList } from "./DMMessageList";
import chatDefaultImage from "../../assets/chat-default-image.png";
import { useAuth } from "../../context/AuthContext";
import { getDMMessages } from "../../services/dmApi";
import {
  uploadImages,
  uploadFiles,
  isImageFile,
} from "../../services/fileUploadApi";

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
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

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
      const formattedMessages = messageResponse.messages.map((msg, index) => {
        let messageContent = msg.content;
        let messageType = "TEXT";
        let fileInfo = {};

        // 메시지 내용이 JSON인지 확인 (파일 메시지)
        try {
          const parsedContent = JSON.parse(msg.content);
          if (
            parsedContent.type &&
            (parsedContent.type === "IMAGE" || parsedContent.type === "FILE")
          ) {
            messageType = parsedContent.type;
            fileInfo = {
              fileUrl: parsedContent.fileUrl,
              fileName: parsedContent.fileName,
              fileSize: parsedContent.fileSize,
            };
            messageContent = messageType === "IMAGE" ? "📷 이미지" : "📁 파일";
          }
        } catch (e) {
          // JSON이 아닌 경우 일반 텍스트 메시지
        }

        return {
          id: `server-${msg.id || index}`,
          chatId: selectedChatId,
          senderId: msg.senderId,
          text: messageContent,
          type: messageType,
          ...fileInfo,
          timestamp: new Date(msg.sentAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: msg.senderId === currentUserId,
          senderNickname: msg.senderNickname,
        };
      });

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

      // 메시지 로드 후 즉시 스크롤
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error(`❌ 채팅방 ${selectedChatId} 입장 실패:`, error);
      setError(error.message || "채팅방을 불러오는 중 오류가 발생했습니다.");
      // 서버 연결 실패 시 빈 메시지 목록
      setMessages((prev) =>
        prev.filter((msg) => msg.chatId !== selectedChatId)
      );
    } finally {
      setLoading(false);
      // 새 채팅방 입장 시 하단으로 스크롤
      setIsUserScrolledUp(false);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    }
  };

  // 웹소켓 메시지 수신 처리 (useCallback으로 memoize)
  const handleMessageReceived = useCallback(
    (messageData) => {
      console.log("📨 메시지 수신:", messageData);

      let messageContent;
      let messageType = "TEXT";
      let fileInfo = {};

      // 메시지 내용이 JSON인지 확인 (파일 메시지)
      try {
        const parsedContent = JSON.parse(messageData.content);
        if (
          parsedContent.type &&
          (parsedContent.type === "IMAGE" || parsedContent.type === "FILE")
        ) {
          messageType = parsedContent.type;
          fileInfo = {
            fileUrl: parsedContent.fileUrl,
            fileName: parsedContent.fileName,
            fileSize: parsedContent.fileSize,
          };
          messageContent = messageType === "IMAGE" ? "📷 이미지" : "📁 파일";
          console.log("📎 파일 메시지 수신:", { messageType, fileInfo });
        } else {
          messageContent = messageData.content;
        }
      } catch (e) {
        // JSON이 아닌 경우 일반 텍스트 메시지
        messageContent = messageData.content;
        console.log("💬 텍스트 메시지 수신:", messageContent);
      }

      const newMessage = {
        id: messageData.id || `ws-${Date.now()}-${Math.random()}`, // 서버에서 제공하는 ID 사용
        chatId: messageData.roomId || selectedChatId, // 서버에서 제공하는 roomId 사용
        senderId: messageData.senderId,
        text: messageContent,
        type: messageType,
        ...fileInfo,
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

      setMessages((prev) => {
        // 자신이 보낸 메시지인 경우 낙관적 업데이트된 메시지와 교체
        if (newMessage.isMe) {
          // 최근 5초 내에 보낸 pending 메시지 찾기
          const recentOptimisticMessage = prev.find(
            (msg) =>
              msg.pending &&
              msg.text === newMessage.text &&
              msg.senderId === newMessage.senderId &&
              Date.now() - parseInt(msg.id.split("-")[1]) < 5000
          );

          if (recentOptimisticMessage) {
            console.log(
              "🔄 낙관적 메시지를 서버 메시지로 교체:",
              recentOptimisticMessage.id
            );
            return prev.map((msg) =>
              msg.id === recentOptimisticMessage.id
                ? {
                    ...newMessage,
                    id: recentOptimisticMessage.id,
                    pending: false,
                  }
                : msg
            );
          }
        }

        // 중복 메시지 방지 (서버ID 기반으로 체크)
        if (messageData.id && prev.some((msg) => msg.id === messageData.id)) {
          console.log("🔄 중복 메시지(ID) 무시:", messageData.id);
          return prev;
        }

        // 시간 기반 중복 메시지 방지
        const isDuplicate = prev.some(
          (msg) =>
            !msg.pending &&
            msg.text === newMessage.text &&
            msg.senderId === newMessage.senderId &&
            Math.abs(
              new Date(`1970-01-01 ${msg.timestamp}`) -
                new Date(`1970-01-01 ${newMessage.timestamp}`)
            ) < 3000
        );

        if (isDuplicate) {
          console.log("🔄 중복 메시지(시간) 무시:", newMessage);
          return prev;
        }

        console.log("➕ 새 메시지 추가:", newMessage);
        return [...prev, newMessage];
      });

      // 사용자가 하단에 있을 때만 자동 스크롤
      if (!isUserScrolledUp) {
        setTimeout(() => {
          scrollToBottom();
        }, 50);
      }

      // 메시지 수신 시 채팅방 목록 업데이트 (다른 사용자의 메시지인 경우만)
      if (messageData.senderId !== currentUserId && onMessageUpdate) {
        const messageTime = messageData.sentAt
          ? new Date(messageData.sentAt)
          : new Date();
        onMessageUpdate(selectedChatId, messageContent, messageTime);
      }
    },
    [selectedChatId, currentUserId, onMessageUpdate, isUserScrolledUp]
  ); // 필요한 dependencies만 포함

  // 웹소켓 훅 사용
  const {
    isConnected,
    connectionState,
    sendMessage: sendWebSocketMessage,
    connect,
    disconnect,
  } = useWebSocket(selectedChatId, handleMessageReceived, currentUserId);

  // WebSocket 연결 상태 모니터링 및 재연결
  useEffect(() => {
    console.log("🔌 WebSocket 연결 상태 변경:", {
      isConnected,
      connectionState,
      selectedChatId,
    });

    // 연결이 끊어졌고 채팅방이 선택된 상태면 재연결 시도
    if (!isConnected && selectedChatId && connectionState === "ERROR") {
      console.log("🔄 WebSocket 재연결 시도...");
      setTimeout(() => {
        connect();
      }, 3000);
    }
  }, [isConnected, connectionState, selectedChatId, connect]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom]);

  // 스크롤 위치 감지
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px 여유
      setIsUserScrolledUp(!isAtBottom);
    }
  };

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedChatId]);

  // 새 메시지가 추가될 때만 자동 스크롤 (사용자가 하단에 있을 때만)
  const prevMessagesLengthRef = useRef(0);
  useEffect(() => {
    const isNewMessage = chatMessages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = chatMessages.length;

    if (isNewMessage && chatMessages.length > 0 && !isUserScrolledUp) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // 렌더링이 완료된 후 스크롤
    }
  }, [chatMessages.length, isUserScrolledUp]);

  const scrollToBottom = () => {
    console.log("📜 스크롤 시도:", {
      hasContainer: !!messagesContainerRef.current,
      messagesCount: chatMessages.length,
      isUserScrolledUp,
    });

    // 메시지 컨테이너를 직접 스크롤
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });

      console.log("📜 스크롤 실행 완료");
    }
  };

  /**
   * 파일 업로드 처리
   */
  const handleFileUpload = async (files, messageType) => {
    if (!files || files.length === 0 || !selectedChatId) return;

    setUploading(true);
    try {
      let uploadedUrls;

      if (messageType === "IMAGE") {
        uploadedUrls = await uploadImages(files, "dm-images");
      } else {
        uploadedUrls = await uploadFiles(files);
      }

      // 각 파일에 대해 별도 메시지 생성
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileUrl = uploadedUrls[i];

        if (fileUrl) {
          const fileMessage = {
            type: messageType,
            fileUrl: fileUrl,
            fileName: file.name,
            fileSize: file.size,
          };

          // 웹소켓으로 파일 메시지 전송
          if (isConnected) {
            const success = sendWebSocketMessage(
              JSON.stringify(fileMessage),
              user?.nickname || user?.name || "익명"
            );

            if (success && onMessageUpdate) {
              const previewText =
                messageType === "IMAGE" ? "📷 이미지" : "📁 파일";
              onMessageUpdate(selectedChatId, previewText, new Date());

              // 파일 전송 시에도 하단으로 스크롤
              setIsUserScrolledUp(false);
              setTimeout(() => {
                scrollToBottom();
              }, 100);
            }
          }
        }
      }
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * 이미지 선택 처리
   */
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(isImageFile);

    if (imageFiles.length !== files.length) {
      alert("이미지 파일만 선택해주세요.");
      return;
    }

    if (imageFiles.length > 0) {
      handleFileUpload(imageFiles, "IMAGE");
    }

    // 입력 값 초기화
    event.target.value = "";
  };

  /**
   * 일반 파일 선택 처리
   */
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      handleFileUpload(files, "FILE");
    }

    // 입력 값 초기화
    event.target.value = "";
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) return;

    const messageContent = messageText.trim();
    const timestamp = new Date();

    console.log("🚀 메시지 전송 시도:", {
      selectedChatId,
      messageContent,
      isConnected,
      connectionState,
      currentUserId,
    });

    // 메시지 전송 시 즉시 로컬에 표시 (낙관적 업데이트)
    const optimisticMessage = {
      id: `local-${Date.now()}-${Math.random()}`,
      chatId: selectedChatId,
      senderId: currentUserId,
      text: messageContent,
      type: "TEXT",
      timestamp: timestamp.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      senderNickname: user?.nickname || user?.name || "나",
      pending: true, // 전송 중 표시
    };

    // 즉시 로컬에 메시지 추가
    setMessages((prev) => [...prev, optimisticMessage]);

    // 내가 메시지를 보낼 때는 강제로 하단으로 스크롤
    setIsUserScrolledUp(false);
    setTimeout(() => {
      scrollToBottom();
    }, 50);

    // 웹소켓이 연결되어 있으면 웹소켓으로 전송
    if (isConnected) {
      const success = sendWebSocketMessage(
        messageContent,
        user?.nickname || user?.name || "익명"
      );

      console.log(success ? "✅ 메시지 전송 성공" : "❌ 메시지 전송 실패");

      if (success) {
        // 메시지 전송 성공 시 채팅방 목록 업데이트
        if (onMessageUpdate) {
          onMessageUpdate(selectedChatId, messageContent, timestamp);
        }
        resetMessage();

        // 낙관적 메시지를 확정 상태로 업데이트
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === optimisticMessage.id ? { ...msg, pending: false } : msg
            )
          );
        }, 1000); // 1초 후 pending 상태 제거
      } else {
        console.error("❌ 웹소켓 메시지 전송 실패");
        // 낙관적 메시지를 에러 상태로 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMessage.id
              ? { ...msg, pending: false, error: true }
              : msg
          )
        );
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

        {/* WebSocket 연결 상태 표시 */}
        <div className="dm-connection-status">
          <span
            className={`dm-connection-indicator ${
              isConnected ? "connected" : "disconnected"
            }`}
          >
            {isConnected ? "🟢 연결됨" : "🔴 연결 안됨"}
          </span>
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
        {/* 숨겨진 파일 입력들 */}
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <InputGroup className="dm-message-input-group">
          {/* 첨부 파일 버튼 */}
          <Dropdown className="dm-attachment-dropdown">
            <Dropdown.Toggle
              variant="outline-secondary"
              className="dm-attachment-btn"
              disabled={!isConnected || uploading}
            >
              <Paperclip size={16} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
              >
                <Image size={16} className="me-2" />
                이미지 첨부
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <FileEarmark size={16} className="me-2" />
                파일 첨부
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <FormControl
            as="textarea"
            rows="1"
            placeholder={
              uploading ? "파일 업로드 중..." : "메시지를 입력해보세요"
            }
            value={messageText}
            onChange={onMessageChange}
            onKeyPress={handleKeyPress}
            className="dm-message-input"
            disabled={!isConnected || uploading}
          />

          {uploading && (
            <Button variant="outline-secondary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected || uploading}
            className="dm-send-btn"
          >
            <Send size={16} />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};
