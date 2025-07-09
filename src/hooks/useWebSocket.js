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
  const currentSubscriptionRef = useRef(null);
  const currentRoomIdRef = useRef(null);

  // API 기본 URL 가져오기
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // 웹소켓 연결
  const connect = useCallback(() => {
    if (clientRef.current && isConnected) return;

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
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("🔌 STOMP Debug:", str);
        }
      },
    });

    client.onConnect = (frame) => {
      console.log("✅ WebSocket 연결 성공:", frame);
      setIsConnected(true);
      clientRef.current = client;
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP 오류:", frame.headers["message"]);
      console.error("추가 세부사항:", frame.body);
      setIsConnected(false);
    };

    client.onWebSocketError = (error) => {
      console.error("❌ 웹소켓 오류:", error);
      setIsConnected(false);
    };

    client.onDisconnect = () => {
      console.log("🔌 WebSocket 연결 해제");
      setIsConnected(false);
    };

    client.activate();
  }, [isConnected, API_BASE_URL]);

  // 채팅방 구독
  const subscribeToRoom = useCallback(
    (newRoomId) => {
      if (!clientRef.current || !isConnected || !newRoomId) return;

      // 기존 구독 해제
      if (currentSubscriptionRef.current) {
        currentSubscriptionRef.current.unsubscribe();
        currentSubscriptionRef.current = null;
        console.log(`📤 기존 구독 해제: ${currentRoomIdRef.current}`);
      }

      // 새 채팅방 구독
      const subscription = clientRef.current.subscribe(
        `/topic/dm/room/${newRoomId}`,
        (message) => {
          try {
            const messageBody = JSON.parse(message.body);
            console.log("📥 WebSocket 메시지 수신:", messageBody);
            if (onMessageReceived) {
              onMessageReceived(messageBody);
            }
          } catch (error) {
            console.error("❌ 메시지 파싱 오류:", error);
          }
        }
      );

      currentSubscriptionRef.current = subscription;
      currentRoomIdRef.current = newRoomId;
      console.log(`📡 채팅방 구독 완료: ${newRoomId}`);
    },
    [isConnected, onMessageReceived]
  );

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    if (currentSubscriptionRef.current) {
      currentSubscriptionRef.current.unsubscribe();
      currentSubscriptionRef.current = null;
      console.log("📤 구독 해제");
    }

    if (clientRef.current && isConnected) {
      clientRef.current.deactivate();
      setIsConnected(false);
      console.log("🔌 WebSocket 연결 해제");
    }
  }, [isConnected]);

  // 메시지 전송
  const sendMessage = useCallback(
    (messageContent) => {
      if (!clientRef.current || !isConnected || !roomId || !userId) {
        console.error("❌ 웹소켓이 연결되지 않았거나 필수 정보가 누락됨");
        return false;
      }

      try {
        const messageData = {
          content: messageContent,
          senderId: userId,
          messageType: "TEXT",
        };

        console.log("📤 메시지 전송:", messageData);

        clientRef.current.publish({
          destination: `/app/dm/room/${roomId}`,
          body: JSON.stringify(messageData),
        });

        return true;
      } catch (error) {
        console.error("❌ 메시지 전송 오류:", error);
        return false;
      }
    },
    [roomId, userId, isConnected]
  );

  // 초기 연결
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // roomId 변경 시 구독 변경
  useEffect(() => {
    if (isConnected && roomId) {
      subscribeToRoom(roomId);
    }
  }, [roomId, isConnected, subscribeToRoom]);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect,
  };
};
