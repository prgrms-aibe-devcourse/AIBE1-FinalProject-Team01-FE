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
export const DMChatArea = ({
  selectedChatId,
  onMessageUpdate,
  chatPartnerInfo,
}) => {
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

  // 파일명 캐시 (같은 URL에 대해 중복 요청 방지)
  const fileNameCacheRef = useRef(new Map());

  // S3 URL에서 실제 파일명을 가져오는 비동기 함수
  const fetchRealFileName = async (url) => {
    if (!url) return null;

    // 캐시에서 확인
    if (fileNameCacheRef.current.has(url)) {
      return fileNameCacheRef.current.get(url);
    }

    try {
      // S3에서 실제 파일명 가져오기 (HEAD 요청)
      const response = await fetch(url, {
        method: "HEAD",
        mode: "cors",
      });

      if (response.ok) {
        // Content-Disposition 헤더에서 파일명 추출
        const contentDisposition = response.headers.get("Content-Disposition");
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(
            /filename\*?=['"]?([^'";\n]+)['"]?/i
          );
          if (fileNameMatch && fileNameMatch[1]) {
            let realFileName = decodeURIComponent(fileNameMatch[1]);
            // UTF-8 인코딩 처리
            if (fileNameMatch[0].includes("filename*")) {
              realFileName = realFileName.replace(/^UTF-8''/, "");
            }
            fileNameCacheRef.current.set(url, realFileName);
            return realFileName;
          }
        }
      }
    } catch (error) {
      // 파일명 추출 실패 시 무시
    }

    return null;
  };

  // 동기 버전 (즉시 표시용)
  const extractFileNameFromUrl = (url) => {
    if (!url) return "파일";
    try {
      const urlPath = new URL(url).pathname;
      const fileName = urlPath.split("/").pop();

      if (!fileName) return "파일";

      // 파일 확장자 추출
      const fileExtension = fileName.split(".").pop()?.toLowerCase();

      // UUID 패턴인지 확인 (숫자와 문자, 하이픈으로만 구성된 긴 문자열)
      const isUuidPattern = /^[a-f0-9-]{30,}$/i.test(
        fileName.replace(/\.[^.]+$/, "")
      );

      if (isUuidPattern && fileExtension) {
        // UUID 형태의 파일명인 경우 확장자에 따라 사용자 친화적인 이름 제공
        const fileTypeNames = {
          pdf: "PDF 문서",
          doc: "Word 문서",
          docx: "Word 문서",
          xls: "Excel 문서",
          xlsx: "Excel 문서",
          ppt: "PowerPoint 문서",
          pptx: "PowerPoint 문서",
          txt: "텍스트 파일",
          zip: "압축 파일",
          rar: "압축 파일",
          "7z": "압축 파일",
          jpg: "이미지",
          jpeg: "이미지",
          png: "이미지",
          gif: "이미지",
          mp4: "동영상",
          avi: "동영상",
          mov: "동영상",
          mp3: "음성 파일",
          wav: "음성 파일",
        };

        return `${fileTypeNames[fileExtension] || "파일"}.${fileExtension}`;
      }

      // 일반적인 파일명인 경우 그대로 반환
      return fileName;
    } catch {
      return "파일";
    }
  };

  // 메시지의 파일명을 실제 파일명으로 업데이트하는 함수
  const updateFileNameForMessage = async (messageId, fileUrl) => {
    const realFileName = await fetchRealFileName(fileUrl);
    if (realFileName) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, fileName: realFileName } : msg
        )
      );
    }
  };
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
        let messageType = msg.messageType || "TEXT"; // 서버의 messageType 필드 확인
        let fileInfo = {};

        // messageType이 파일/이미지인 경우 파일 정보 처리
        if (messageType === "IMAGE" || messageType === "FILE") {
          // content가 JSON 형태인지 확인
          try {
            const parsedContent = JSON.parse(msg.content);
            fileInfo = {
              fileUrl: parsedContent.fileUrl || msg.content, // JSON이면 fileUrl, 아니면 content 자체가 URL
              fileName: parsedContent.fileName,
              fileSize: parsedContent.fileSize,
            };
          } catch (e) {
            // JSON이 아닌 경우 content 자체가 파일 URL
            fileInfo = {
              fileUrl: msg.content,
              fileName: extractFileNameFromUrl(msg.content),
              fileSize: null,
            };
          }
          messageContent = messageType === "IMAGE" ? "📷 이미지" : "📁 파일";
        } else {
          // 텍스트 메시지인 경우에도 혹시 JSON 형태의 파일 메시지인지 확인
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
              messageContent =
                messageType === "IMAGE" ? "📷 이미지" : "📁 파일";
            }
          } catch (e) {
            // JSON이 아닌 경우 일반 텍스트 메시지
          }
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
          senderProfileImage: msg.senderProfileImage || null, // 다시 추가!
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

      // 파일 메시지들의 실제 파일명을 비동기적으로 가져와서 업데이트
      formattedMessages.forEach((msg) => {
        if ((msg.type === "IMAGE" || msg.type === "FILE") && msg.fileUrl) {
          updateFileNameForMessage(msg.id, msg.fileUrl);
        }
      });

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
      let messageContent;
      let messageType = messageData.messageType || "TEXT";
      let fileInfo = {};

      // messageType에 따라 처리
      if (messageType === "IMAGE" || messageType === "FILE") {
        // 파일/이미지 메시지: content 파싱 시도
        try {
          const parsedContent = JSON.parse(messageData.content);
          fileInfo = {
            fileUrl: parsedContent.fileUrl,
            fileName:
              parsedContent.fileName ||
              extractFileNameFromUrl(parsedContent.fileUrl),
            fileSize: parsedContent.fileSize,
          };
        } catch (e) {
          // JSON이 아닌 경우 content 자체가 파일 URL
          fileInfo = {
            fileUrl: messageData.content,
            fileName: extractFileNameFromUrl(messageData.content),
            fileSize: null,
          };
        }
        messageContent = messageType === "IMAGE" ? "📷 이미지" : "📁 파일";
      } else {
        // 텍스트 메시지: content를 그대로 사용
        messageContent = messageData.content;
      }

      const newMessage = {
        id: messageData.id || `ws-${Date.now()}-${Math.random()}`,
        chatId: messageData.roomId || selectedChatId,
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
        senderNickname: messageData.senderNickname,
        senderProfileImage: messageData.senderProfileImage || null, // 다시 추가!
      };

      setMessages((prev) => {
        // 자신이 보낸 메시지인 경우 낙관적 업데이트된 메시지와 교체
        if (newMessage.isMe) {
          // 최근 5초 내에 보낸 pending 메시지 찾기
          const recentOptimisticMessage = prev.find((msg) => {
            if (!msg.pending || msg.senderId !== newMessage.senderId)
              return false;

            const timeDiff = Date.now() - parseInt(msg.id.split("-")[1]);
            if (timeDiff >= 5000) return false;

            // 파일 메시지의 경우 fileUrl로 비교, 텍스트 메시지의 경우 text로 비교
            if (newMessage.type === "IMAGE" || newMessage.type === "FILE") {
              return msg.fileUrl === newMessage.fileUrl;
            } else {
              return msg.text === newMessage.text;
            }
          });

          if (recentOptimisticMessage) {
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
          return prev;
        }

        // 시간 기반 중복 메시지 방지
        const isDuplicate = prev.some((msg) => {
          if (msg.pending || msg.senderId !== newMessage.senderId) return false;

          const timeDiff = Math.abs(
            new Date(`1970-01-01 ${msg.timestamp}`) -
              new Date(`1970-01-01 ${newMessage.timestamp}`)
          );

          if (timeDiff >= 3000) return false;

          // 파일 메시지의 경우 fileUrl로 비교, 텍스트 메시지의 경우 text로 비교
          if (newMessage.type === "IMAGE" || newMessage.type === "FILE") {
            return msg.fileUrl === newMessage.fileUrl;
          } else {
            return msg.text === newMessage.text;
          }
        });

        if (isDuplicate) {
          return prev;
        }

        return [...prev, newMessage];
      });

      // 파일 메시지인 경우 실제 파일명을 비동기적으로 가져와서 업데이트
      if (
        (messageType === "IMAGE" || messageType === "FILE") &&
        fileInfo.fileUrl
      ) {
        updateFileNameForMessage(newMessage.id, fileInfo.fileUrl);
      }

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

        // 파일 메시지인 경우 파일명을 포함한 텍스트 생성
        let displayText = messageContent;
        if (messageType === "IMAGE" || messageType === "FILE") {
          const fileEmoji = messageType === "IMAGE" ? "📷" : "📁";
          displayText = `${fileEmoji} ${fileInfo.fileName || "파일"}`;
        }

        onMessageUpdate(selectedChatId, displayText, messageTime);
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
    // 연결이 끊어졌고 채팅방이 선택된 상태면 재연결 시도
    if (!isConnected && selectedChatId && connectionState === "ERROR") {
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
    // 메시지 컨테이너를 직접 스크롤
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
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
          // 즉시 로컬에 파일 메시지 표시 (낙관적 업데이트)
          const optimisticFileMessage = {
            id: `local-${Date.now()}-${Math.random()}`,
            chatId: selectedChatId,
            senderId: currentUserId,
            text: messageType === "IMAGE" ? "📷 이미지" : "📁 파일",
            type: messageType,
            fileUrl: fileUrl,
            fileName: file.name,
            fileSize: file.size,
            timestamp: new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: true,
            senderNickname: user?.nickname || user?.name || "나",
            pending: true,
          };

          setMessages((prev) => [...prev, optimisticFileMessage]);

          // 업로드된 파일의 실제 파일명을 캐시에 저장 (원본 파일명 사용)
          fileNameCacheRef.current.set(fileUrl, file.name);

          // 파일 정보를 JSON 형태로 구성
          const fileContent = JSON.stringify({
            fileUrl: fileUrl,
            fileName: file.name,
            fileSize: file.size,
          });

          // 웹소켓으로 파일 메시지 전송 (content에는 파일 정보 JSON, messageType으로 구분)
          if (isConnected) {
            const success = sendWebSocketMessage(
              fileContent, // content에는 파일 정보 JSON 전송
              user?.nickname || user?.name || "익명",
              messageType // messageType으로 IMAGE 또는 FILE 전송
            );

            if (success && onMessageUpdate) {
              // 파일명을 포함한 미리보기 텍스트 생성
              const fileEmoji = messageType === "IMAGE" ? "📷" : "📁";
              const previewText = `${fileEmoji} ${file.name}`;
              onMessageUpdate(selectedChatId, previewText, new Date());

              // 낙관적 메시지를 확정 상태로 업데이트
              setTimeout(() => {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === optimisticFileMessage.id
                      ? { ...msg, pending: false }
                      : msg
                  )
                );
              }, 1000);

              // 파일 전송 시에도 하단으로 스크롤
              setIsUserScrolledUp(false);
              setTimeout(() => {
                scrollToBottom();
              }, 100);
            } else {
              // 전송 실패 시 에러 상태로 업데이트
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === optimisticFileMessage.id
                    ? { ...msg, pending: false, error: true }
                    : msg
                )
              );
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

  // partner: chatPartnerInfo가 있으면 그걸 우선 사용, 없으면 기존 chatPartner state 사용
  const partner = chatPartnerInfo || chatPartner;

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
              src={partner?.profileImage || chatDefaultImage}
              alt={partner?.nickname || "채팅 상대"}
              className="dm-avatar-img"
            />
          </div>
          <div>
            <div className="dm-chat-user-name">
              {partner?.nickname || "채팅 상대"}
            </div>
            <div className="dm-chat-user-status">
              {partner?.devcourse || "생성형 AI 백엔드 1기"}
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
