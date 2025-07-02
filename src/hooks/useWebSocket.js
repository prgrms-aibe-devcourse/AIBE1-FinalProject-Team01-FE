import { useEffect, useRef, useCallback, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * 웹소켓 연결 및 메시지 송수신을 관리하는 훅
 * @param {string} roomId - 채팅방 ID
 * @param {function} onMessageReceived - 메시지 수신 시 호출될 콜백 함수
 * @param {string} userId - 현재 사용자 ID
 * @returns {object} 웹소켓 관련 함수들
 */
export const useWebSocket = (
  roomId,
  onMessageReceived,
  userId = "current-user-id"
) => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const currentSubscriptionRef = useRef(null);
  const currentRoomIdRef = useRef(null);

  // 웹소켓 연결 (한 번만)
  const connect = useCallback(() => {
    if (clientRef.current && isConnected) return;

    // SockJS를 사용한 웹소켓 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
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
      setIsConnected(false);
    };

    client.activate();
  }, [isConnected]);

  // 채팅방 구독
  const subscribeToRoom = useCallback(
    (newRoomId) => {
      if (!clientRef.current || !isConnected || !newRoomId) return;

      // 기존 구독 해제
      if (currentSubscriptionRef.current) {
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
          } catch (error) {
            console.error("❌ 메시지 파싱 오류:", error);
          }
        }
      );

      currentSubscriptionRef.current = subscription;
      currentRoomIdRef.current = newRoomId;
    },
    [isConnected, onMessageReceived]
  );

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    if (currentSubscriptionRef.current) {
      currentSubscriptionRef.current.unsubscribe();
      currentSubscriptionRef.current = null;
    }

    if (clientRef.current && isConnected) {
      clientRef.current.deactivate();
      setIsConnected(false);
    }
  }, [isConnected]);

  // 메시지 전송
  const sendMessage = useCallback(
    (messageContent) => {
      if (!clientRef.current || !isConnected || !roomId) {
        console.error("❌ 웹소켓이 연결되지 않음");
        return false;
      }

      try {
        const messageData = {
          content: messageContent,
          senderId: userId,
          roomId: roomId,
          messageType: "TEXT",
          timestamp: new Date().toISOString(),
        };

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
  }, []);

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
