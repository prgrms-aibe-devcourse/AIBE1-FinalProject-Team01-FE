import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export const useSSE = () => {
  const { isLoggedIn } = useAuth();
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000; // 3초

  // 새 알람 수신 콜백
  const [onAlarmReceived, setOnAlarmReceived] = useState(() => () => {});

  // SSE 연결
  const connect = useCallback(() => {
    if (!isLoggedIn || eventSourceRef.current) {
      return;
    }

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      eventSourceRef.current = new EventSource(`${API_BASE_URL}/api/v1/sse`, {
        withCredentials: true,
      });

      // 연결 성공
      eventSourceRef.current.onopen = () => {
        setReconnectAttempts(0);
      };

      // 하트비트 이벤트 처리
      eventSourceRef.current.addEventListener("heartbeat", (event) => {
        // 하트비트 수신 (연결 유지용)
      });

      // 알람 이벤트 처리
      eventSourceRef.current.addEventListener("alarm", (event) => {
        try {
          const alarmData = JSON.parse(event.data);

          // 콜백 함수 호출
          if (onAlarmReceived) {
            onAlarmReceived(alarmData);
          }
        } catch (error) {
          console.error("❌ 알람 데이터 파싱 실패:", error);
        }
      });

      // 에러 처리
      eventSourceRef.current.onerror = (event) => {
        console.error("❌ SSE 연결 에러:", event);

        // 자동 재연결 시도
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          disconnect();
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, RECONNECT_DELAY);
        } else {
          console.error("❌ SSE 최대 재연결 시도 횟수 초과");
        }
      };
    } catch (error) {
      console.error("❌ SSE 연결 생성 실패:", error);
    }
  }, [isLoggedIn, onAlarmReceived, reconnectAttempts]);

  // SSE 연결 해제
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // 서버에 연결 해제 요청
  const disconnectFromServer = useCallback(async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      await fetch(`${API_BASE_URL}/api/v1/sse`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("❌ 서버 SSE 해제 요청 실패:", error);
    }
  }, []);

  // 알람 콜백 등록
  const registerAlarmCallback = useCallback((callback) => {
    setOnAlarmReceived(() => callback);
  }, []);

  // 로그인 상태에 따른 연결/해제
  useEffect(() => {
    if (isLoggedIn) {
      connect();
    } else {
      disconnect();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (isLoggedIn) {
        disconnectFromServer();
      }
      disconnect();
    };
  }, [isLoggedIn, connect, disconnect, disconnectFromServer]);

  // 페이지 언로드 시 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLoggedIn) {
        disconnectFromServer();
      }
      disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isLoggedIn, disconnect, disconnectFromServer]);

  return {
    registerAlarmCallback,
  };
};
