import { useEffect, useRef, useCallback, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * 웹소켓 연결 및 메시지 송수신을 관리하는 훅
 * @param {string} roomId - 채팅방 ID
 * @param {function} onMessageReceived - 메시지 수신 시 호출될 콜백 함수
 * @param {number} userId - 현재 사용자 ID
 * @returns {object} 웹소켓 관련 함수들
 */
export const useWebSocket = (roomId, onMessageReceived, userId) => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState("DISCONNECTED");
  const currentSubscriptionRef = useRef(null);
  const currentRoomIdRef = useRef(null);

  // API 기본 URL 가져오기
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // 웹소켓 연결
  const connect = useCallback(() => {
    if (clientRef.current && isConnected) return;

    setConnectionState("CONNECTING");

    // SockJS를 사용한 웹소켓 클라이언트 생성 (쿠키 자동 전송)
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${API_BASE_URL}/ws`, null, {
          withCredentials: true, // 쿠키 포함하여 전송
        }),
      connectHeaders: {
        // 추가 헤더가 필요한 경우 여기에 설정
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);
      setConnectionState("CONNECTED");
      clientRef.current = client;
    };

    client.onStompError = (frame) => {
      setIsConnected(false);
      setConnectionState("ERROR");
    };

    client.onWebSocketError = (error) => {
      setIsConnected(false);
      setConnectionState("ERROR");
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      setConnectionState("DISCONNECTED");
    };

    client.activate();
  }, [API_BASE_URL]); // isConnected 제거로 불필요한 재연결 방지

  // 채팅방 구독
  const subscribeToRoom = useCallback(
    (newRoomId) => {
      if (!clientRef.current || !isConnected || !newRoomId) return;

      // 이미 같은 방을 구독하고 있다면 중복 구독 방지
      if (
        currentRoomIdRef.current === newRoomId &&
        currentSubscriptionRef.current
      ) {
        return;
      }

      // 기존 구독 해제 (다른 방을 구독하고 있을 때만)
      if (
        currentSubscriptionRef.current &&
        currentRoomIdRef.current !== newRoomId
      ) {
        currentSubscriptionRef.current.unsubscribe();
        currentSubscriptionRef.current = null;
      }

      // 새 채팅방 구독
      const subscription = clientRef.current.subscribe(
        `/topic/dm/room/${newRoomId}`,
        (message) => {
          try {
            const messageBody = JSON.parse(message.body);
            if (onMessageReceived) {
              onMessageReceived(messageBody);
            }
          } catch (error) {}
        }
      );

      currentSubscriptionRef.current = subscription;
      currentRoomIdRef.current = newRoomId;
    },
    [onMessageReceived] // isConnected 제거 - 함수 내부에서 체크하므로 불필요
  );

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    if (currentSubscriptionRef.current) {
      currentSubscriptionRef.current.unsubscribe();
      currentSubscriptionRef.current = null;
    }

    if (clientRef.current) {
      clientRef.current.deactivate();
      setIsConnected(false);
      setConnectionState("DISCONNECTED");
    }
  }, []); // 의존성 제거로 함수 안정화

  // 메시지 전송
  const sendMessage = useCallback(
    (messageContent, senderName, messageType = "TEXT") => {
      if (!clientRef.current || !isConnected || !roomId || !userId) {
        return false;
      }

      try {
        const messageData = {
          content: messageContent,
          senderId: userId,
          senderName: senderName || "익명", // 서버 DTO에 맞춰 senderName 추가
          messageType: messageType, // 파라미터로 받은 messageType 사용
        };

        clientRef.current.publish({
          destination: `/app/dm/room/${roomId}`,
          body: JSON.stringify(messageData),
        });

        return true;
      } catch (error) {
        return false;
      }
    },
    [roomId, userId, isConnected]
  );

  // 초기 연결 (한 번만 실행)
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []); // 빈 배열로 초기 마운트 시에만 실행

  // roomId 변경 시 구독 변경 (isConnected와 roomId 변경 시만)
  useEffect(() => {
    if (isConnected && roomId) {
      // 이미 같은 방을 구독하고 있다면 중복 구독 방지
      if (
        currentRoomIdRef.current === roomId &&
        currentSubscriptionRef.current
      ) {
        return;
      }

      // 기존 구독 해제 (다른 방을 구독하고 있을 때만)
      if (
        currentSubscriptionRef.current &&
        currentRoomIdRef.current !== roomId
      ) {
        currentSubscriptionRef.current.unsubscribe();
        currentSubscriptionRef.current = null;
      }

      // 새 채팅방 구독
      const subscription = clientRef.current.subscribe(
        `/topic/dm/room/${roomId}`,
        (message) => {
          try {
            const messageBody = JSON.parse(message.body);
            if (onMessageReceived) {
              onMessageReceived(messageBody);
            }
          } catch (error) {}
        }
      );

      currentSubscriptionRef.current = subscription;
      currentRoomIdRef.current = roomId;
    }
  }, [roomId, isConnected, onMessageReceived]); // 필요한 의존성만 포함

  return {
    isConnected,
    connectionState,
    sendMessage,
    connect,
    disconnect,
  };
};
